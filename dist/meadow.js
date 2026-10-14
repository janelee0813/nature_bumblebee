import * as THREE from './vendor/three.module.js';

// All plants share one clock. Their roots stay fixed; the small bend happens on
// the GPU after the instance transform, so a flower and its stem move together.
export function createMeadow({ mobile = false, path } = {}) {
  const group = new THREE.Group();
  group.name = 'Morning meadow';
  const random = seededRandom(0x6d656164);
  const windTime = { value: 0 };
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  const up = new THREE.Vector3(0, 1, 0);
  const scratch = new THREE.Vector3();
  const curve = path || new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 2.35, 0), new THREE.Vector3(1.5, 2.25, -10),
    new THREE.Vector3(-4, 2.5, -24), new THREE.Vector3(-5, 2.3, -37),
    new THREE.Vector3(4, 2.7, -51), new THREE.Vector3(6, 2.2, -66),
    new THREE.Vector3(-2, 2.35, -83), new THREE.Vector3(-5, 2.45, -100),
    new THREE.Vector3(3, 2.7, -117), new THREE.Vector3(5, 2.25, -133),
    new THREE.Vector3(0, 2.6, -150),
  ]);
  const samples = curve.getPoints(320);
  const start = curve.getPoint(0);
  const tangent = curve.getTangent(0).normalize();
  samples.unshift(start.clone().addScaledVector(tangent, -18));

  function pathX(z) {
    for (let i = 0; i < samples.length - 1; i++) {
      const a = samples[i], b = samples[i + 1];
      if (z <= a.z && z >= b.z) {
        const t = (z - a.z) / (b.z - a.z);
        return THREE.MathUtils.lerp(a.x, b.x, t);
      }
    }
    return z > samples[0].z ? samples[0].x : samples[samples.length - 1].x;
  }

  function distanceFromFlight(x, z) {
    let nearest = Infinity;
    for (let i = 0; i < samples.length - 1; i++) {
      const a = samples[i], b = samples[i + 1];
      // The route is monotonic in depth; distant segments cannot be nearest.
      if (z < b.z - 5 || z > a.z + 5) continue;
      const dx = b.x - a.x, dz = b.z - a.z;
      const t = THREE.MathUtils.clamp(((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz), 0, 1);
      const ex = x - a.x - t * dx, ez = z - a.z - t * dz;
      nearest = Math.min(nearest, ex * ex + ez * ez);
    }
    return Math.sqrt(nearest);
  }

  function heroPocket(x, z, margin = 0) {
    return z < 5 + margin && z > -8 - margin && Math.abs(x) < 6 + margin;
  }

  function groundHeight(x, z) {
    return -0.045 + Math.sin(x * 0.27 + z * 0.043) * 0.034
      + Math.sin(z * 0.22 - x * 0.075) * 0.019;
  }

  function plantMaterial(parameters) {
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.95, metalness: 0, side: THREE.DoubleSide, ...parameters,
    });
    material.onBeforeCompile = shader => {
      shader.uniforms.uTime = windTime;
      shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime;');
      const projection = THREE.ShaderChunk.project_vertex.replace(
        'mvPosition = modelViewMatrix * mvPosition;',
        `float meadowPhase = mvPosition.x * 0.29 + mvPosition.z * 0.19;
         float meadowBend = pow(max(mvPosition.y, 0.0), 2.0) * 0.022;
         float meadowWind = sin(uTime * 0.67 + meadowPhase)
           + 0.30 * sin(uTime * 1.07 + meadowPhase * 1.81);
         mvPosition.x += meadowWind * meadowBend;
         mvPosition.z += cos(uTime * 0.51 + meadowPhase * 0.93) * meadowBend * 0.37;
         mvPosition = modelViewMatrix * mvPosition;`,
      );
      shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', projection);
    };
    material.customProgramCacheKey = () => 'meadow-world-wind-v2';
    return material;
  }

  function finishInstances(mesh, name) {
    mesh.name = name;
    mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
    // Wind bends are small, but enlarge the culling bound to include them.
    mesh.boundingSphere.radius += 0.55;
    mesh.receiveShadow = false;
    mesh.castShadow = false;
    group.add(mesh);
    return mesh;
  }

  function setInstance(mesh, i, position, scale, rotation, tint) {
    dummy.position.copy(position);
    dummy.scale.copy(scale);
    dummy.rotation.set(rotation.x, rotation.y, rotation.z);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    if (tint) mesh.setColorAt(i, tint);
  }

  // Slight relief and broad color patches avoid a flat, painted-looking floor.
  const floorGeometry = new THREE.PlaneGeometry(68, 224, 68, 190);
  floorGeometry.rotateX(-Math.PI / 2);
  floorGeometry.translate(0, 0, -78);
  const floorPositions = floorGeometry.attributes.position;
  const floorColors = new Float32Array(floorPositions.count * 3);
  const moss = new THREE.Color('#587c39');
  const lichen = new THREE.Color('#8ba952');
  for (let i = 0; i < floorPositions.count; i++) {
    const x = floorPositions.getX(i), z = floorPositions.getZ(i);
    floorPositions.setY(i, groundHeight(x, z));
    const patch = 0.5 + 0.21 * Math.sin(x * 0.23 + z * 0.11)
      + 0.17 * Math.sin(x * 0.41 - z * 0.061) * Math.cos(z * 0.17);
    color.copy(moss).lerp(lichen, THREE.MathUtils.clamp(patch, 0, 1));
    floorColors[i * 3] = color.r;
    floorColors[i * 3 + 1] = color.g;
    floorColors[i * 3 + 2] = color.b;
  }
  floorGeometry.setAttribute('color', new THREE.BufferAttribute(floorColors, 3));
  floorGeometry.computeVertexNormals();
  const floorMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 });
  floorMaterial.onBeforeCompile = shader => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vMeadowFloor;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvMeadowFloor = position;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
       varying vec3 vMeadowFloor;
       float meadowNoise(vec2 p) {
         vec2 i = floor(p), f = fract(p);
         f = f * f * (3.0 - 2.0 * f);
         float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
         float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
         float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
         float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
         return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
       }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
       float floorGrain = meadowNoise(vMeadowFloor.xz * 5.0);
       float floorFleck = meadowNoise(vMeadowFloor.xz * 19.0);
       diffuseColor.rgb *= 0.94 + 0.10 * floorGrain + 0.035 * floorFleck;`);
  };
  floorMaterial.customProgramCacheKey = () => 'moss-floor-v2';
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.name = 'Mottled moss floor';
  floor.receiveShadow = true;
  group.add(floor);

  const grassGeometry = makeGrassClump();
  const grassMaterial = plantMaterial({
    color: '#ffffff', vertexColors: true,
    emissive: '#617a34', emissiveIntensity: 0.07,
  });
  const grassPalette = ['#759c44', '#93af5b', '#a4ba65', '#5e873c', '#87a652', '#6e974b'].map(c => new THREE.Color(c));
  const grassCount = mobile ? 6500 : 12000;
  const depthChunks = 16;
  const grassPerChunk = Array.from({ length: depthChunks }, () => []);
  for (let i = 0; i < grassCount; i++) {
    const z = 12 - random() * 187;
    const routeX = pathX(z);
    let x, short = random() < 0.14;
    if (short) {
      x = routeX + (random() - 0.5) * 3.8;
    } else {
      let attempts = 0;
      do {
        x = random() < 0.88
          ? routeX + (random() < 0.5 ? -1 : 1) * (2.05 + Math.pow(random(), 1.9) * 9)
          : (random() - 0.5) * 50;
      } while ((Math.abs(x) > 25 || distanceFromFlight(x, z) < 1.95) && ++attempts < 80);
    }
    if (heroPocket(x, z)) short = true;
    const edgeDistance = distanceFromFlight(x, z);
    const height = short ? 0.18 + random() * 0.36
      : edgeDistance < 3.8 ? 0.65 + Math.pow(random(), 0.75) * 1.45
        : random() < 0.14 ? 1.6 + random() * 1.2
          : 0.55 + Math.pow(random(), 0.85) * 1.55;
    const spread = short ? 0.9 + random() * 0.7 : 0.65 + random() * 0.85;
    const tint = grassPalette[Math.floor(random() * grassPalette.length)].clone();
    tint.multiplyScalar(0.94 + random() * 0.15);
    grassPerChunk[Math.min(depthChunks - 1, Math.floor((12 - z) / 187 * depthChunks))].push({
      x, z, height, spread, tint, yaw: random() * Math.PI * 2,
    });
  }
  grassPerChunk.forEach((plants, chunk) => {
    const mesh = new THREE.InstancedMesh(grassGeometry, grassMaterial, plants.length);
    plants.forEach((plant, i) => setInstance(mesh, i,
      scratch.set(plant.x, groundHeight(plant.x, plant.z), plant.z),
      new THREE.Vector3(plant.spread, plant.height, plant.spread),
      new THREE.Euler(0, plant.yaw, 0), plant.tint));
    finishInstances(mesh, `Grass depth ${chunk + 1}`);
  });

  // The flight gap is filled with soft, low grass rather than bare earth. The
  // closely spaced, bowed leaves overlap in perspective and form a lawn-like
  // carpet below the bee, with enough clearance for every camera orbit.
  const turfCount = mobile ? 16000 : 22000;
  const turfGeometry = makeGrassClump(true);
  const turfPalette = ['#86a94d', '#749944', '#a1b961', '#94af54', '#668b3c', '#b0c474'].map(c => new THREE.Color(c));
  const turfPerChunk = Array.from({ length: depthChunks }, () => []);
  for (let i = 0; i < turfCount; i++) {
    const z = 12 - random() * 187;
    const routeX = pathX(z);
    const spreadRegion = random();
    let x;
    if (spreadRegion < 0.55) x = routeX + (random() - 0.5) * 6;
    else if (spreadRegion < 0.92) x = routeX + (random() < 0.5 ? -1 : 1) * (3 + random() * 9);
    else x = (random() - 0.5) * 50;
    x = THREE.MathUtils.clamp(x, -25, 25);
    const height = 0.24 + Math.pow(random(), 0.8) * 0.36;
    const spread = 0.76 + random() * 0.55;
    const tint = turfPalette[Math.floor(random() * turfPalette.length)].clone();
    tint.multiplyScalar(0.93 + random() * 0.15);
    turfPerChunk[Math.min(depthChunks - 1, Math.floor((12 - z) / 187 * depthChunks))].push({
      x, z, height, spread, tint, yaw: random() * Math.PI * 2,
    });
  }
  turfPerChunk.forEach((plants, chunk) => {
    const mesh = new THREE.InstancedMesh(turfGeometry, grassMaterial, plants.length);
    plants.forEach((plant, i) => setInstance(mesh, i,
      scratch.set(plant.x, groundHeight(plant.x, plant.z) + 0.006, plant.z),
      new THREE.Vector3(plant.spread, plant.height, plant.spread),
      new THREE.Euler(0, plant.yaw, 0), plant.tint));
    finishInstances(mesh, `Low meadow carpet ${chunk + 1}`);
  });

  const leafGeometry = makeLeafGeometry(0.68, 0.18);
  const leafMaterial = plantMaterial({
    color: '#ffffff', vertexColors: true,
    emissive: '#64883d', emissiveIntensity: 0.045,
  });
  const stemMaterial = plantMaterial({ color: '#7e9b48' });
  const stemGeometry = new THREE.CylinderGeometry(0.009, 0.016, 1, 5, 1);
  stemGeometry.translate(0, 0.5, 0);

  function plantPosition(minDistance = 2.65) {
    let x, z, tries = 0;
    do {
      z = 8 - random() * 171;
      x = pathX(z) + (random() < 0.5 ? -1 : 1) * (minDistance + random() * 9);
    } while ((Math.abs(x) > 23 || distanceFromFlight(x, z) < minDistance || heroPocket(x, z, 1)) && ++tries < 100);
    return new THREE.Vector3(x, groundHeight(x, z), z);
  }

  // Broad, creased leaves catch the low morning light among the thin blades.
  const broadPlantCount = mobile ? 550 : 1000;
  const broadStems = new THREE.InstancedMesh(stemGeometry, stemMaterial, broadPlantCount);
  const broadLeaves = new THREE.InstancedMesh(leafGeometry, leafMaterial, broadPlantCount * 3);
  for (let i = 0; i < broadPlantCount; i++) {
    const p = plantPosition(2.35);
    const h = 0.45 + random() * 0.85;
    const yaw = random() * Math.PI * 2;
    setInstance(broadStems, i, p, new THREE.Vector3(1.2, h, 1.2), new THREE.Euler(0, yaw, 0));
    for (let j = 0; j < 3; j++) {
      const angle = yaw + j * 2.25 + random() * 0.3;
      const tilt = 0.75 + random() * 0.35;
      const direction = new THREE.Vector3(Math.cos(angle) * Math.sin(tilt), Math.cos(tilt), Math.sin(angle) * Math.sin(tilt));
      dummy.position.copy(p).add(scratch.set(0, h * (0.22 + j * 0.22), 0));
      dummy.quaternion.setFromUnitVectors(up, direction);
      const size = 0.8 + random() * 0.65;
      dummy.scale.set(size, size, size);
      dummy.updateMatrix();
      const index = i * 3 + j;
      broadLeaves.setMatrixAt(index, dummy.matrix);
      broadLeaves.setColorAt(index, color.set('#90ad5b').multiplyScalar(0.89 + random() * 0.18));
    }
  }
  finishInstances(broadStems, 'Broadleaf stems');
  finishInstances(broadLeaves, 'Creased meadow leaves');

  const daisyCount = mobile ? 76 : 132;
  const lilacCount = mobile ? 28 : 46;
  const flowerCount = daisyCount + lilacCount + 1;
  const flowerStems = new THREE.InstancedMesh(makeFlowerStem(), stemMaterial, flowerCount);
  const flowerLeaves = new THREE.InstancedMesh(leafGeometry, leafMaterial, flowerCount * 2);
  const daisyGeometry = makePetals({ count: 13, length: 0.255, width: 0.061, inner: 0.055, seed: 97 });
  const creamMaterial = plantMaterial({ color: '#ffffff', roughness: 0.9 });
  const daisies = new THREE.InstancedMesh(daisyGeometry, creamMaterial, daisyCount + 1);
  const centers = new THREE.InstancedMesh(makeFlowerCenter(), plantMaterial({ color: '#ffffff', roughness: 1 }), daisyCount + 1);
  const lilacPetals = makePetals({ count: 5, length: 0.112, width: 0.062, inner: 0.011, seed: 416 });
  const lilacs = new THREE.InstancedMesh(lilacPetals, plantMaterial({ color: '#ffffff', roughness: 0.95 }), lilacCount * 5);
  const lilacBranchCount = lilacCount * 4;
  const lilacBranches = new THREE.InstancedMesh(stemGeometry, stemMaterial, lilacBranchCount);
  let branchIndex = 0;

  function addFlowerStem(index, p, height, yaw) {
    setInstance(flowerStems, index, p, new THREE.Vector3(1, height, 1), new THREE.Euler(0, yaw, 0));
    for (let j = 0; j < 2; j++) {
      const angle = yaw + (j ? Math.PI : 0) + 0.6;
      const direction = new THREE.Vector3(Math.cos(angle) * 0.79, 0.53, Math.sin(angle) * 0.79).normalize();
      dummy.position.copy(p).add(scratch.set(0.035 * Math.cos(yaw), height * (0.29 + j * 0.25), -0.035 * Math.sin(yaw)));
      dummy.quaternion.setFromUnitVectors(up, direction);
      dummy.scale.setScalar(0.52 + j * 0.08);
      dummy.updateMatrix();
      flowerLeaves.setMatrixAt(index * 2 + j, dummy.matrix);
      flowerLeaves.setColorAt(index * 2 + j, color.set('#95b365'));
    }
    return p.clone().add(new THREE.Vector3(0.1 * Math.cos(yaw) + 0.03 * Math.sin(yaw), height, -0.1 * Math.sin(yaw) + 0.03 * Math.cos(yaw)));
  }

  for (let i = 0; i < daisyCount + 1; i++) {
    const finalFlower = i === daisyCount;
    const endpoint = curve.getPoint(1);
    const p = finalFlower
      ? new THREE.Vector3(endpoint.x + 3.6, groundHeight(endpoint.x + 3.6, endpoint.z - 0.8), endpoint.z - 0.8)
      : plantPosition(2.5);
    const h = finalFlower ? 2.7 : 0.9 + random() * 1.3;
    const yaw = random() * Math.PI * 2;
    const head = addFlowerStem(i, p, h, yaw);
    const size = finalFlower ? 1.9 : 0.86 + random() * 0.60;
    const rotation = new THREE.Euler((random() - 0.5) * 0.48, yaw, (random() - 0.5) * 0.48);
    setInstance(daisies, i, head, new THREE.Vector3(size, size, size), rotation,
      color.set(finalFlower ? '#fff9e7' : i % 7 === 0 ? '#f8ded3' : '#fff9e7').multiplyScalar(0.96 + random() * 0.08));
    setInstance(centers, i, head, new THREE.Vector3(size, size, size), rotation,
      color.set('#e7bb45').multiplyScalar(0.96 + random() * 0.12));
  }

  for (let i = 0; i < lilacCount; i++) {
    const p = plantPosition(3.2);
    const h = 1.05 + random() * 1.1;
    const yaw = random() * Math.PI * 2;
    const head = addFlowerStem(daisyCount + 1 + i, p, h, yaw);
    for (let j = 0; j < 5; j++) {
      const angle = yaw + j * 2.4;
      const radius = j === 0 ? 0 : 0.13 + random() * 0.07;
      const flowerPosition = head.clone().add(new THREE.Vector3(Math.cos(angle) * radius, j === 0 ? 0.08 : -0.02 - random() * 0.11, Math.sin(angle) * radius));
      const size = 0.8 + random() * 0.5;
      setInstance(lilacs, i * 5 + j, flowerPosition, new THREE.Vector3(size, size, size),
        new THREE.Euler((random() - 0.5) * 0.8, angle, (random() - 0.5) * 0.8),
        color.set(i % 3 === 0 ? '#ecc7df' : '#cfb4e5').multiplyScalar(0.94 + random() * 0.12));
      if (j) {
        const branchStart = head.clone().add(scratch.set(0, -0.25, 0));
        const delta = flowerPosition.clone().sub(branchStart);
        dummy.position.copy(branchStart);
        dummy.quaternion.setFromUnitVectors(up, delta.clone().normalize());
        dummy.scale.set(0.68, delta.length(), 0.68);
        dummy.updateMatrix();
        lilacBranches.setMatrixAt(branchIndex++, dummy.matrix);
      }
    }
  }
  finishInstances(flowerStems, 'Wildflower curved stems');
  finishInstances(flowerLeaves, 'Wildflower leaves');
  finishInstances(daisies, 'Cream daisy petals');
  finishInstances(centers, 'Golden daisy centers');
  finishInstances(lilacs, 'Small lilac blossoms');
  finishInstances(lilacBranches, 'Lilac flowering branches');

  // A very distant, uneven hedgerow grounds the horizon without crowding the
  // close meadow or introducing repeated spherical trees in the flight route.
  const hedgeCount = mobile ? 32 : 50;
  const hedgeGeometry = new THREE.IcosahedronGeometry(1, 3);
  const hedgePosition = hedgeGeometry.attributes.position;
  for (let i = 0; i < hedgePosition.count; i++) {
    const x = hedgePosition.getX(i), y = hedgePosition.getY(i), z = hedgePosition.getZ(i);
    const irregularity = 1 + 0.11 * Math.sin(x * 5.3 + y * 3.1) * Math.cos(z * 6.4 - y * 2.1);
    hedgePosition.setXYZ(i, x * irregularity, y * irregularity, z * irregularity);
  }
  // PolyhedronGeometry supplies smooth radial normals. Keep them after the
  // subtle displacement; recomputing a non-indexed mesh would create facets.
  hedgeGeometry.normalizeNormals();
  const hedge = new THREE.InstancedMesh(hedgeGeometry, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1 }), hedgeCount);
  for (let i = 0; i < hedgeCount; i++) {
    const side = i % 2 ? -1 : 1;
    const z = -16 - (i / 2) * (mobile ? 10.8 : 7.1) + random() * 6;
    const height = 2.8 + random() * 3;
    setInstance(hedge, i, new THREE.Vector3(side * (27 + random() * 5), height * 0.38, z),
      new THREE.Vector3(3.8 + random() * 2, height, 5 + random() * 3),
      new THREE.Euler(0, random() * Math.PI, (random() - 0.5) * 0.18),
      color.set('#91ad69').multiplyScalar(0.86 + random() * 0.13));
  }
  finishInstances(hedge, 'Peripheral sage hedgerow');

  group.userData.counts = {
    grassClumps: grassCount, grassBlades: grassCount * 3,
    turfClumps: turfCount, turfBlades: turfCount * 4,
    broadleafPlants: broadPlantCount, wildflowerPlants: flowerCount,
    daisyHeads: daisyCount + 1, lilacBlossoms: lilacCount * 5,
    drawCalls: group.children.length,
  };

  return {
    group,
    update(time, { reduced = false } = {}) {
      windTime.value = reduced ? 0 : time;
    },
  };
}

function seededRandom(seed) {
  return () => {
    seed += 0x6d2b79f5;
    let n = seed;
    n = Math.imul(n ^ n >>> 15, n | 1);
    n ^= n + Math.imul(n ^ n >>> 7, n | 61);
    return ((n ^ n >>> 14) >>> 0) / 4294967296;
  };
}

function makeGrassClump(turf = false) {
  const positions = [], colors = [], indices = [];
  const segments = turf ? 4 : 6;
  const configurations = turf ? [
    { x: 0, z: 0, angle: 0.23, height: 1, width: 0.072, bend: 0.16, droop: 0.07 },
    { x: 0.13, z: -0.065, angle: 2.6, height: 0.85, width: 0.068, bend: 0.22, droop: 0.10 },
    { x: -0.095, z: 0.12, angle: 4.8, height: 0.71, width: 0.065, bend: 0.18, droop: 0.08 },
    { x: 0.02, z: -0.09, angle: 5.7, height: 0.92, width: 0.067, bend: 0.26, droop: 0.12 },
  ] : [
    { x: 0, z: 0, angle: 0.23, height: 1, width: 0.10, bend: 0.42, droop: 0.10 },
    { x: 0.13, z: -0.065, angle: 2.6, height: 0.86, width: 0.085, bend: 0.56, droop: 0.18 },
    { x: -0.095, z: 0.12, angle: 4.8, height: 0.71, width: 0.09, bend: 0.46, droop: 0.13 },
  ];
  for (const blade of configurations) {
    const base = positions.length / 3;
    const sideX = Math.cos(blade.angle), sideZ = Math.sin(blade.angle);
    const forwardX = -sideZ, forwardZ = sideX;
    for (let row = 0; row <= segments; row++) {
      const t = row / segments;
      const width = blade.width * Math.pow(1 - t, 0.55) * (0.35 + 0.65 * Math.sin(t * Math.PI));
      const lean = blade.bend * t * t;
      const sideCurve = Math.sin(t * Math.PI) * (turf ? 0.023 : 0.035);
      for (let edge = -1; edge <= 1; edge++) {
        const fold = edge === 0 ? 0.013 * Math.sin(Math.PI * t) : 0;
        positions.push(
          blade.x + sideX * (width * edge + sideCurve) + forwardX * (lean + fold),
          blade.height * t * (1 - blade.droop * t * t),
          blade.z + sideZ * (width * edge + sideCurve) + forwardZ * (lean + fold),
        );
        colors.push(0.80 + 0.20 * t, 0.87 + 0.13 * t, 0.69 + 0.27 * t);
      }
    }
    for (let row = 0; row < segments; row++) {
      const a = base + row * 3;
      indices.push(a, a + 3, a + 1, a + 1, a + 3, a + 4,
        a + 1, a + 4, a + 2, a + 2, a + 4, a + 5);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function makeLeafGeometry(length, width) {
  const positions = [], colors = [], indices = [];
  const rows = 9;
  for (let row = 0; row <= rows; row++) {
    const t = row / rows;
    const w = width * Math.pow(Math.sin(t * Math.PI), 0.62) * (1 - t * 0.15);
    for (let edge = -1; edge <= 1; edge++) {
      positions.push(w * edge, t * length, 0.11 * t * t + (edge === 0 ? 0.018 * Math.sin(t * Math.PI) : -0.012 * Math.sin(t * Math.PI)));
      colors.push(0.84 + t * 0.16, 0.91 + t * 0.09, 0.72 + t * 0.23);
    }
  }
  for (let row = 0; row < rows; row++) {
    const a = row * 3;
    indices.push(a, a + 3, a + 1, a + 1, a + 3, a + 4,
      a + 1, a + 4, a + 2, a + 2, a + 4, a + 5);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function makeFlowerStem() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(-0.018, 0.3, -0.015),
    new THREE.Vector3(0.04, 0.68, -0.01), new THREE.Vector3(0.1, 1, 0.03),
  ]);
  return new THREE.TubeGeometry(curve, 9, 0.012, 5, false);
}

function makePetals({ count, length, width, inner, seed }) {
  const random = seededRandom(seed);
  const positions = [], indices = [];
  const rows = 8;
  for (let petal = 0; petal < count; petal++) {
    const angle = petal / count * Math.PI * 2 + (random() - 0.5) * 0.18;
    const extent = length * (0.8 + random() * 0.3);
    const fullness = width * (0.8 + random() * 0.35);
    const curl = (random() - 0.35) * 0.09;
    const base = positions.length / 3;
    for (let row = 0; row <= rows; row++) {
      const t = row / rows;
      const radius = inner + extent * t;
      const w = fullness * Math.pow(Math.sin(Math.PI * t), 0.48);
      const twist = Math.sin(t * Math.PI) * (random() - 0.5) * 0.013;
      for (let edge = -1; edge <= 1; edge++) {
        const lateral = edge * w + twist;
        const y = 0.025 + Math.sin(Math.PI * t) * 0.037 + curl * t * t
          + (edge === 0 ? 0.007 : -0.011) * Math.sin(Math.PI * t);
        positions.push(Math.cos(angle) * radius - Math.sin(angle) * lateral, y,
          Math.sin(angle) * radius + Math.cos(angle) * lateral);
      }
    }
    for (let row = 0; row < rows; row++) {
      const a = base + row * 3;
      indices.push(a, a + 1, a + 3, a + 1, a + 4, a + 3,
        a + 1, a + 2, a + 4, a + 2, a + 5, a + 4);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function makeFlowerCenter() {
  const geometry = new THREE.SphereGeometry(0.076, 12, 8);
  geometry.scale(1, 0.58, 1);
  geometry.translate(0, 0.038, 0);
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    positions.setY(i, y + Math.sin(x * 190 + z * 87) * 0.004 * Math.max(0, y / 0.08));
  }
  geometry.computeVertexNormals();
  return geometry;
}

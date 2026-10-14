import * as THREE from './vendor/three.module.js';

// A small, asset-free Bombus. Everything is constructed once; the flight loop
// only moves hinges. Local -Z is the direction of travel.
export function createBee({ mobile = false } = {}) {
  const group = new THREE.Group();
  group.name = 'Bumblebee';
  let seed = 19071;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const gold = new THREE.Color('#d9a735');
  const dark = new THREE.Color('#191b18');
  const cream = new THREE.Color('#d4c8aa');
  const amber = new THREE.Color('#ae7528');
  const shellMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true, roughness: 0.91, metalness: 0.015,
  });
  const chitin = new THREE.MeshStandardMaterial({ color: '#20251e', roughness: 0.52, metalness: 0.10 });
  const jointMaterial = new THREE.MeshStandardMaterial({ color: '#332d1e', roughness: 0.78 });
  const pollenMaterial = new THREE.MeshStandardMaterial({ color: '#d49b27', roughness: 0.96 });
  const facetPixels = new Uint8Array(128 * 128 * 4);
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const u = x / 128 * 18, v = y / 128 * 18 * 0.8660254;
      const row = Math.round(v / 0.8660254);
      let distance = 10;
      for (let r = row - 1; r <= row + 1; r++) {
        const shift = (r & 1) * 0.5;
        const column = Math.round(u - shift);
        distance = Math.min(distance, Math.hypot(u - column - shift, v - r * 0.8660254));
      }
      const value = Math.round(70 + 170 * Math.max(0, 1 - (distance / 0.59) ** 2));
      const offset = (y * 128 + x) * 4;
      facetPixels[offset] = facetPixels[offset + 1] = facetPixels[offset + 2] = value;
      facetPixels[offset + 3] = 255;
    }
  }
  const facets = new THREE.DataTexture(facetPixels, 128, 128);
  facets.wrapS = facets.wrapT = THREE.RepeatWrapping;
  facets.magFilter = facets.minFilter = THREE.LinearFilter;
  facets.needsUpdate = true;
  const eyeMaterial = new THREE.MeshPhysicalMaterial({
    color: '#090e0d', roughness: 0.14, metalness: 0.12,
    clearcoat: 1, clearcoatRoughness: 0.11, bumpMap: facets, bumpScale: 0.0018,
  });
  const sphere = new THREE.SphereGeometry(1, mobile ? 20 : 32, mobile ? 14 : 24);
  const smallSphere = new THREE.SphereGeometry(1, 10, 7);

  function mesh(geometry, material, parent = group) {
    const object = new THREE.Mesh(geometry, material);
    parent.add(object);
    return object;
  }

  function oval(parent, material, center, scale, geometry = sphere) {
    const object = mesh(geometry, material, parent);
    object.position.set(...center);
    object.scale.set(...scale);
    object.castShadow = true;
    object.receiveShadow = true;
    return object;
  }

  function thoraxColor(x, y, z) {
    // The yellow collar wraps around the shoulder. A charcoal saddle makes the
    // bee readable as a natural bumblebee even when the belly is out of view.
    if (y < -0.40 || (z > 0.66 && y < 0.18)) return dark;
    if (y > 0.60 && z > -0.30 && z < 0.42 && Math.abs(x) < 0.56) return dark;
    return gold;
  }

  function abdomenColor(x, y, z) {
    if (z > 0.80) return cream;
    if (z > 0.04 || z < -0.77) return dark;
    return gold;
  }

  const fields = [
    { center: [0, 0, 0], radii: [0.375, 0.380, 0.415], color: thoraxColor, blades: 1040, lines: 1030, length: 0.065 },
    { center: [0, -0.065, 0.65], radii: [0.340, 0.304, 0.592], color: abdomenColor, blades: 1380, lines: 1100, length: 0.057 },
    { center: [0, 0.005, -0.59], radii: [0.254, 0.252, 0.267], color: () => dark, blades: 450, lines: 470, length: 0.034 },
  ];

  function makeShell(field) {
    const positions = [], normals = [], colors = [], indices = [];
    const rings = mobile ? 24 : 40, segments = mobile ? 32 : 52;
    const color = new THREE.Color();
    for (let row = 0; row <= rings; row++) {
      const phi = row / rings * Math.PI;
      for (let col = 0; col <= segments; col++) {
        const theta = col / segments * Math.PI * 2;
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.sin(phi) * Math.sin(theta);
        const z = Math.cos(phi);
        // A faint waist between the abdominal plates is visible through the
        // hairs without breaking the continuous volume of the abdomen.
        const rib = field === fields[1] ? 1 - 0.009 * Math.pow(Math.sin((z + 1) * 11.2), 12) : 1;
        positions.push(
          field.center[0] + x * field.radii[0] * rib,
          field.center[1] + y * field.radii[1] * rib,
          field.center[2] + z * field.radii[2],
        );
        const n = new THREE.Vector3(x / field.radii[0], y / field.radii[1], z / field.radii[2]).normalize();
        normals.push(n.x, n.y, n.z);
        color.copy(field.color(x, y, z));
        const light = 0.95 + 0.05 * y;
        color.multiplyScalar(light);
        colors.push(color.r, color.g, color.b);
        if (row < rings && col < segments) {
          const a = row * (segments + 1) + col;
          const b = a + segments + 1;
          indices.push(a, b, a + 1, b, b + 1, a + 1);
        }
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    const body = mesh(geometry, shellMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
  }
  fields.forEach(makeShell);

  // Crossed, tapered fibres catch the key light. Finer line fibres give the
  // perimeter a soft halo. The desktop fur has 22,420 vertices in two draws.
  const furPositions = [], furNormals = [], furColors = [];
  const linePositions = [], lineColors = [];
  const p = new THREE.Vector3(), n = new THREE.Vector3(), direction = new THREE.Vector3();
  const tangent = new THREE.Vector3(), across = new THREE.Vector3(), across2 = new THREE.Vector3();
  const base = new THREE.Vector3(), tip = new THREE.Vector3();
  const fibreColor = new THREE.Color(), tipColor = new THREE.Color();

  function furVertex(point, normal, color) {
    furPositions.push(point.x, point.y, point.z);
    furNormals.push(normal.x, normal.y, normal.z);
    furColors.push(color.r, color.g, color.b);
  }

  for (const field of fields) {
    const count = Math.round(field.blades * (mobile ? 0.56 : 1));
    const fineCount = Math.round(field.lines * (mobile ? 0.68 : 1));
    for (let i = 0; i < count + fineCount; i++) {
      const z = random() * 2 - 1;
      const angle = random() * Math.PI * 2;
      const ring = Math.sqrt(1 - z * z);
      const x = ring * Math.cos(angle), y = ring * Math.sin(angle);
      p.set(x * field.radii[0], y * field.radii[1], z * field.radii[2]);
      p.x += field.center[0]; p.y += field.center[1]; p.z += field.center[2];
      n.set(x / field.radii[0], y / field.radii[1], z / field.radii[2]).normalize();
      tangent.set(0, 0, 1).addScaledVector(n, -n.z).normalize();
      direction.copy(n).multiplyScalar(0.86).addScaledVector(tangent, 0.24 + random() * 0.18).normalize();
      const length = field.length * (0.40 + random() * 0.80);
      base.copy(p).addScaledVector(n, -0.002);
      tip.copy(base).addScaledVector(direction, length);
      fibreColor.copy(field.color(x, y, z)).multiplyScalar(0.70 + random() * 0.38);
      tipColor.copy(fibreColor).lerp(field.color(x, y, z) === dark ? amber : cream, field.color(x, y, z) === dark ? 0.065 : 0.18);
      if (i < count) {
        const width = (0.0017 + random() * 0.0016) * (field === fields[2] ? 0.65 : 1);
        across.set(Math.cos(angle + 1.0), Math.sin(angle + 1.0), 0.23).cross(direction).normalize().multiplyScalar(width);
        across2.copy(direction).cross(across).normalize().multiplyScalar(width * 0.8);
        // Two tiny intersecting triangles taper to the same hair tip.
        p.copy(base).add(across); furVertex(p, n, fibreColor);
        p.copy(base).sub(across); furVertex(p, n, fibreColor);
        furVertex(tip, n, tipColor);
        p.copy(base).add(across2); furVertex(p, n, fibreColor);
        p.copy(base).sub(across2); furVertex(p, n, fibreColor);
        furVertex(tip, n, tipColor);
      } else {
        linePositions.push(base.x, base.y, base.z, tip.x, tip.y, tip.z);
        lineColors.push(fibreColor.r, fibreColor.g, fibreColor.b, tipColor.r, tipColor.g, tipColor.b);
      }
    }
  }
  const furGeometry = new THREE.BufferGeometry();
  furGeometry.setAttribute('position', new THREE.Float32BufferAttribute(furPositions, 3));
  furGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(furNormals, 3));
  furGeometry.setAttribute('color', new THREE.Float32BufferAttribute(furColors, 3));
  mesh(furGeometry, new THREE.MeshStandardMaterial({
    vertexColors: true, side: THREE.DoubleSide, roughness: 1, metalness: 0,
  })).name = 'Light-catching coat';
  const fineGeometry = new THREE.BufferGeometry();
  fineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  fineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
  const fineFur = new THREE.LineSegments(fineGeometry, new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.67, depthWrite: false,
  }));
  fineFur.name = 'Fine fur';
  group.add(fineFur);

  // Compound eyes sit in the head volume, with no human pupils or mouth.
  for (const side of [-1, 1]) {
    const eye = oval(group, eyeMaterial, [side * 0.213, 0.057, -0.649], [0.103, 0.174, 0.167]);
    eye.rotation.y = side * -0.28;
    eye.rotation.z = side * -0.13;
    eye.name = side < 0 ? 'Left compound eye' : 'Right compound eye';
  }
  // Three tiny ocelli on the crown catch a restrained pin of light.
  for (const [x, y, z] of [[-0.055, 0.235, -0.60], [0.055, 0.235, -0.60], [0, 0.241, -0.655]]) {
    oval(group, eyeMaterial, [x, y, z], [0.021, 0.013, 0.021], smallSphere);
  }

  function tube(points, radius, material, parent = group, segments = 12, radial = 5) {
    const curve = new THREE.CatmullRomCurve3(points.map(v => new THREE.Vector3(...v)));
    const object = mesh(new THREE.TubeGeometry(curve, segments, radius, radial, false), material, parent);
    object.castShadow = true;
    return object;
  }

  function bone(parent, a, b, radiusA, radiusB, material) {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
    const object = mesh(new THREE.CylinderGeometry(radiusB, radiusA, start.distanceTo(end), 7, 1), material, parent);
    object.position.copy(start).add(end).multiplyScalar(0.5);
    object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize());
    object.castShadow = true;
    return object;
  }

  for (const side of [-1, 1]) {
    tube([[side * 0.050, -0.148, -0.807], [side * 0.076, -0.192, -0.848], [side * 0.037, -0.206, -0.858]], 0.017, chitin, group, 10, 6);
  }
  oval(group, chitin, [0, -0.124, -0.823], [0.056, 0.049, 0.025], smallSphere);

  const antennae = [];
  for (const side of [-1, 1]) {
    const hinge = new THREE.Group();
    hinge.position.set(side * 0.108, 0.17, -0.791);
    group.add(hinge);
    bone(hinge, [0, 0, 0], [side * 0.016, 0.105, -0.109], 0.014, 0.010, chitin);
    oval(hinge, jointMaterial, [side * 0.016, 0.105, -0.109], [0.015, 0.014, 0.015], smallSphere);
    tube([[side * 0.016, 0.105, -0.109], [side * 0.053, 0.151, -0.207], [side * 0.093, 0.168, -0.321]], 0.008, chitin, hinge, 14, 5);
    // A few fine articulations on the flagellum are visible at the hero scale.
    for (let j = 1; j < 6; j++) {
      const t = j / 6;
      oval(hinge, jointMaterial, [side * (0.016 + 0.077 * t), 0.105 + 0.067 * t, -0.109 - 0.212 * t], [0.009, 0.010, 0.009], smallSphere);
    }
    antennae.push({ hinge, side });
  }

  const legs = [];
  const legDefinitions = [
    { root: [0.21, -0.19, -0.23], knee: [0.38, -0.33, -0.33], ankle: [0.47, -0.49, -0.46], foot: [0.43, -0.60, -0.57] },
    { root: [0.26, -0.19, 0.035], knee: [0.47, -0.32, 0.16], ankle: [0.57, -0.50, 0.29], foot: [0.48, -0.66, 0.34] },
    { root: [0.25, -0.16, 0.255], knee: [0.45, -0.31, 0.49], ankle: [0.52, -0.50, 0.71], foot: [0.41, -0.66, 0.82] },
  ];
  for (const side of [-1, 1]) {
    legDefinitions.forEach((definition, index) => {
      const hinge = new THREE.Group();
      const root = definition.root;
      hinge.position.set(root[0] * side, root[1], root[2]);
      group.add(hinge);
      const local = v => [(v[0] - root[0]) * side, v[1] - root[1], v[2] - root[2]];
      const a = [0, 0, 0], b = local(definition.knee), c = local(definition.ankle), d = local(definition.foot);
      bone(hinge, a, b, 0.038, 0.024, chitin);
      bone(hinge, b, c, index === 2 ? 0.041 : 0.024, index === 2 ? 0.028 : 0.013, chitin);
      oval(hinge, jointMaterial, b, [0.030, 0.027, 0.028], smallSphere);
      oval(hinge, chitin, c, [0.019, 0.019, 0.020], smallSphere);
      tube([c, [(c[0] + d[0]) * 0.5 + side * 0.008, (c[1] + d[1]) * 0.5, (c[2] + d[2]) * 0.5], d], 0.010, chitin, hinge, 10);
      const clawTip = [d[0] + side * 0.013, d[1] + 0.008, d[2] + (index === 0 ? -0.038 : 0.038)];
      tube([d, [d[0] + side * 0.025, d[1] - 0.014, d[2] + (index === 0 ? -0.022 : 0.022)], clawTip], 0.0045, chitin, hinge, 6, 4);
      tube([d, [d[0] - side * 0.012, d[1] - 0.014, d[2] + (index === 0 ? -0.026 : 0.026)], [clawTip[0] - side * 0.022, clawTip[1], clawTip[2]]], 0.0045, chitin, hinge, 6, 4);
      if (index === 2) {
        // The hind tibia is flattened, fringed and dusted with pollen.
        const basket = oval(hinge, pollenMaterial,
          [(b[0] + c[0]) / 2 + side * 0.011, (b[1] + c[1]) / 2 - 0.008, (b[2] + c[2]) / 2],
          [0.038, 0.041, 0.102], smallSphere);
        basket.rotation.x = -0.55;
        for (let j = 0; j < (mobile ? 5 : 9); j++) {
          const t = 0.15 + random() * 0.7;
          const fleck = [b[0] + (c[0] - b[0]) * t + side * 0.025, b[1] + (c[1] - b[1]) * t + (random() - 0.5) * 0.046, b[2] + (c[2] - b[2]) * t];
          oval(hinge, pollenMaterial, fleck, [0.009, 0.011, 0.010], smallSphere);
        }
      }
      const bristles = [], bristleColors = [];
      for (let j = 0; j < (mobile ? 13 : 24); j++) {
        const t = random(), radius = index === 2 ? 0.036 : 0.022;
        const theta = random() * Math.PI * 2;
        const start = new THREE.Vector3(b[0] + (c[0] - b[0]) * t, b[1] + (c[1] - b[1]) * t, b[2] + (c[2] - b[2]) * t);
        const outward = new THREE.Vector3(Math.cos(theta), Math.sin(theta), -0.12).normalize();
        start.addScaledVector(outward, radius);
        const end = start.clone().addScaledVector(outward, 0.022 + random() * 0.028);
        bristles.push(start.x, start.y, start.z, end.x, end.y, end.z);
        bristleColors.push(0.15, 0.13, 0.065, 0.29, 0.22, 0.09);
      }
      const bristleGeometry = new THREE.BufferGeometry();
      bristleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(bristles, 3));
      bristleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(bristleColors, 3));
      hinge.add(new THREE.LineSegments(bristleGeometry, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.82 })));
      legs.push({ hinge, side, index });
    });
  }

  function forewingShape() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.32, -0.12, 0.75, -0.24, 1.14, -0.14);
    shape.bezierCurveTo(1.36, -0.095, 1.43, 0.055, 1.33, 0.18);
    shape.bezierCurveTo(1.12, 0.43, 0.71, 0.34, 0.33, 0.18);
    shape.bezierCurveTo(0.13, 0.10, 0.035, 0.065, 0, 0);
    return shape;
  }
  function hindwingShape() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.25, 0.02, 0.67, 0.08, 0.91, 0.25);
    shape.bezierCurveTo(1.045, 0.35, 0.88, 0.54, 0.71, 0.49);
    shape.bezierCurveTo(0.38, 0.41, 0.15, 0.17, 0, 0);
    return shape;
  }
  const forePaths = [
    [[0.02, 0.005], [0.34, -0.045], [0.75, -0.074], [1.27, 0.004]],
    [[0.025, 0.023], [0.40, 0.075], [0.81, 0.197], [1.12, 0.265]],
    [[0.28, -0.03], [0.38, -0.115], [0.61, -0.169]],
    [[0.43, -0.055], [0.48, 0.097]],
    [[0.64, -0.071], [0.72, 0.029], [0.79, 0.191]],
    [[0.88, -0.055], [0.94, 0.086], [1.14, 0.108], [1.27, 0.004]],
    [[0.40, 0.075], [0.50, 0.219]],
    [[0.65, 0.149], [0.71, 0.287]],
    [[0.81, 0.197], [0.91, 0.313]],
    [[0.72, 0.029], [0.94, 0.086], [0.81, 0.197]],
    [[1.14, 0.108], [1.12, 0.265]],
  ];
  const hindPaths = [
    [[0.01, 0.015], [0.36, 0.15], [0.83, 0.325]],
    [[0.11, 0.08], [0.37, 0.24], [0.69, 0.457]],
    [[0.29, 0.12], [0.38, 0.075]],
    [[0.48, 0.195], [0.56, 0.13]],
    [[0.68, 0.265], [0.62, 0.36], [0.48, 0.31]],
    [[0.83, 0.325], [0.84, 0.467]],
    [[0.37, 0.24], [0.48, 0.31], [0.44, 0.35]],
  ];
  const wings = [];
  const membraneMaterial = new THREE.MeshPhysicalMaterial({
    color: '#eee4c5', transparent: true, opacity: 0.355,
    roughness: 0.27, metalness: 0.06, clearcoat: 0.9, clearcoatRoughness: 0.18,
    side: THREE.DoubleSide, depthWrite: false,
    iridescence: 0.24, iridescenceIOR: 1.32, iridescenceThicknessRange: [90, 210],
  });
  const ghostMaterial = new THREE.MeshBasicMaterial({
    color: '#eee7d1', transparent: true, opacity: 0.075,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const veinMaterial = new THREE.LineBasicMaterial({ color: '#7f7254', transparent: true, opacity: 0.48, depthWrite: false });
  function wingHeight(u, v) { return 0.036 * Math.sin(u * 2.4) + v * 0.035; }
  for (const side of [-1, 1]) {
    for (let pair = 0; pair < 2; pair++) {
      const shape = pair === 0 ? forewingShape() : hindwingShape();
      const geometry = new THREE.ShapeGeometry(shape, mobile ? 18 : 28);
      const positions = geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const u = positions.getX(i), v = positions.getY(i);
        positions.setXYZ(i, side * u, wingHeight(u, v), v);
      }
      geometry.computeVertexNormals();
      const hinge = new THREE.Group();
      hinge.position.set(side * 0.125, 0.228 - pair * 0.032, -0.055 + pair * 0.16);
      hinge.name = `${side < 0 ? 'Left' : 'Right'} ${pair === 0 ? 'forewing' : 'hindwing'}`;
      group.add(hinge);
      const membrane = mesh(geometry, membraneMaterial, hinge);
      membrane.renderOrder = 3 + pair;
      const veins = [];
      const paths = pair === 0 ? forePaths : hindPaths;
      for (const path of paths) {
        const curve = new THREE.CatmullRomCurve3(path.map(([u, v]) => new THREE.Vector3(side * u, wingHeight(u, v) + 0.002, v)));
        const samples = curve.getPoints(12);
        for (let i = 1; i < samples.length; i++) veins.push(...samples[i - 1].toArray(), ...samples[i].toArray());
      }
      const outline = shape.getPoints(mobile ? 25 : 40);
      for (let i = 1; i < outline.length; i++) {
        const a = outline[i - 1], b = outline[i];
        veins.push(side * a.x, wingHeight(a.x, a.y) + 0.002, a.y, side * b.x, wingHeight(b.x, b.y) + 0.002, b.y);
      }
      const veinGeometry = new THREE.BufferGeometry();
      veinGeometry.setAttribute('position', new THREE.Float32BufferAttribute(veins, 3));
      const venation = new THREE.LineSegments(veinGeometry, veinMaterial);
      venation.renderOrder = 5;
      hinge.add(venation);
      const ghosts = [];
      for (const offset of [-1, 1]) {
        const ghost = mesh(geometry, ghostMaterial, hinge);
        ghost.renderOrder = 1;
        ghost.rotation.z = side * offset * 0.135;
        ghost.rotation.y = side * offset * 0.023;
        ghosts.push({ ghost, offset });
      }
      // The paired wings couple at the thoracic shoulder.
      oval(group, chitin, [side * 0.145, 0.220 - pair * 0.020, -0.028 + pair * 0.13], [0.029, 0.024, 0.036], smallSphere);
      wings.push({ hinge, ghosts, side, pair });
    }
  }

  // Consolidate the fixed pieces at each hinge. In particular, the six legs
  // retain independent motion without a draw call for every joint and claw.
  function mergeFixedMeshes(parent) {
    const batches = new Map();
    for (const child of parent.children) {
      if (!child.isMesh) continue;
      if (!batches.has(child.material)) batches.set(child.material, []);
      batches.get(child.material).push(child);
    }
    const point = new THREE.Vector3(), normal = new THREE.Vector3();
    const normalMatrix = new THREE.Matrix3();
    for (const [material, objects] of batches) {
      if (objects.length < 2) continue;
      const positions = [], normals = [], colors = [], uvs = [], indices = [];
      let offset = 0, cast = false, receive = false;
      for (const object of objects) {
        object.updateMatrix();
        normalMatrix.getNormalMatrix(object.matrix);
        const source = object.geometry;
        const position = source.attributes.position;
        const sourceNormal = source.attributes.normal;
        const color = source.attributes.color;
        const uv = source.attributes.uv;
        for (let i = 0; i < position.count; i++) {
          point.fromBufferAttribute(position, i).applyMatrix4(object.matrix);
          positions.push(point.x, point.y, point.z);
          if (sourceNormal) {
            normal.fromBufferAttribute(sourceNormal, i).applyNormalMatrix(normalMatrix);
            normals.push(normal.x, normal.y, normal.z);
          }
          if (color) colors.push(color.getX(i), color.getY(i), color.getZ(i));
          if (uv) uvs.push(uv.getX(i), uv.getY(i));
        }
        if (source.index) {
          for (let i = 0; i < source.index.count; i++) indices.push(source.index.getX(i) + offset);
        } else {
          for (let i = 0; i < position.count; i++) indices.push(i + offset);
        }
        offset += position.count;
        cast ||= object.castShadow;
        receive ||= object.receiveShadow;
        parent.remove(object);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      if (normals.length) geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      if (colors.length) geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      if (uvs.length === offset * 2) geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geometry.setIndex(indices);
      const object = mesh(geometry, material, parent);
      object.castShadow = cast;
      object.receiveShadow = receive;
      object.name = 'Fixed anatomy';
    }
  }
  for (const { hinge } of legs) mergeFixedMeshes(hinge);
  for (const { hinge } of antennae) mergeFixedMeshes(hinge);
  mergeFixedMeshes(group);

  function update(time, { reduced = false, speed = 0 } = {}) {
    const drive = THREE.MathUtils.clamp(Number.isFinite(speed) ? speed : 0, 0, 1);
    const phase = time * (46 + drive * 7);
    for (const { hinge, ghosts, side, pair } of wings) {
      const flap = reduced ? 0.12 : Math.sin(phase - pair * 0.32) * (0.42 + drive * 0.085) + 0.095;
      hinge.rotation.z = side * flap;
      hinge.rotation.x = reduced ? 0.20 : 0.28 + Math.cos(phase - pair * 0.32) * 0.18;
      hinge.rotation.y = side * (pair ? -0.12 : -0.035);
      for (const { ghost, offset } of ghosts) {
        ghost.visible = !reduced;
        ghost.rotation.z = side * offset * (0.12 + Math.abs(Math.cos(phase)) * 0.06);
        ghost.rotation.x = offset * 0.07;
      }
    }
    for (const { hinge, side, index } of legs) {
      hinge.rotation.x = reduced ? 0 : Math.sin(time * 2.2 + index * 1.5 + side) * 0.035;
      hinge.rotation.z = reduced ? 0 : side * (Math.sin(time * 1.7 + index) * 0.018 + drive * 0.055);
    }
    for (const { hinge, side } of antennae) {
      hinge.rotation.x = reduced ? 0 : Math.sin(time * 2.0 + side * 0.6) * 0.022;
      hinge.rotation.z = reduced ? 0 : side * Math.sin(time * 1.5 + 0.5) * 0.026;
    }
  }
  update(0);
  return { group, update };
}

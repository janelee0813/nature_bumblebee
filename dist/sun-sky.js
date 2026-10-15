import * as THREE from './vendor/three.module.js';

// The dome follows the camera position, keeping the meadow's horizon distant
// without increasing the scene's far plane. The morning light is painted into
// one shader, so the halo and rays add no transparent layers or extra draws.
export function createSunSky() {
  const group = new THREE.Group();
  group.name = 'Soft sunlit morning sky';
  const sunDirection = new THREE.Vector3(0.42, 0.28, -1).normalize();
  const uniforms = {
    horizon: { value: new THREE.Color('#ffffff') },
    lowerSky: { value: new THREE.Color('#eef5f5') },
    upperSky: { value: new THREE.Color('#b9e0f3') },
    sunshine: { value: new THREE.Color('#fff5cf') },
    sunDirection: { value: sunDirection },
  };
  const material = new THREE.ShaderMaterial({
    name: 'Morning blue and cream sunlight',
    uniforms,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
    fog: false,
    toneMapped: false,
    vertexShader: `
      varying vec3 skyDirection;
      void main() {
        skyDirection = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 horizon;
      uniform vec3 lowerSky;
      uniform vec3 upperSky;
      uniform vec3 sunshine;
      uniform vec3 sunDirection;
      varying vec3 skyDirection;
      void main() {
        vec3 direction = normalize(skyDirection);
        float height = max(direction.y, 0.0);
        vec3 sky = mix(horizon, upperSky, smoothstep(0.02, 0.65, height));
        sky = mix(lowerSky, sky, smoothstep(-0.19, 0.035, direction.y));

        // An angular halo produces the same soft shape at every dome radius.
        float angle = acos(clamp(dot(direction, sunDirection), -1.0, 1.0));
        float broadGlow = exp(-angle * angle / 0.055);
        float innerGlow = exp(-angle * angle / 0.0038);
        sky = mix(sky, sunshine, broadGlow * 0.34 + innerGlow * 0.25);

        // Very broad, restrained rays are only visible close to the halo.
        vec3 sunRight = normalize(cross(vec3(0.0, 1.0, 0.0), sunDirection));
        vec3 sunUp = cross(sunDirection, sunRight);
        float radialAngle = atan(dot(direction, sunUp), dot(direction, sunRight));
        float rays = pow(0.5 + 0.5 * cos(radialAngle * 10.0 + 0.4), 5.0);
        float rayEnvelope = exp(-angle * angle / 0.10)
          * smoothstep(0.025, 0.075, angle);
        sky = mix(sky, sunshine, rays * rayEnvelope * 0.045);

        float disc = 1.0 - smoothstep(0.0135, 0.0175, angle);
        sky = mix(sky, vec3(1.0, 0.975, 0.87), disc * 0.90);
        gl_FragColor = vec4(sky, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(59, 32, 20), material);
  dome.name = 'Distant daylight and soft sun';
  dome.renderOrder = -1000;
  dome.frustumCulled = false;
  group.add(dome);

  // Steer the distant sun through the orbit so a hint of sunlight stays in the
  // view, while the gradient remains aligned to the world's horizontal meadow.
  const viewSun = new THREE.Vector3();
  return {
    group,
    update(camera) {
      group.position.copy(camera.position);
      const side = Math.min(0.42, camera.aspect * 0.31);
      viewSun.set(side, 0.28, -1).normalize().applyQuaternion(camera.quaternion);
      sunDirection.copy(viewSun);
    },
  };
}

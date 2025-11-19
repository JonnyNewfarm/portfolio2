"use client";
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

export default function Steam({ count = 26 }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, seeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 0.04;
      pos[i * 3 + 1] = Math.random() * 0.05;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.04;

      seed[i] = Math.random() * 10.0;
    }

    return { positions: pos, seeds: seed };
  }, [count]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-seed" args={[seeds, 1]} />
      </bufferGeometry>

      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        depthTest={true}
        blending={THREE.NormalBlending}
        uniforms={{
          uTime: { value: 0 },
        }}
        vertexShader={`
  attribute float seed;
  uniform float uTime;
  varying float vAlpha;

  float turbulence(float x) {
    return sin(x * 1.2) * 0.5 + sin(x * 3.7) * 0.25;
  }

  void main() {
    // Slower steam movement (5 sec lifecycle)
    float t = mod(uTime + seed, 5.0) / 5.0;

    vec3 pos = position;

    pos.y += t * 0.2;

    pos.x += turbulence(t * 6.0 + seed) * 0.015;
    pos.z += turbulence(t * 5.0 - seed) * 0.015;

    // fade in/out
    vAlpha = smoothstep(0.0, 0.2, t) * (1.0 - t);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 120.0 * (1.0 - t) / -mv.z;

    gl_Position = projectionMatrix * mv;
  }
`}
        fragmentShader={`
          varying float vAlpha;

          void main() {
            float d = length(gl_PointCoord - 0.5);

            float alpha = smoothstep(0.6, 0.25, d) * vAlpha;

            gl_FragColor = vec4(0.92, 0.92, 0.92, alpha * 0.5);
          }
        `}
      />
    </points>
  );
}

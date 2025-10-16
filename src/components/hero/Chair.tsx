"use client";

import { useLoader } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";

import * as THREE from "three";

export default function Chair() {
  const wood = useLoader(THREE.TextureLoader, "/fabrics/fabric-3.jpeg");
  wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
  wood.repeat.set(1, 1);
  wood.colorSpace = THREE.SRGBColorSpace;

  const seat = useLoader(THREE.TextureLoader, "/fabrics/chair-seat.jpeg");
  seat.wrapS = seat.wrapT = THREE.RepeatWrapping;
  seat.repeat.set(1, 1);
  seat.colorSpace = THREE.SRGBColorSpace;

  return (
    <group position={[0, 0, 0.1]}>
      {/* Seat */}
      <RoundedBox
        args={[0.89, 0.11, 0.56]}
        radius={0.04}
        smoothness={2.5}
        position={[0, 0.7, 2.73]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial map={seat} roughness={0.8} metalness={0.1} />
      </RoundedBox>
      {/* Bars under seat (front to back support) */}
      {[-0.38, 0.4].map((x, i) => (
        <mesh
          key={`under-bar-${i}`}
          position={[x, 0.61, 2.8]}
          rotation={[0, 0, 0]}
          castShadow
          receiveShadow
        >
          {/* connects front and back legs */}
          <boxGeometry args={[0.08, 0.05, 0.5]} />
          <meshStandardMaterial map={wood} roughness={0.5} metalness={0.2} />
        </mesh>
      ))}

      {[-0.38, 0.416].map((x, i) => (
        <mesh
          key={`under-bar-${i}`}
          position={[x, 0.43, 2.8]}
          rotation={[0, 0, 0]}
          castShadow
          receiveShadow
        >
          {/* connects front and back legs */}
          <boxGeometry args={[0.04, 0.03, 0.47]} />
          <meshStandardMaterial map={wood} roughness={0.5} metalness={0.2} />
        </mesh>
      ))}
      {/* Backrest (wood) */}
      <RoundedBox
        args={[1.01, 0.34, 0.05]}
        radius={0.05}
        smoothness={1}
        position={[-0.04, 1.45, 3.05]}
        rotation={[0.1, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial map={wood} roughness={0.6} metalness={0.1} />
      </RoundedBox>

      {/* Back support bars */}
      {[-0.438, 0.37].map((x, i) => (
        <mesh
          key={i}
          position={[x, 1.06, 3.03]}
          rotation={[0, 0, 0.1]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.04, 0.9, 0.04]} />
          <meshStandardMaterial map={wood} roughness={0.6} metalness={0.1} />
        </mesh>
      ))}

      {/* Legs  */}
      {[-0.4, 0.4].map((x, i) =>
        [-0.25, 0.25].map((z, j) => (
          <mesh
            key={`${x}-${z}-${i}-${j}`}
            position={[x, 0.35, z + 2.8]}
            rotation={[-0.13, 0, 0]}
            castShadow
            receiveShadow
          >
            {/* rectangular bea */}
            <boxGeometry args={[0.04, 0.72, 0.045]} />
            <meshStandardMaterial map={wood} roughness={0.5} metalness={0.2} />
          </mesh>
        ))
      )}

      {/* Side bars */}
      {[-0.26, 0.256].map((y, i) => (
        <mesh
          key={i}
          position={[0.015, 0.6, y + 2.77]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.7, 0.03, 0.05]} />
          <meshStandardMaterial map={wood} roughness={0.5} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

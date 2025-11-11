"use client";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import * as THREE from "three";

export default function MiniGame({ onExit }: { onExit: () => void }) {
  const ball = useRef<THREE.Mesh>(null);
  const paddle = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [ballVel, setBallVel] = useState([0.02, 0.02]);
  const [score, setScore] = useState(0);

  const targetX = useRef(0);
  const lastMouseX = useRef(0);
  const isMobile = useRef(false);

  const minX = -0.9;
  const maxX = 0.9;
  const paddleWidth = 0.3;
  const paddleHalfWidth = paddleWidth / 2;

  useEffect(() => {
    if (paddle.current) {
      targetX.current = paddle.current.position.x;
    }
    isMobile.current = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }, []);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      lastMouseX.current = e.clientX;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const deltaX = e.clientX - lastMouseX.current;
      lastMouseX.current = e.clientX;

      const sensitivity = 0.01;
      targetX.current += deltaX * sensitivity;

      targetX.current = THREE.MathUtils.clamp(
        targetX.current,
        minX + paddleHalfWidth,
        maxX - paddleHalfWidth
      );
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      lastMouseX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;

      const deltaX = e.touches[0].clientX - lastMouseX.current;
      lastMouseX.current = e.touches[0].clientX;

      const sensitivity = 0.02;
      targetX.current += deltaX * sensitivity;

      targetX.current = THREE.MathUtils.clamp(
        targetX.current,
        minX + paddleHalfWidth,
        maxX - paddleHalfWidth
      );
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useFrame(() => {
    if (!ball.current || !paddle.current) return;

    const lerpSpeed = 0.2;
    paddle.current.position.x = THREE.MathUtils.lerp(
      paddle.current.position.x,
      targetX.current,
      lerpSpeed
    );

    const [vx, vy] = ballVel;
    ball.current.position.x += vx;
    ball.current.position.y += vy;

    if (ball.current.position.x <= minX || ball.current.position.x >= maxX)
      setBallVel([-vx, vy]);
    if (ball.current.position.y >= 0.55) setBallVel([vx, -vy]);

    if (
      Math.abs(ball.current.position.y - paddle.current.position.y) < 0.07 &&
      Math.abs(ball.current.position.x - paddle.current.position.x) <
        paddleHalfWidth * 2 &&
      vy < 0
    ) {
      setBallVel([vx, Math.abs(vy)]);
      setScore((s) => s + 1);
    }

    if (ball.current.position.y < -0.55) {
      setScore(0);
      ball.current.position.set(0, 0, 0);
      setBallVel([0.02, 0.02]);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0.17, 0.25, 1.295]}
      scale={[1.14, 1.08, 0.85]}
    >
      <Text
        position={[-0.5, 0.39, 0]}
        fontSize={0.14}
        color="black"
        onClick={onExit}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        Exit
      </Text>

      <Text position={[0.5, 0.39, 0]} fontSize={0.14} color="black">
        Score: {score}
      </Text>

      {/* Ball */}
      <mesh ref={ball}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Paddle */}
      <mesh ref={paddle} position={[0, -0.45, 0]}>
        <boxGeometry args={[paddleWidth, 0.04, 0.01]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Borders */}
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[1.8, 0.01, 0.01]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      <mesh position={[-0.9, 0, 0]}>
        <boxGeometry args={[0.01, 1.1, 0.01]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      <mesh position={[0.9, 0, 0]}>
        <boxGeometry args={[0.01, 1.1, 0.01]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function MiniGame({ onExit }: { onExit: () => void }) {
  const ball = useRef<THREE.Mesh>(null);
  const paddle = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const ballVelocity = useRef(new THREE.Vector2(0.02, 0.02));

  const [score, setScore] = useState(0);

  const targetX = useRef(0);
  const lastMouseX = useRef(0);

  const minX = -0.9;
  const maxX = 0.9;

  const minY = -0.55;
  const maxY = 0.55;

  const ballRadius = 0.03;

  const paddleWidth = 0.3;
  const paddleHalfWidth = paddleWidth / 2;

  const leftWallOffset = 0.08;

  const ballMinX = minX + ballRadius + leftWallOffset;
  const ballMaxX = maxX - ballRadius;
  const ballMaxY = maxY - ballRadius;

  useEffect(() => {
    if (paddle.current) {
      targetX.current = paddle.current.position.x;
    }
  }, []);

  useEffect(() => {
    const clampPaddle = () => {
      targetX.current = THREE.MathUtils.clamp(
        targetX.current,
        minX + paddleHalfWidth,
        maxX - paddleHalfWidth,
      );
    };

    const handlePointerDown = (event: PointerEvent) => {
      lastMouseX.current = event.clientX;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const deltaX = event.clientX - lastMouseX.current;

      lastMouseX.current = event.clientX;

      const sensitivity = 0.01;

      targetX.current += deltaX * sensitivity;

      clampPaddle();
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 0) return;

      lastMouseX.current = event.touches[0].clientX;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 0) return;

      const deltaX = event.touches[0].clientX - lastMouseX.current;

      lastMouseX.current = event.touches[0].clientX;

      const sensitivity = 0.02;

      targetX.current += deltaX * sensitivity;

      clampPaddle();
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);

    window.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });

    window.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);

      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useFrame(() => {
    if (!ball.current || !paddle.current) return;

    paddle.current.position.x = THREE.MathUtils.lerp(
      paddle.current.position.x,
      targetX.current,
      0.2,
    );

    ball.current.position.x += ballVelocity.current.x;
    ball.current.position.y += ballVelocity.current.y;

    // Venstre vegg
    if (ball.current.position.x <= ballMinX && ballVelocity.current.x < 0) {
      ball.current.position.x = ballMinX;
      ballVelocity.current.x = Math.abs(ballVelocity.current.x);
    }

    // Høyre vegg
    if (ball.current.position.x >= ballMaxX && ballVelocity.current.x > 0) {
      ball.current.position.x = ballMaxX;
      ballVelocity.current.x = -Math.abs(ballVelocity.current.x);
    }

    // Topp
    if (ball.current.position.y >= ballMaxY && ballVelocity.current.y > 0) {
      ball.current.position.y = ballMaxY;
      ballVelocity.current.y = -Math.abs(ballVelocity.current.y);
    }

    const paddleTop = paddle.current.position.y + 0.02 + ballRadius;

    const ballTouchesPaddle =
      ball.current.position.y <= paddleTop &&
      ball.current.position.y >= paddle.current.position.y - 0.02;

    const ballInsidePaddle =
      ball.current.position.x >=
        paddle.current.position.x - paddleHalfWidth - ballRadius &&
      ball.current.position.x <=
        paddle.current.position.x + paddleHalfWidth + ballRadius;

    if (ballTouchesPaddle && ballInsidePaddle && ballVelocity.current.y < 0) {
      ball.current.position.y = paddleTop;
      ballVelocity.current.y = Math.abs(ballVelocity.current.y);

      // Gir litt forskjellig retning ut fra hvor ballen treffer paddelen
      const hitPosition =
        (ball.current.position.x - paddle.current.position.x) / paddleHalfWidth;

      ballVelocity.current.x = THREE.MathUtils.clamp(
        ballVelocity.current.x + hitPosition * 0.008,
        -0.035,
        0.035,
      );

      setScore((currentScore) => currentScore + 1);
    }

    // Ballen falt ned
    if (ball.current.position.y < minY - ballRadius) {
      setScore(0);

      ball.current.position.set(0, 0, 0);

      ballVelocity.current.set(Math.random() > 0.5 ? 0.02 : -0.02, 0.02);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0.01, 0.25, 1.295]}
      scale={[1.14, 1.08, 0.85]}
    >
      <Text
        position={[-0.5, 0.39, 0]}
        fontSize={0.14}
        color="black"
        onClick={onExit}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        Exit
      </Text>

      <Text position={[0.44, 0.39, 0]} fontSize={0.14} color="black">
        Score: {score}
      </Text>

      {/* Ball */}
      <mesh ref={ball}>
        <sphereGeometry args={[ballRadius, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Paddle */}
      <mesh ref={paddle} position={[0, -0.45, 0]}>
        <boxGeometry args={[paddleWidth, 0.04, 0.01]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Usynlige grenser */}
      <mesh position={[0, minY, 0]}>
        <boxGeometry args={[1.8, 0.01, 0.01]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh position={[minX, 0, 0]}>
        <boxGeometry args={[0.01, 1.1, 0.01]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh position={[maxX, 0, 0]}>
        <boxGeometry args={[0.01, 1.1, 0.01]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

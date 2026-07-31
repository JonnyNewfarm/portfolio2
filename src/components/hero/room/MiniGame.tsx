"use client";

import { Text } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function MiniGame({ onExit }: { onExit: () => void }) {
  const ball = useRef<THREE.Mesh>(null);
  const paddle = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const leftPressed = useRef(false);
  const rightPressed = useRef(false);

  const targetX = useRef(0);
  const demoTime = useRef(0);

  const ballVelocity = useRef(new THREE.Vector2(0.34, 0.34));

  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playHovered, setPlayHovered] = useState(false);

  const minX = -0.84;
  const maxX = 0.84;

  const minY = -0.5;
  const maxY = 0.5;

  const ballRadius = 0.03;

  const paddleWidth = 0.3;
  const paddleHeight = 0.04;

  const paddleHalfWidth = paddleWidth / 2;
  const paddleHalfHeight = paddleHeight / 2;

  const paddleY = -0.45;

  const ballMinX = minX + ballRadius;
  const ballMaxX = maxX - ballRadius;
  const ballMaxY = maxY - ballRadius;

  const paddleMinX = minX + paddleHalfWidth;
  const paddleMaxX = maxX - paddleHalfWidth;

  const ballSpeed = 1.2;
  const paddleSpeed = 1.35;

  const setBallDirection = (directionX: number, directionY: number) => {
    const direction = new THREE.Vector2(directionX, directionY);

    if (direction.lengthSq() === 0) {
      direction.set(0.7, 0.7);
    }

    direction.normalize().multiplyScalar(ballSpeed);

    ballVelocity.current.copy(direction);
  };

  const resetBall = () => {
    if (!ball.current) return;

    ball.current.position.set(0, 0.02, 0);

    const randomX = Math.random() > 0.5 ? 0.65 : -0.65;

    setBallDirection(randomX, 1);
  };

  const startGame = () => {
    setScore(0);
    setIsPlaying(true);
    setPlayHovered(false);

    leftPressed.current = false;
    rightPressed.current = false;

    targetX.current = 0;

    if (paddle.current) {
      paddle.current.position.x = 0;
    }

    resetBall();

    document.body.style.cursor = "";
  };

  const exitGame = () => {
    leftPressed.current = false;
    rightPressed.current = false;

    document.body.style.cursor = "";

    onExit();
  };

  useEffect(() => {
    if (paddle.current) {
      targetX.current = paddle.current.position.x;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        leftPressed.current = true;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        rightPressed.current = true;
      }

      if (!isPlaying && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        startGame();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        leftPressed.current = false;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        rightPressed.current = false;
      }
    };

    const handleWindowBlur = () => {
      leftPressed.current = false;
      rightPressed.current = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  useFrame((_, delta) => {
    if (!ball.current || !paddle.current) return;

    const safeDelta = Math.min(delta, 0.033);

    /*
      Demo før PLAY.
      Paddelen beveger seg automatisk.
      Ballen står litt mot høyre.
    */
    if (!isPlaying) {
      demoTime.current += safeDelta;

      targetX.current = Math.sin(demoTime.current * 1.8) * 0.4;

      paddle.current.position.x = THREE.MathUtils.lerp(
        paddle.current.position.x,
        targetX.current,
        0.08,
      );

      ball.current.position.set(0.05, 0.02, 0);

      return;
    }

    /*
      Piltastene flytter paddelen under spillet.
    */
    if (leftPressed.current && !rightPressed.current) {
      targetX.current -= paddleSpeed * safeDelta;
    }

    if (rightPressed.current && !leftPressed.current) {
      targetX.current += paddleSpeed * safeDelta;
    }

    targetX.current = THREE.MathUtils.clamp(
      targetX.current,
      paddleMinX,
      paddleMaxX,
    );

    paddle.current.position.x = THREE.MathUtils.lerp(
      paddle.current.position.x,
      targetX.current,
      0.28,
    );

    paddle.current.position.x = THREE.MathUtils.clamp(
      paddle.current.position.x,
      paddleMinX,
      paddleMaxX,
    );

    /*
      Flytt ballen.
    */
    ball.current.position.x += ballVelocity.current.x * safeDelta;
    ball.current.position.y += ballVelocity.current.y * safeDelta;

    /*
      Venstre vegg.
    */
    if (ball.current.position.x <= ballMinX && ballVelocity.current.x < 0) {
      ball.current.position.x = ballMinX;
      ballVelocity.current.x = Math.abs(ballVelocity.current.x);
    }

    /*
      Høyre vegg.
    */
    if (ball.current.position.x >= ballMaxX && ballVelocity.current.x > 0) {
      ball.current.position.x = ballMaxX;
      ballVelocity.current.x = -Math.abs(ballVelocity.current.x);
    }

    /*
      Topp.
    */
    if (ball.current.position.y >= ballMaxY && ballVelocity.current.y > 0) {
      ball.current.position.y = ballMaxY;
      ballVelocity.current.y = -Math.abs(ballVelocity.current.y);
    }

    const paddleTop = paddle.current.position.y + paddleHalfHeight + ballRadius;

    const paddleBottom =
      paddle.current.position.y - paddleHalfHeight - ballRadius;

    const ballTouchesPaddle =
      ball.current.position.y <= paddleTop &&
      ball.current.position.y >= paddleBottom;

    const ballInsidePaddle =
      ball.current.position.x >=
        paddle.current.position.x - paddleHalfWidth - ballRadius &&
      ball.current.position.x <=
        paddle.current.position.x + paddleHalfWidth + ballRadius;

    if (ballTouchesPaddle && ballInsidePaddle && ballVelocity.current.y < 0) {
      ball.current.position.y = paddleTop;

      const hitPosition = THREE.MathUtils.clamp(
        (ball.current.position.x - paddle.current.position.x) / paddleHalfWidth,
        -1,
        1,
      );

      const minimumHorizontalDirection = 0.16;

      let directionX = hitPosition * 0.9;

      if (Math.abs(directionX) < minimumHorizontalDirection) {
        directionX =
          ballVelocity.current.x >= 0
            ? minimumHorizontalDirection
            : -minimumHorizontalDirection;
      }

      setBallDirection(directionX, 1);

      setScore((currentScore) => currentScore + 1);
    }

    /*
      Ballen falt ned.
    */
    if (ball.current.position.y < minY - ballRadius) {
      setScore(0);
      resetBall();
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0.01, 0.25, 1.295]}
      scale={[1.06, 1.03, 0.85]}
    >
      <Text
        position={[-0.5, 0.39, 0]}
        fontSize={0.1}
        color="black"
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation();
          exitGame();
        }}
        onPointerEnter={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          document.body.style.cursor = "";
        }}
      >
        Exit
      </Text>

      {isPlaying && (
        <Text position={[0.56, 0.39, 0]} fontSize={0.1} color="black">
          Score: {score}
        </Text>
      )}

      {/*
        Ball og paddle må ligge utenfor {!isPlaying},
        ellers forsvinner de når spillet starter.
      */}
      <group position={[0, 0.04, 0.015]}>
        <mesh ref={ball} position={[0.05, 0.02, 0]}>
          <sphereGeometry args={[ballRadius, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>

        <mesh ref={paddle} position={[0, paddleY, 0]}>
          <boxGeometry args={[paddleWidth, paddleHeight, 0.01]} />
          <meshStandardMaterial color="#222222" />
        </mesh>

        {!isPlaying && (
          <>
            <Text
              position={[0.06, 0.21, 0]}
              fontSize={0.07}
              color="#181818"
              anchorX="center"
              anchorY="middle"
            >
              USE ARROW KEYS
            </Text>

            <Text
              position={[-0.3, 0.02, 0]}
              fontSize={0.105}
              color="#181818"
              anchorX="center"
              anchorY="middle"
            >
              ← LEFT
            </Text>

            <Text
              position={[0.43, 0.02, 0]}
              fontSize={0.105}
              color="#181818"
              anchorX="center"
              anchorY="middle"
            >
              RIGHT →
            </Text>

            <Text
              position={[0.04, -0.19, 0]}
              fontSize={playHovered ? 0.165 : 0.15}
              color={playHovered ? "#000000" : "#202020"}
              anchorX="center"
              anchorY="middle"
              onClick={(event: ThreeEvent<MouseEvent>) => {
                event.stopPropagation();
                startGame();
              }}
              onPointerEnter={(event: ThreeEvent<PointerEvent>) => {
                event.stopPropagation();
                setPlayHovered(true);
                document.body.style.cursor = "pointer";
              }}
              onPointerLeave={(event: ThreeEvent<PointerEvent>) => {
                event.stopPropagation();
                setPlayHovered(false);
                document.body.style.cursor = "";
              }}
            >
              PLAY
            </Text>
          </>
        )}
      </group>

      {/* Usynlige grenser */}
      <mesh position={[0, minY, 0]}>
        <boxGeometry args={[maxX - minX, 0.01, 0.01]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh position={[minX, 0, 0]}>
        <boxGeometry args={[0.01, maxY - minY, 0.01]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh position={[maxX, 0, 0]}>
        <boxGeometry args={[0.01, maxY - minY, 0.01]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

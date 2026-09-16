export const latestProjectFrameVertexShader = /* glsl */ `
  varying vec2 vUv;

  uniform vec2 uDelta;
  uniform float uAmplitude;

  void main() {
    vUv = uv;

    vec3 newPosition = position;

    float bendX =
      sin(uv.y * 3.14159265359) *
      uDelta.x *
      uAmplitude;

    float bendY =
      sin(uv.x * 3.14159265359) *
      uDelta.y *
      uAmplitude;

    newPosition.z += bendX + bendY;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(newPosition, 1.0);
  }
`;

export const latestProjectFrameFragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uAlpha;

  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;

  void main() {
    vec2 uv = vUv;

    float time = uTime * 0.38;

    float wave1 =
      sin(
        uv.x * 5.0 +
        uv.y * 1.5 -
        time
      ) * 0.5 + 0.5;

    float wave2 =
      sin(
        uv.x * -3.2 +
        uv.y * 5.0 +
        time * 0.75
      ) * 0.5 + 0.5;

    float wave3 =
      sin(
        (uv.x + uv.y) * 2.2 -
        time * 0.5
      ) * 0.5 + 0.5;

    float flow =
      wave1 * 0.55 +
      wave2 * 0.30 +
      wave3 * 0.15;

    flow = smoothstep(
      0.18,
      0.82,
      flow
    );

    vec3 color = mix(
      uColor1,
      uColor2,
      flow
    );

    float highlight =
      sin(
        uv.x * 6.0 -
        uv.y * 2.4 -
        time * 1.15
      ) * 0.5 + 0.5;

    highlight = smoothstep(
      0.45,
      0.85,
      highlight
    );

    color = mix(
      color,
      uColor3,
      highlight * 0.42
    );

    float glow =
      smoothstep(
        0.62,
        1.0,
        flow
      );

    color += vec3(0.055) * glow;

    gl_FragColor = vec4(
      color,
      uAlpha
    );
  }
`;
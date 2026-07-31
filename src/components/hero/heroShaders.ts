export const portraitVertexShader = `
  varying vec2 vUv;

  uniform vec2 uDelta;
  uniform float uAmplitude;

  const float PI = 3.141592653589793238;

  void main() {
    vUv = uv;

    vec3 newPosition = position;

    newPosition.x +=
      sin(uv.y * PI) *
      uDelta.x *
      uAmplitude;

    newPosition.y +=
      sin(uv.x * PI) *
      uDelta.y *
      uAmplitude;

    float speed = length(uDelta);

    newPosition.z +=
      sin(uv.x * PI) *
      sin(uv.y * PI) *
      speed *
      uAmplitude *
      0.16;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(newPosition, 1.0);
  }
`;

export const portraitFragmentShader = `
  varying vec2 vUv;

  uniform sampler2D uTexture;
  uniform float uAlpha;

  void main() {
    vec4 textureColor = texture2D(uTexture, vUv);

    gl_FragColor = vec4(
      textureColor.rgb,
      textureColor.a * uAlpha
    );

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
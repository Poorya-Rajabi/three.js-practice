uniform float uTime;

varying vec2 vUv;

void main() {
    vUv = uv;

//    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
//    gl_Position = projectionMatrix * mvPosition;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 0.1);
}

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const flagTexture = textureLoader.load('/textures/iran-flag.jpg')
const texture1 = textureLoader.load('/textures/1.jpg')
const texture2 = textureLoader.load('/textures/2.jpg')

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)
// const geometry = new THREE.PlaneGeometry(700, 394,1,1)

// const count = geometry.attributes.position.count
// const random = new Float32Array(count)
//
// for(let _ = 0; _ <= random.length; _++) {
//     random[_] = Math.random()
// }
//
// geometry.setAttribute('aRandom', new THREE.BufferAttribute(random, 1))

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: { value: 0 },
        iChannel0:  { value: texture1 },
        iChannel1:  { value: texture2 },
    }
})

material.uniforms.iChannel0.value.wrapS = material.uniforms.iChannel0.value.wrapT = THREE.RepeatWrapping;
material.uniforms.iChannel1.value.wrapS = material.uniforms.iChannel1.value.wrapT = THREE.RepeatWrapping;

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
console.log(scene)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Material
    material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

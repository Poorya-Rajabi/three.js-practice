import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const colorDoorTexture = textureLoader.load('/textures/door/color.jpg')
const alphaDoorTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightDoorTexture = textureLoader.load('/textures/door/height.jpg')
const metalnessDoorTexture = textureLoader.load('/textures/door/metalness.jpg')
const normalDoorTexture = textureLoader.load('/textures/door/normal.jpg')
const roughnessDoorTexture = textureLoader.load('/textures/door/roughness.jpg')
const ambientOcclusionDoorTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')

gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color(0x00ff00)
// material.wireframe = true
// material.side = THREE.DoubleSide  // FrontSide(Default), BackSide, DoubleSide
// material.transparent = true
// material.opacity = 0.7
// material.map = colorDoorTexture
// material.alphaMap = alphaDoorTexture
//
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

const material = new THREE.MeshMatcapMaterial()
material.matcap = matcapTexture
material.side = THREE.DoubleSide
material.flatShading = true

// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0xff00ff)

// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture

// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0.5
// material.roughness = 0.5

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.x = 3
pointLight.position.x = 4
scene.add(pointLight)


const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 26, 16), // 16, 16
    material
)
sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 1000, 1000), // 16, 32
    material
)
torus.position.x = 1.5

scene.add(sphere, plane, torus)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update size
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update Camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    // Update Objects
    sphere.rotation.y = 0.3 * elapsedTime
    plane.rotation.y = 0.3 * elapsedTime
    torus.rotation.y = 0.3 * elapsedTime

    sphere.rotation.x = 0.2 * elapsedTime
    plane.rotation.x = 0.2 * elapsedTime
    torus.rotation.x = 0.2 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
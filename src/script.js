import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI( { width: 400 } )

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameters = {
    count: 10000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3
}
let geometry = null
let material = null
let points = null

const galaxyGenerator = () => {
    if(geometry !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    console.log('galaxyGenerator')
    // Geometry
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)

    for(let i = 0; i < parameters.count; i++) {
        const i3 = i * 3

        const radius = Math.random() * parameters.radius
        const spinAngle = radius * parameters.spin
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        positions[i3] = Math.sin(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.cos(branchAngle + spinAngle) * radius + randomZ
    }

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )

    //Material
    material = new THREE.PointsMaterial({
        size: parameters.size,
        color: 0x00ffff,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    })

    // Points
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

galaxyGenerator()

gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(galaxyGenerator)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(galaxyGenerator)
gui.add(parameters, 'radius').min(0).max(20).step(0.01).onFinishChange(galaxyGenerator)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(galaxyGenerator)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(galaxyGenerator)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(galaxyGenerator)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(galaxyGenerator)


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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
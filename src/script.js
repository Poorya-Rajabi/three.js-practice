import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Parameters
const parameters = {
    color: 0x303030,
    spin: () => {
        gsap.to(group.rotation, {
            duration: 1, y: group.rotation.y + (Math.PI * 2)
        })
    }
}

/**
 * Objects
 */
const geometry = new THREE.BufferGeometry()
const count = 100
const positionsArray = new Float32Array(count * 3 * 3) // count * vertex * (x+y+z)
for(let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 2
}
const positionsAttr = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttr)

const material = new THREE.MeshBasicMaterial({
    color: parameters.color ,
    wireframe: true
})
const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

// Cube
const cube = new THREE.BoxBufferGeometry(2, 2, 2, 2, 2, 2)
const cubeMaterial = new THREE.MeshNormalMaterial({
    wireframe: true
})
const mesh2 = new THREE.Mesh(cube, cubeMaterial)
// scene.add(mesh2)

// Group
const group = new THREE.Group()
group.add(mesh)
group.add(mesh2)
scene.add(group)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

//resize window
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

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true // smooth moving on rotate
controls.enablePan = false // moving object by right click or two finger in mobile

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

/**
 * GUI
 */
const gui = new dat.GUI({ closed: true, width: 400 })
// gui.hide() // if you want the panel to be hidden at start

// Cube Positions
gui.add(group.position, 'x').min(-3).max(3).step(0.01)
gui.add(group.position, 'y').min(-3).max(3).step(0.01)
gui.add(group.position, 'z').min(-3).max(3).step(0.01)

// Cube Visibility
gui.add(group, 'visible').name('box')
gui.add(mesh, 'visible').name('box inside')
gui.add(mesh2, 'visible').name('box wireframe')

// Material
gui.add(mesh2.material, 'wireframe')

// Change Color
gui.addColor(parameters, 'color')
    .onChange(() => {
        mesh.material.color.set(parameters.color)
    })

// Functions
gui.add(parameters, 'spin').name('CLICK TO SPIN')
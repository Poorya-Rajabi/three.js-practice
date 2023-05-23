import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const matcapMaterial = textureLoader.load('/textures/matcaps/6.png')
const material = new THREE.MeshMatcapMaterial({
    matcap: matcapMaterial,
    side: THREE.DoubleSide
})

/**
 * Font
 */
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/Dancing Script_Regular.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Lamb of god',
            {
                font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegment: 4,
            }
        )
        textGeometry.center()
        // textMaterial.wireframe = true
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        createDonuts()
    }
)



/**
 * Donuts
 */
const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)

function createDonuts() {
    for (let i = 0; i < 300; i++) {
        const donut = new THREE.Mesh(donutGeometry, material)
        scene.add(donut)

        donut.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
        )

        donut.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        )

        const scale = Math.random()
        donut.scale.set(scale, scale, scale)
    }
}

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
camera.position.x = 1
camera.position.y = 0.5
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
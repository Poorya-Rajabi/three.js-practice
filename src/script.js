import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Loaders
 */
const loadingBarElement = document.querySelector('.loading-bar')
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () =>
    {
        // Wait a little
        gsap.delayedCall(0.5, () => {
            // Animate overlay
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

            // Update loadingBarElement
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
        })
    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) =>
    {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }
)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Base
 */
// Debug
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// const axesHelper = new THREE.AxesHelper( 5 )
// scene.add( axesHelper )

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    // wireframe: true,
    transparent: true,
    uniforms:
        {
            uAlpha: { value: 1 }
        },
    vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

const changeTitle = () => {
    let title = '🚀____________________'
    function getShiftedString(s, leftShifts, rightShifts) {
        s = leftShifting(s, leftShifts)
        return rightShifting(s,  rightShifts)
    }

    function leftShifting(s, leftShifts) {
        return s.substring(leftShifts) + s.substring(0, leftShifts)
    }

    function rightShifting(s,  rightShifts) {
        let l = s.length - rightShifts
        return leftShifting(s, l)
    }


    for (let i = 1; i < 21; i++) {
        gsap.delayedCall(0.5 * i, () => {
            title = rightShifting(title, 1)
            document.title = title
        })
    }
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/4-1024/px.png',
    '/textures/environmentMaps/4-1024/nx.png',
    '/textures/environmentMaps/4-1024/py.png',
    '/textures/environmentMaps/4-1024/ny.png',
    '/textures/environmentMaps/4-1024/pz.png',
    '/textures/environmentMaps/4-1024/nz.png'
])

environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 2.5

/**
 * Models
 */
gltfLoader.load(
    '/models/spaceship.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(0.3, 0.3, 0.3)
        gltf.scene.rotation.y = Math.PI
        scene.add(gltf.scene)

        const planets = new THREE.Group()
        const planet1 = gltf.scene.children.find(item => item.name === 'Plane005')
        const planet2 = gltf.scene.children.find(item => item.name === 'Plane002')

        planets.add(planet1, planet2)
        planets.scale.set(0.3, 0.3, 0.3)
        scene.add(planets)
        planets.position.x = 150

        gsap.to(planets.position, { duration: 5, delay: 2.5, x: 0 }).then(() => {
            gsap.delayedCall(2, () => {
                changeTitle()
            })
        })
        gsap.to(gltf.scene.rotation, { duration: 15, delay: 7.5, x: Math.PI * 8 })
        gsap.to(planets.rotation, { duration: 15, delay: 7.5, x: Math.PI * 8 })
        gsap.to(planets.position, { duration: 5, delay: 10, x: -15 }).then(() => {
            gsap.to(camera.position, { duration: 2, z: 0 })
            gsap.to(gltf.scene.position, { duration: 2, z: 4, x: 3 })
        })

        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

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
camera.position.set(-5, 1,  4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon'

/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {
    createSphere: () => {
        createSphere(
            0.25 + Math.random() * 0.25,
            {
                x: (Math.random() - 0.5) * 3,
                y: 3,
                z: (Math.random() - 0.5) * 3
            }
        )
    },
    createBox: () => {
        createBox(
            Math.random(),
            Math.random(),
            Math.random(),
            {
                x: (Math.random() - 0.5) * 3,
                y: 3,
                z: (Math.random() - 0.5) * 3
            }
        )
    },
    reset: () => {
        for(let object of objectsToUpdate) {
            // Remove Body
            object.body.removeEventListener('collide', playHitSound)
            world.removeBody(object.body)

            // Remove Mesh
            scene.remove(object.mesh)
        }
    }
}
gui.add(debugObject, 'createSphere').name('Create Sphere')
gui.add(debugObject, 'createBox').name('Create Box')
gui.add(debugObject, 'reset').name('Reset')
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = (collicion) => {
    const impactStrength = collicion.contact.getImpactVelocityAlongNormal()

    if(impactStrength > 0.7) {
        hitSound.volume = impactStrength > 10 ? 1 : impactStrength / 10
        hitSound.currentTime = 0
        hitSound.play()
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const testTexture = textureLoader.load('/textures/environmentMaps/0/nx.png')

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */
// World
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true

// Materials
const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// Box
// const boxShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1))
// const boxBody = new CANNON.Body({
//     mess: 1,
//     position: new CANNON.Vec3(0, 0.5, 0),
//     shape: boxShape
// })
// world.addBody(boxBody)

// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mess: 0,
    shape: floorShape
})
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI * 0.5
)
world.addBody(floorBody)

// /**
//  * Box
//  */
// const box = new THREE.Mesh(
//     new THREE.BoxBufferGeometry(1, 1, 1),
//     new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5
// })
// )
// scene.add(box)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utils
 */
const objectsToUpdate = []

// Sphere
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    encMap: environmentMapTexture
})
const createSphere = (radius, position) => {
    // Three.js Mesh
    const mesh = new THREE.Mesh( sphereGeometry, sphereMaterial )
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js Body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        shape,
        mass: 3,
        position: new CANNON.Vec3(0, 3, 0)
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // Save in Objects Array
    objectsToUpdate.push({
        mesh,
        body
    })
}

// Sphere
const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    encMap: environmentMapTexture
})
const createBox = (width, height, depth, position) => {
    // Three.js Mesh
    const mesh = new THREE.Mesh( boxGeometry, boxMaterial )
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js Body
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2))
    const body = new CANNON.Body({
        shape,
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0)
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // Save in Objects Array
    objectsToUpdate.push({
        mesh,
        body
    })
}

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update Physic world
    world.step(1 / 16, deltaTime, 3)
    for(let object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
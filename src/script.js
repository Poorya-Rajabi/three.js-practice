import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/**
 * Debug
 */
// const gui = new dat.GUI()

// gui
//     .addColor(parameters, 'materialColor')
//     .onChange(() => {
//         material.color.set(parameters.materialColor)
//         particlesMaterial.color.set(parameters.materialColor)
//         for (let section of sections) {
//             section.style.color = parameters.materialColor
//         }
//     })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')
const sections = document.querySelectorAll('.section')
const counter = document.querySelector('#counter')

// Scene
const scene = new THREE.Scene()

// Loaders
const gltfLoader = new GLTFLoader()

// Update Materials
// function updateAllMaterials() {
//     scene.traverse((child) => {
//         // if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
//         //     child.material = new THREE.MeshBasicMaterial( { color: 0xffffff } )
//         // }
//         if (!child.isMesh) return;
//         child.material = child.material.clone();
//         child.material.wireframe = true
//     })
// }

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
 * Objects
 */
// Material

// Meshes
const objectsDistance = 4
const animals = ['fish', 'dolphin', 'mantaray', 'shark', 'whale']
const customData = {
    fish: {
        index: 1,
        scale: 0.15
    },
    dolphin: {
        index: 2,
        scale: 0.18
    },
    mantaray: {
        index: 3,
        scale: 0.2
    },
    shark: {
        index: 4,
        scale: 0.3
    },
    whale: {
        index: 5,
        scale: 0.6
    },
}
const models = {}

for(let animal of animals) {
    gltfLoader.load(
        `/models/${animal}/${animal}.gltf`,
        (gltf) => {
            const index = animals.indexOf(animal)
            models[animal] = gltf
            models[animal].scene = gltf.scene
            // models[animal].scene.children[0].children[1].children[0].material.wireframe = true
            // // models[animal].scene.children[0].children[1].children[0].material.color = new THREE.Color(1, 1, 1)
            models[animal].scene.children[0].children[1].children[1].material.wireframe = true
            models[animal].scene.scale.set(customData[animal].scale, customData[animal].scale, customData[animal].scale)
            models[animal].scene.position.y = - (index + 1) * objectsDistance
            models[animal].scene.rotation.y = -Math.PI * 0.3

            models[animal].mixer = new THREE.AnimationMixer( models[animal].scene )
            models[animal].action = models[animal].mixer.clipAction( gltf.animations[ 0 ] )
            models[animal].action.play()


            // updateAllMaterials()
            scene.add( models[animal].scene )
        }
    )
}

/**
 * Particles
 */
// Geometry
const particlesCount = 400
const positions = new Float32Array(particlesCount * 3)
for( let i = 0; i < particlesCount; i++ ) {
    const i3 = i * 3

    positions[i3    ] = (Math.random() - 0.5) * 10
    positions[i3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * animals.length
    positions[i3 + 2] = (Math.random() - 0.5) * 10
}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute(
 'position',
 new THREE.BufferAttribute(positions, 3)
)
const particlesMaterial = new THREE.PointsMaterial({
    color: '#ffffff',
    sizeAttenuation: true,
    size: 0.03
})
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Camera
 */
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    const ration = window.scrollY / sizes.height
    const newSection = Math.round(ration)

    if(newSection !== currentSection) {
        currentSection = newSection

        // gsap.to(
        //     meshes[currentSection].rotation,
        //     {
        //         duration: 1.5,
        //         ease: 'power2.inOut',
        //         x: '+=5',
        //         y: '+=6',
        //         z: '+=1.5'
        //     }
        // )
    }


    if (ration < 1) {
        counter.style.opacity = 0
    } else if (ration < 3) {
        counter.style.opacity = 1
        counter.innerHTML = Math.floor(ration * 30) - 29
    } else if (ration < 4) {
        counter.style.opacity = 1
        counter.innerHTML = Math.floor(ration * 360 / 4)
    } else {
        counter.style.opacity = 0
    }
})

/**
 * Cursor
 */
const cursor = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    cursor.x = (event.clientX / sizes.width) - 0.5
    cursor.y = (event.clientY / sizes.height) - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Scroll
    camera.position.y = - scrollY / sizes.height * objectsDistance

    // Parallax
    const  parallaxX = cursor.x * 0.5
    const  parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate Meshes
    // for(const mesh of meshes) {
    //     mesh.rotation.x += deltaTime * 0.1
    //     mesh.rotation.y += deltaTime * 0.12
    // }

    //animate animals
    for(let animal of animals) {
        if (models[animal]?.scene && models[animal]?.mixer) {
            const y = models[animal].scene.position.y
            models[animal].mixer.update(deltaTime)
            models[animal].scene.rotation.y += deltaTime
            // models[animal].scene.position.set(
            //     -Math.sin(elapsedTime) * 2,
            //     y + Math.sin(elapsedTime) * 0.005,
            //     -Math.cos(elapsedTime) * 2
            // )
            models[animal].scene.position.x = -Math.sin(elapsedTime) * 2
            models[animal].scene.position.z = -Math.cos(elapsedTime) * 2
        }
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

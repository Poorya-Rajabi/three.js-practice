import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#317ea5'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        changeMaterials()
    })

const changeMaterials = () => {
    material.color.set(parameters.materialColor)
    particlesMaterial.color.set(parameters.materialColor)
    for (let section of sections) {
        section.style.color = parameters.materialColor
    }
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')
const sections = document.querySelectorAll('.section')

// Scene
const scene = new THREE.Scene()

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

/**
 * Objects
 */
// Material
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

// Meshes
const objectsDistance = 4
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(0.7, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.1, 0),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 100, 16),
    material
)
mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

mesh1.position.x = sizes.width * 0.1 / 100
mesh2.position.x = - sizes.width * 0.1 / 100
mesh3.position.x = sizes.width * 0.1 / 100

scene.add(mesh1, mesh2, mesh3)

const meshes = [ mesh1, mesh2, mesh3 ]

/**
 * Particles
 */
// Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)
for( let i = 0; i < particlesCount; i++ ) {
    const i3 = i * 3

    positions[i3    ] = (Math.random() - 0.5) * 10
    positions[i3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * meshes.length
    positions[i3 + 2] = (Math.random() - 0.5) * 10
}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
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
let newSection
let scrollAnimation = {
    show: false,
    cameraPosition: 0,
    scrollTo: 0
}
let scrollTarget = 0

window.addEventListener('wheel', (event) => {
    if (event.deltaY > 0) {
        // down
        if(currentSection < 2) {
            newSection = ++currentSection
            scrollAnimation = {
                cameraPosition: - newSection * objectsDistance,
                scrollTo: newSection * sizes.height
            }
            scrollY = window.scrollY
            meshAnimation()
        }
    } else {
        // up
        if(currentSection > 0) {
            newSection = --currentSection
            scrollAnimation = {
                cameraPosition: - newSection * objectsDistance,
                scrollTo: newSection * sizes.height
            }
            scrollY = window.scrollY
            meshAnimation()
        }
    }
})

const meshAnimation = () => {
    parameters.materialColor = ['#317ea5', '#35a760', '#99a735'][currentSection]
    changeMaterials()
    gsap.to(
        meshes[currentSection].rotation,
        {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=5',
            y: '+=6',
            z: '+=1.5'
        }
    )
}

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
    camera.position.y += (scrollAnimation.cameraPosition - camera.position.y) * 5 * deltaTime
    scrollTarget += (scrollAnimation.scrollTo - scrollTarget) * 5 * deltaTime
    window.scrollTo(0, scrollTarget)

    // Parallax
    const  parallaxX = cursor.x * 0.5
    const  parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate Meshes
    for(const mesh of meshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }
    particles.rotation.y += deltaTime * 0.05

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
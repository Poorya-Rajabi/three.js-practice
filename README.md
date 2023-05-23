# three.js-practice

## Setup
``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

## Demo
You can try out by clicking on this [Demo Link](https://aquamarine-crisp-802505.netlify.app/).

-----------
three.js important topics - (just an example from each topic):

BASICS
---------

* Scene:
```js
const scene = new THREE.Scene()
```

* Object (cube):
```js
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)
```

* Camera:
```js
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
scene.add(camera)
```

* Renderer:
```js
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
```


-----------
 TRANSFORM
-----------

* Axes Helper:
```js
new THREE.AxesHelper() // 3D helper (x: red, y: green, z: blue) like RGB
```

* Position:
```js
cube.position.set(2, 0.7, 1) //(x, y, z)
//cube.position.x
//cube.position.y
//cube.position.z

cube.position.length() // The distance from the center of the object to the center of scene

cube.position.distanceTo(camera.position) // distance from other object

cube.position.normalize() // object comes to distance(1) from center of scene
```

* Scale:
```js
cube.scale.set(2, 0.7, 1) //(x, y, z)
=> //cube.scale.x
=> //cube.scale.y
=> //cube.scale.z
```

* Rotation:
```js
cube.rotation.set(Math.PI, Math.PI, Math.PI) //(x, y, z)
=> //cube.rotation.x = Math.PI * 2 // 360deg
=> //cube.rotation.y = Math.PI // 180deg
=> //cube.rotation.z = Math.PI / 4 // 45deg
```

* Reorder:
```js
cube.rotation.reorder('YXZ')
```

* lookAt:
```js
camera.lookAt(cube.position) // change camera position to current object
```

-----------
 ANIMATION
-----------
```js
window.requestAnimationFrame(callback) // pass a function before print a next frame of window
```
Don't forget you need to render in animation function


* Time:
```js
const clock = new THREE.Clock() // for the same animation in all computer
const elapsedTime = clock.getElapsedTime() // time of reprint
mesh.position = elapsedTime
```

* Sin & Cos:
```js
Math.sin(elapsedTime) / Math.cos(elapsedTime)
```

* GSAP - GreenSock (Animation Library):
```js
import gsap from 'gsap'

gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })
```

--------
 CAMERA
--------
* ArrayCamera => multiple camera and switch between
* StereoCamera => using for AI camera, have two camera for eyes(left and right) - TOOL ;)
* CubeCamera => 6 camera (left, right, top, bottom, front, back)
* OrthograpicCamera => render the scene without perspective (like games with charecter fixed size)
*  PerspectiveCamera => render the scene with perspective

```js
perspectiveCamera(fov, aspect, near = 0.1 , far = 100)
```
perspectiveCamera Parameters:
* fov: fild of view, vertical vision angle, in degrees
* aspect: aspect ratio: the width of the render divided by the height of the render
* near & far: how close and how far the camera can use

```js
OrthograpicCamera(left, right, top, bottom, near = 0.1, far = 100)
const aspect = sizes.width / sizes.height
const camera = new THREE.OrthographicCamera( -1 * aspect, aspect, -1, 1, 0.1, 100 )
```

----------
 CONTROLS
----------
* DeviceOrientationControls: mobile gyroscope (deprecated!)
* flyControls: enables a navigation similar to fly modes in DCC tools like Blender.
* firstPersonControl: is like FlyControl, but with a fixed-up axis. (birds & game)
* pointerLockControl: change camera by mouse  (Counter-Strike game), is a perfect choice for first person 3D games.
* orbitControl: similar to the controls we made with more features (simon website)
* trackableControl: like orbitControl without the vertical angle limit
* transformControl: changes objects position
* dargControl: can be used to provide a drag'n'drop interaction.

```js
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true // smooth end of moving
controls.update() // when change the controls you need update it before render (in this case "dampin" update each time in tick)
```

----------
 RESIZE
----------
* FullScreen & Resizing:
```js
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
})
```

* Pixel Ratio:
```js
renderrer.setPixelRation(Math.min(window.devicePixelRation, 2))
```

----------
GEOMETRIES
----------
#### Built-in geometries:
* BoxGeometry
* CapsuleGeometry
* CircleGeometry
* ConeGeometry
* CylinderGeometry
* DodecahedronGeometry
* EdgesGeometry
* ExtrudeGeometry
* IcosahedronGeometry
* LatheGeometry
* OctahedronGeometry
* PlaneGeometry
* PolyhedronGeometry
* RingGeometry
* ShapeGeometry
* SphereGeometry
* TetrahedronGeometry
* TorusGeometry
* TorusKnotGeometry
* TubeGeometry
* WireframeGeometry

```js
// BoxGeometry
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
```
BoxGeometry Parameters:
* width — Width; that is, the length of the edges parallel to the X axis. Optional; defaults to 1.
* height — Height; that is, the length of the edges parallel to the Y axis. Optional; defaults to 1.
* depth — Depth; that is, the length of the edges parallel to the Z axis. Optional; defaults to 1.
* widthSegments — Number of segmented rectangular faces along the width of the sides. Optional; defaults to 1.
* heightSegments — Number of segmented rectangular faces along the height of the sides. Optional; defaults to 1.
* depthSegments — Number of segmented rectangular faces along the depth of the sides. Optional; defaults to 1.

```js
// Wireframe
const material = new THREE.MeshBasicMaterial( {
color: 0x00ff00,
wireframe: true
} )
```

While wandering the three.js documentation you probably came across "BufferGeometry"
Buffer Gerometries are more efficient and optimized but less developer friendly!
```js
// BoxBufferGeometry
const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2)
```

Create Custom Geometry:
```js
// create a triangle
const positionsArray = new Float32Array([
    0, 0, 0, // first vertical
    0, 1, 0, // second vertical
    1, 0, 0  // third vertical
])

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)

const geometry = new THREE.BoxBufferGeometry()
geometry.setAttribute('position', positionsAttribute)

const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
```

```js
const geometry = new THREE.BufferGeometry()

const count = 2000

const positionsArray = new Float32Array(count * 3 * 3) // count * vertex * (x+y+z)

for(let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 4 // optional amounts
}

const positionsAttr = new THREE.BufferAttribute(positionsArray, 3)

geometry.setAttribute('position', positionsAttr)
```

----------
DEBUG UI
----------
debug libraries:
* dat.GUI
* control-panel
* ControlKit
* Guify
* Oui

dat.GUI:
```js
import * as dat from 'dat.gui'

const gui = new dat.GUI()
```
dat.GUI parameters:
* Range
* Color
* Text
* Checkbox
* Select
* Button
* Folder

```js
/**
 * GUI
 */
const gui = new dat.GUI()

// Parameters
const parameters = {
    color: 0x303030,
    spin: () => {
        gsap.to(group.rotation, {
            duration: 1, y: group.rotation.y + (Math.PI * 2)
        })
    }
}

// Cube Positions
gui.add(group.position, 'x').min(-3).max(3).step(0.01).name('position)

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
```

## GUI Hints
Press 'H' to hide the panel.

if you want the panel to be hidden at start:
```js
gui.hide()
```

if you want the panel to be closed at start:
```js
const gui = new dat.GUI({ closed: true })
```

You can drag and drop the panel to change its width
You can change the default width:
```js
const gui = new dat.GUI({ width: 400 })
```
Github repository: [dataarts/dat.gui](https://github.com/dataarts/dat.gui)

----------
TEXTURES
----------
* textures resources: <br />
[https://3dtextures.me](https://3dtextures.me) <br />
[https://www.poliigon.com](https://www.poliigon.com/) <br />
[https://www.arroway-textures.ch/](https://www.arroway-textures.ch/) <br />

* you can create your own texture: <br />
[http://substance3d.com/](http://substance3d.com/) <br />

* read the following documents to understand the textures: <br />
[https://marmoset.co/posts/basic-theory-of-physically-based-rendering/](https://marmoset.co/posts/basic-theory-of-physically-based-rendering/) <br />
[https://marmoset.co/posts/physically-based-rendering-and-you-can-too/](https://marmoset.co/posts/physically-based-rendering-and-you-can-too/) <br />



load and create a texture:
```js
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/textures/door/color.jpg')

const material = new THREE.MeshBasicMaterial({ map: texture })
```

LoadingManager
```js
const LoadingManager = new THREE.LoadingManager()

LoadingManager.onStart = () => {
    console.log('onStart')
}
LoadingManager.onProgress = () => {
    console.log('onProgress')
}
LoadingManager.onLoad = () => {
    console.log('onLoad')
}
LoadingManager.onError = () => {
    console.log('onError')
}

const textureLoader = new THREE.TextureLoader(LoadingManager)
```

textures some options:
```js
colorTexture.repeat.x = 2
colorTexture.repeat.y = 3
// or
colorTexture.repeat.set( 2, 3 )

colorTexture.wrapS = THREE.MirroredRepeatWrapping
colorTexture.wrapT = THREE.RepeatWrapping

colorTexture.offset.x = 0.5
colorTexture.offset.y = 0.5

colorTexture.rotation = Math.PI / 4
colorTexture.center.x = 0.5
colorTexture.center.y = 0.5
```

Filtering & Mipmapping:
* THREE.NearestFilter
* THREE.LinearFilter
* THREE.NearestMipmapNearestFilter
* THREE.NearestMipmapLinearFilter
* THREE.LinearMipmapNearestFilter
* THREE.LinearMipmapLinearFilter (Default)
```js
// better for performance and sharp result
colorTexture.generateMipmaps = false
colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter
```

Format and Optimisation:
Size , Weight, Data

-----------
 MATERIALS
-----------

* MeshBasicMaterial
* MeshNormalMaterial
* MeshMatcapMaterial
* MeshDepthMaterial
* MeshLambertMaterial (need lights)
* MeshPhongMaterial (need lights)
* MeshToonMaterial (need lights)

materials common properties:
```js
const material = new THREE.MeshNormalMaterial()
material.color = new THREE.Color(0x00ff00)
material.wireframe = true
material.side = THREE.DoubleSide  // FrontSide(Default), BackSide, DoubleSide
material.transparent = true
material.opacity = 0.7
material.map = colorDoorTexture
material.alphaMap = alphaDoorTexture
material.flatShading = true
```

```js
const material = new THREE.MeshPhongMaterial()
material.shininess = 100
material.specular = new THREE.Color(0xff00ff)
```

Simple Light (just for testing materials):
```js
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.x = 3
pointLight.position.x = 4
scene.add(pointLight)
```

Mesh Standard Material:
```js
const textureLoader = new THREE.TextureLoader()
const ambientOcclusionDoorTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')

const material = new THREE.MeshStandardMaterial()
material.metalness = 0
material.roughness = 1
material.aoMapIntensity = 1
material.side = THREE.DoubleSide
material.map = colorDoorTexture
material.aoMap = ambientOcclusionDoorTexture
material.displacementMap = heightDoorTexture
material.displacementScale = 0.05
material.metalnessMap = metalnessDoorTexture
material.roughnessMap = roughnessDoorTexture
material.normalMap = normalDoorTexture
material.normalScale.set(0.5, 0.5)
material.transparent = true
material.alphaMap = alphaDoorTexture

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1),
    material
)
plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
)
```

* environmentMaps
```js
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapsTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg'
])

const material = new THREE.MeshStandardMaterial()
material.metalness = 1
material.roughness = 0
material.side = THREE.DoubleSide
material.envMap = environmentMapsTexture
```

### Where to find matcaps: </br>
[https://github.com/nidorx/matcaps](https://github.com/nidorx/matcaps) </br>

### Where to find environment Maps: </br>
HDRIs: [https://polyhaven.com/hdris/](https://polyhaven.com/hdris/) </br>
HTRI to CubeMap: [https://matheowis.github.io/HDRI-to-CubeMap/](https://matheowis.github.io/HDRI-to-CubeMap/) 

-----------
 3D TEXTS
-----------
we can convert a font with tools like: [facetype.js](https://gero3.github.io/facetype.js/)

in this case we use three js example font </br>
check this out: 'node_modules/three/examples/fonts/helvetiker_regular.typeface.json' </br>
and copy this font to static directory. now you can use it:

```js
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Poorya & Three.js',
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
        const textMaterial = new THREE.MeshBasicMaterial({ wireframe: true })
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)
    }
)
```

move text to center:
```js
textGeometry.computeBoundingBox()
textGeometry.translate(
    - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
    - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
    - (textGeometry.boundingBox.max.z - 0.03) * 0.5
)

// or

textGeometry.center()
```

-----------
 LIGHTS
-----------

### Lights
```js
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.3)
directionalLight.position.set(2.5, 0.25, 0)
scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)

// * the RectAreaLight only works with MeshStandardMaterial and MeshPhysicalMaterial
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

const spotLight = new THREE.SpotLight(0x00ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)

spotLight.target.position.x = -0.75
scene.add(spotLight.target)
```

### Performances
min cost: AmbientLight & HemisphereLight
moderest cost: DirectionalLight & PointLight
hight cost: SpotLight & RectAreaLight

### helpers
```js
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
spotLightHelper.color = new THREE.Color(0x00ff00)
window.requestAnimationFrame(() => spotLightHelper.update())

import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)
```
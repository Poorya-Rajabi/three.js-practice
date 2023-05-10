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

you can create your own texture: <br />
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

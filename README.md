# three.js-practice

## Setup
Download [Node.js](https://nodejs.org/en/download/)
Run this followed commands:

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
three.js important topics - (just my note):
========

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
* DeviceOrientationControls: mobile giroscope
* flyControls: control by mouse like a airplane
* firstPersonControl: is like FlyControl, but with a fixed up axies. (birds & game)
* pointerLockControl: change camera by mouse  (conter strike game)
* orbitControl: similar the controls we made with more features (simon website)
* trackableControl: like orbitControl without the vertical angle limit
* transformControl: changes objects position
* dargControl: like transformControl (lookat camera)

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
Geometries
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
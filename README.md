# three.js-practice

# this is my notes for three.js quick start

---------
 BASICS:
---------

Scene:
const scene = new THREE.Scene()

Object:
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

Camera:
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
scene.add(camera)

Renderer:
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)


-----------
 TRANSFORM
-----------

Axes Helper:
new THREE.AxesHelper() => 3D helper (x: red, y: green, z: blue) like RGB


Position:
cube.position.set(2, 0.7, 1) //(x, y, z)
=> //cube.position.x
=> //cube.position.y
=> //cube.position.z

cube.position.length() => distance from center of scene

cube.position.distanceTo(camera.position) => distance from other object

cube.position.normalize() => object comes to distance(1) from center of scene


Scale:
cube.scale.set(2, 0.7, 1) //(x, y, z)
=> //cube.scale.x
=> //cube.scale.y
=> //cube.scale.z


Rotation:
cube.rotation.set(Math.PI, Math.PI, Math.PI) //(x, y, z)
=> //cube.rotation.x = Math.PI * 2 // 360deg
=> //cube.rotation.y = Math.PI // 180deg
=> //cube.rotation.z = Math.PI / 4 // 45deg


Render:
cube.rotation.reorder('YXZ')



camera.lookAt(cube.position) => change camera position to current object
camera.lookAt(cube.position)


-----------
 ANIMATION
-----------
window.requestAnimationFrame(callback) => pass a function before print a next frame of window
* Don't forget you need to render in animation function

Time:
const clock = new THREE.Clock() => for the same animation in all computer
const elapsedTime = clock.getElapsedTime() => time of reprint
mesh.position = elapsedTime

Sin & Cos:
Math.sin(elapsedTime) / Math.cos(elapsedTime)

GSAP(Green Sock): Animation Library
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })

--------
 CAMERA
--------
ArrayCamera => multiple camera and switch between
StereoCamera => using for AI camera, have two camera for eyes(left and right) - TOOL ;)
CubeCamera => 6 camera (left, right, top, bottom, front, back)
OrthograpicCamera => render the scene without perspective (like games with charecter fixed size)
PerspectiveCamera => render the scene with perspective

perspectiveCamera(fov, aspect, near = 0.1 , far = 100)
fov: fild of view, vertical vision angle, in degrees
aspect: aspect ratio: the width of the render divided by the height of the render
near & far: how close and how far the camera can use

OrthograpicCamera(left, right, top, bottom, near = 0.1, far = 100)
const aspect = sizes.width / sizes.height
const camera = new THREE.OrthographicCamera( -1 * aspect, aspect, -1, 1, 0.1, 100 )


----------
 CONTROLS
----------
DeviceOrientationControls: mobile giroscope
flyControls: control by mouse like a airplane
firstPersonControl: is like FlyControl, but with a fixed up axies. (birds & game)
pointerLockControl: change camera by mouse  (conter strike game)
orbitControl: similar the controls we made with more features (simon website)
trackableControl: like orbitControl without the vertical angle limit
transformControl: changes objects position
dargControl: like transformControl (lookat camera)

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.update() *=> when change the controls you need update it before render (in this case "dampin" update each time in tick)


----------
 RESIZE
----------
FullScreen & Resizing:
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

Pixel Ratio:
renderrer.setPixelRation(Math.min(window.devicePixelRation, 2))


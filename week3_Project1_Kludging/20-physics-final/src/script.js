
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import * as CANNON from 'cannon-es'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

// console.log(waterFragmentShader)
// console.log(waterVertexShader)

// Debug

const gui = new GUI()
const debugObject = {}

// Reset
debugObject.reset = () => {
    for (const object of objectsToUpdate) {
        // Remove body
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)
        // Remove mesh
        scene.remove(object.mesh)
    }

    objectsToUpdate.splice(0, objectsToUpdate.length)
}
//gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper(15);
scene.add(axesHelper);

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Colors
debugObject.depthColor = '#81cfdf'
debugObject.surfaceColor = '#ff99d4'

gui.addColor(debugObject, 'depthColor').onChange(() => { waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) })
gui.addColor(debugObject, 'surfaceColor').onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })

const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms:
    {
        uTime: { value: 0 },
        
        uBigWavesElevation: { value: 0.5 },
        uBigWavesFrequency: { value: new THREE.Vector2(4.7, 3.3) },
        uBigWavesSpeed: { value: 0.85 },

        uSmallWavesElevation: { value: 0.29 },
        uSmallWavesFrequency: { value: 13 },
        uSmallWavesSpeed: { value: 1.98 },
        uSmallIterations: { value: 1 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.07 },
        uColorMultiplier: { value: 5.2 }
    }
})
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')


gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
gui.add(waterMaterial.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('uSmallIterations')

gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')


//test shader material
const testShaderSphere = new THREE.SphereGeometry(1, 20, 20)
const testShaderMaterial = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader:testFragmentShader
})
const testShaderMesh = new THREE.Mesh(testShaderSphere, waterMaterial)
testShaderMesh.position.set(10, 8, 0)
//scene.add(testShaderMesh)

//testObject
const testSphere = new THREE.SphereGeometry(1, 20, 20)
const testMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
})
const testMesh = new THREE.Mesh(testSphere, testMaterial)
//const testMesh = new THREE.Mesh(testSphere, testShaderMaterial)
testMesh.position.set(10, 5, 0)
//scene.add(testMesh)
// gui
//     .add(testMesh.position, "x")
//     .min(-10)
//     .max(10)
//     .step(0.01)
// gui
//     .add(testMesh.position, "y")
//     .min(-5)
//     .max(5)
//     .step(0.01)
// gui
//     .add(testMesh.position, "z")
//     .min(-5)
//     .max(5)
//     .step(0.01)



//const materialTestMAT = new THREE.MeshBasicMaterial()
const materialTestMAT = new THREE.MeshNormalMaterial();
//materialTestMAT.flatShading = true;
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.3, 16, 32),
    materialTestMAT
)
torus.position.set(13, 5, 0)
//scene.add(torus)
//console.log(torus)

//material test 2
const goneGeometry = new THREE.ConeGeometry(1, 1.5, 5, 8);
const materialTestMAT2 = new THREE.MeshBasicMaterial({ color: 0xffff00 });
materialTestMAT2.wireframe = true;
// const materialTestMAT2 = new THREE.MeshPhysicalMaterial();
// materialTestMAT2.metalness = 0
// materialTestMAT2.roughness = 0
const cone = new THREE.Mesh(goneGeometry, materialTestMAT2);

cone.position.set(7, 5, 0);
scene.add(testShaderMesh, testMesh, torus,cone);

//     // Geometry
// const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// // Colors
// debugObject.depthColor = '#186691'
// debugObject.surfaceColor = '#9bd8ff'

// gui.addColor(debugObject, 'depthColor').onChange(() => { waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) })
// gui.addColor(debugObject, 'surfaceColor').onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })

// // Material
// const waterMaterial = new THREE.ShaderMaterial({
//     vertexShader: waterVertexShader,
//     fragmentShader: waterFragmentShader,
//     uniforms:
//     {
//         uTime: { value: 0 },

//         uBigWavesElevation: { value: 0.2 },
//         uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
//         uBigWavesSpeed: { value: 0.75 },

//         uSmallWavesElevation: { value: 0.15 },
//         uSmallWavesFrequency: { value: 3 },
//         uSmallWavesSpeed: { value: 0.2 },
//         uSmallIterations: { value: 4 },

//         uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
//         uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
//         uColorOffset: { value: 0.08 },
//         uColorMultiplier: { value: 5 }
//     }
// })

// gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
// gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
// gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
// gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')

// gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
// gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
// gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
// gui.add(waterMaterial.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('uSmallIterations')

// gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
// gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')

// // Mesh
// const water = new THREE.Mesh(waterGeometry, waterMaterial)
// water.rotation.x = - Math.PI * 0.5
// scene.add(water)

//console.log(testMesh.position)


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

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
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, -9.82, 0)

// Default material
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 1,
        restitution: 0.7
    }
)
world.defaultContactMaterial = defaultContactMaterial

/**
 * Utils
 */
const objectsToUpdate = []

// Create sphere
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
})

const createSphere = (radius, position, velocity) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
    mesh.castShadow = true
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Sphere(radius * 0.5)

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: shape,
        material: defaultMaterial,
        // velocity: new CANNON.Vec3(velocity.x, velocity.y,velocity.z)
    })

    //body.velocity.set(0, 12, 0);

    body.position.copy(position)
    body.velocity.copy(velocity)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // Save in objects
    objectsToUpdate.push({ mesh, body })

}

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
//console.log(sizes.width, sizes.height)

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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(10, 5, 7)
scene.add(camera)
// gui
//     .add(camera.position, "x")
//     .min(-10)
//     .max(10)
//     .step(0.01)
// gui
//     .add(camera.position, "y")
//     .min(-10)
//     .max(10)
//     .step(0.01)
// gui
//     .add(camera.position, "z")
//     .min(-10)
//     .max(10)
//     .step(0.01)

// Controls

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target.set(10, 5, 0)

// Target controls
const targetControls = {
    targetX: controls.target.x,
    targetY: controls.target.y,
    targetZ: controls.target.z
}

// Update controls target position
function updateTarget() {
    controls.target.x = targetControls.targetX
    controls.target.y = targetControls.targetY
    controls.target.z = targetControls.targetZ
    controls.update() // 更新控制器以匹配新的目标位置
}


// GUI
// gui.add(targetControls, 'targetX').min(-10).max(10).step(0.01).onChange(updateTarget)
// gui.add(targetControls, 'targetY').min(-10).max(10).step(0.01).onChange(updateTarget)
// gui.add(targetControls, 'targetZ').min(-10).max(10).step(0.01).onChange(updateTarget)

/**
 * Sounds
 */
const listener = new THREE.AudioListener();
//camera.add(listener);

const sound = new THREE.Audio(listener)

const audioLoader = new THREE.AudioLoader()
audioLoader.load('/sounds/bubble.mp3')
/**
 * Sounds
 */

const hitSound = new Audio('/sounds/bubble.mp3')

const playHitSound = (collision) => {
    hitSound.currentTime = 0
    hitSound.play()
}

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
renderer.setClearColor(0x2EA9DF, 1)
//renderer.setClearColor(0x005CAF, 1)


// Array of key positions?
//1
const numXPosArray = [];
const numLength = 14;
for (let i = 0; i <= numLength; i++) {
    numXPosArray[i] = i * 1.43
}
// position.x += 1.43//20/14
const qXPosArray = [];
const qlength = 14;
for (let i = 0; i <= qlength; i++) {
    qXPosArray[i] = i * 1.43
}
// position.x += 1.54//20/13
const aXPosArray = [];
const alength = 13;
for (let i = 0; i <= alength; i++) {
    aXPosArray[i] = i * 1.54
}
// position.x += 1.67//20/12
const zXPosArray = [];
const zlength = 12;
for (let i = 0; i <= zlength; i++) {
    zXPosArray[i] = i * 1.67
}
//ctrl
const ctrlXPosArray = [];
const ctrlLength = 10;

//console.log(xPosArray[2])//test

const keyPositions = [
    //`1234567890-=
    { keyCode: 192, position: { x: numXPosArray[1], y: 0, z: 0 } },
    { keyCode: 49, position: { x: numXPosArray[2], y: 0, z: 0 } },
    { keyCode: 50, position: { x: numXPosArray[3], y: 0, z: 0 } },
    { keyCode: 51, position: { x: numXPosArray[4], y: 0, z: 0 } },
    { keyCode: 52, position: { x: numXPosArray[5], y: 0, z: 0 } },
    { keyCode: 53, position: { x: numXPosArray[6], y: 0, z: 0 } },
    { keyCode: 54, position: { x: numXPosArray[7], y: 0, z: 0 } },
    { keyCode: 55, position: { x: numXPosArray[8], y: 0, z: 0 } },
    { keyCode: 56, position: { x: numXPosArray[9], y: 0, z: 0 } },
    { keyCode: 57, position: { x: numXPosArray[10], y: 0, z: 0 } },
    { keyCode: 48, position: { x: numXPosArray[11], y: 0, z: 0 } },
    { keyCode: 189, position: { x: numXPosArray[12], y: 0, z: 0 } },
    { keyCode: 187, position: { x: numXPosArray[13], y: 0, z: 0 } },
    { keyCode: 8, position: { x: numXPosArray[14], y: 0, z: 0 } },
    //qwertyuiop[]\
    { keyCode: 9, position: { x: qXPosArray[1], y: 0, z: 0 } },
    { keyCode: 81, position: { x: qXPosArray[2], y: 0, z: 0 } },
    { keyCode: 87, position: { x: qXPosArray[3], y: 0, z: 0 } },
    { keyCode: 69, position: { x: qXPosArray[4], y: 0, z: 0 } },
    { keyCode: 82, position: { x: qXPosArray[5], y: 0, z: 0 } },
    { keyCode: 84, position: { x: qXPosArray[6], y: 0, z: 0 } },
    { keyCode: 89, position: { x: qXPosArray[7], y: 0, z: 0 } },
    { keyCode: 85, position: { x: qXPosArray[8], y: 0, z: 0 } },
    { keyCode: 73, position: { x: qXPosArray[9], y: 0, z: 0 } },
    { keyCode: 79, position: { x: qXPosArray[10], y: 0, z: 0 } },
    { keyCode: 80, position: { x: qXPosArray[11], y: 0, z: 0 } },
    { keyCode: 219, position: { x: qXPosArray[12], y: 0, z: 0 } },
    { keyCode: 221, position: { x: qXPosArray[13], y: 0, z: 0 } },
    { keyCode: 220, position: { x: qXPosArray[14], y: 0, z: 0 } },
    // asdfghjkl;''
    { keyCode: 20, position: { x: aXPosArray[1], y: 0, z: 0 } },
    { keyCode: 65, position: { x: aXPosArray[2], y: 0, z: 0 } },     // 'a' key
    { keyCode: 83, position: { x: aXPosArray[3], y: 0, z: 0 } },     // 's' key
    { keyCode: 68, position: { x: aXPosArray[4], y: 0, z: 0 } },     // 'd' key
    { keyCode: 70, position: { x: aXPosArray[5], y: 0, z: 0 } },     // 'f' key
    { keyCode: 71, position: { x: aXPosArray[6], y: 0, z: 0 } },     // 'g' key
    { keyCode: 72, position: { x: aXPosArray[7], y: 0, z: 0 } },     // 'h' key
    { keyCode: 74, position: { x: aXPosArray[8], y: 0, z: 0 } },     // 'j' key
    { keyCode: 75, position: { x: aXPosArray[9], y: 0, z: 0 } },    // 'k' key
    { keyCode: 76, position: { x: aXPosArray[10], y: 0, z: 0 } },    // 'l' key
    { keyCode: 186, position: { x: aXPosArray[11], y: 0, z: 0 } },   // ';' key
    { keyCode: 222, position: { x: aXPosArray[12], y: 0, z: 0 } },   // ''' key
    { keyCode: 13, position: { x: aXPosArray[13], y: 0, z: 0 } },     // 'enter' key
    //zxcvbnm,./
    { keyCode: 16, position: { x: zXPosArray[1], y: 0, z: 0 } },
    { keyCode: 90, position: { x: zXPosArray[2], y: 0, z: 0 } },
    { keyCode: 88, position: { x: zXPosArray[3], y: 0, z: 0 } },
    { keyCode: 67, position: { x: zXPosArray[4], y: 0, z: 0 } },
    { keyCode: 86, position: { x: zXPosArray[5], y: 0, z: 0 } },
    { keyCode: 66, position: { x: zXPosArray[6], y: 0, z: 0 } },
    { keyCode: 78, position: { x: zXPosArray[7], y: 0, z: 0 } },
    { keyCode: 77, position: { x: zXPosArray[8], y: 0, z: 0 } },
    { keyCode: 188, position: { x: zXPosArray[9], y: 0, z: 0 } },
    { keyCode: 190, position: { x: zXPosArray[10], y: 0, z: 0 } },
    { keyCode: 191, position: { x: zXPosArray[11], y: 0, z: 0 } },
    { keyCode: 16, position: { x: zXPosArray[12], y: 0, z: 0 } }
    //ctrl

];
const initialVelocityY = 12;
const adjustNum = 0.2
let splashLeftX = -2.5;
let splashRightX = 2.5;
let splashStillO = 0;
const splashStill = new CANNON.Vec3(splashStillO, initialVelocityY, 0)
const splashRight = new CANNON.Vec3(splashRightX, initialVelocityY, 0)
const splashLeft = new CANNON.Vec3(splashLeftX, initialVelocityY, 0)
let prevKeyIndex = -1;
let bubbleBasicR = 0.2;

document.addEventListener('keydown', (event) => {
    // Find the position for the pressed keys
    let keyPress;
    let currentKeyIndex;
    keyPositions.find((key, ind) => {
        if (key.keyCode === event.keyCode) {
            keyPress = key
            currentKeyIndex = ind
        }

    })
    if (prevKeyIndex >= 0) {
        if (currentKeyIndex < prevKeyIndex) {
            console.log("Current: " + currentKeyIndex + " Prev: " + prevKeyIndex)
            console.log("Moving left")
        }
        else if (currentKeyIndex == prevKeyIndex) {
            console.log("Current: " + currentKeyIndex + " Prev: " + prevKeyIndex)
            console.log("Standing still")
        }
        else {
            console.log("Current: " + currentKeyIndex + " Prev: " + prevKeyIndex)
            console.log("Moving right")
        }
    }

    //test splash towards left

    if (keyPress) {
        if (currentKeyIndex > prevKeyIndex) {
            createSphere((Math.random() * 0.5) + bubbleBasicR, {
                x: keyPress.position.x,
                y: (Math.random() - adjustNum) * 0.5,
                z: (Math.random() - adjustNum) * 3 + 1
            }
                , splashLeft)
            createSphere((Math.random() * 0.4) + bubbleBasicR, {
                x: keyPress.position.x,
                y: (Math.random() - adjustNum) * 0.5,
                z: (Math.random() - adjustNum) * 3 - 0.5
            }, splashLeft)
            createSphere((Math.random() * 0.3) + bubbleBasicR, {
                x: keyPress.position.x,
                y: (Math.random() - adjustNum) * 0.5,
                z: (Math.random() - adjustNum) * 3 - 1.5
            }, splashLeft)
            createSphere((Math.random() * 0.5) + bubbleBasicR, {
                x: keyPress.position.x,
                y: (Math.random() - adjustNum) * 0.5,
                z: (Math.random() - adjustNum) * 3
            }, splashLeft)
            createSphere((Math.random() * 0.5) + bubbleBasicR, {
                x: keyPress.position.x,
                y: (Math.random() - adjustNum) * 0.5,
                z: (Math.random() - adjustNum) * 3 - 1
            }, splashLeft);
            console.log("Current: " + currentKeyIndex + " Prev: " + prevKeyIndex)
            console.log("Splash Left")
            prevKeyIndex = currentKeyIndex
        }
        else if (currentKeyIndex < prevKeyIndex) {
            createSphere((Math.random() * 0.5) + bubbleBasicR, {
                x: keyPress.position.x,
                y: (Math.random() - adjustNum) * 0.5,
                z: (Math.random() - adjustNum) * 3 + 1
            }, splashRight
            )
            createSphere((Math.random() * 0.4) + bubbleBasicR, {
                x: keyPress.position.x,
                y: (Math.random() - adjustNum) * 0.5,
                z: (Math.random() - adjustNum) * 3 - 0.5
            }, splashRight)
            createSphere((Math.random() * 0.3) + bubbleBasicR, {
                x: keyPress.position.x,
                y: (Math.random() - adjustNum) * 0.5,
                z: (Math.random() - adjustNum) * 3 - 1.5
            }, splashRight)
            createSphere((Math.random() * 0.5) + bubbleBasicR, {
                x: keyPress.position.x,
                y: (Math.random() - adjustNum) * 0.5,
                z: (Math.random() - adjustNum) * 3
            }, splashRight)
            createSphere((Math.random() * 0.5) + bubbleBasicR, {
                x: keyPress.position.x,
                y: (Math.random() - adjustNum) * 0.5,
                z: (Math.random() - adjustNum) * 3 - 1
            }, splashRight);
            console.log("Current: " + currentKeyIndex + " Prev: " + prevKeyIndex)
            console.log("Splash Right")
            prevKeyIndex = currentKeyIndex
        }
        else {
            createSphere((Math.random() * 0.5) + bubbleBasicR, {
                x: keyPress.position.x,
                y: (Math.random() - adjustNum) * 0.5,
                z: (Math.random() - adjustNum) * 3 + 1
            }, splashStill
            )
            createSphere((Math.random() * 0.4) + bubbleBasicR, {
                x: keyPress.position.x,
                y: (Math.random() - adjustNum) * 0.5,
                z: (Math.random() - adjustNum) * 3 - 0.5
            }, splashStill)
            createSphere((Math.random() * 0.3) + bubbleBasicR, {
                x: keyPress.position.x,
                y: (Math.random() - adjustNum) * 0.5,
                z: (Math.random() - adjustNum) * 3 - 1.5
            }, splashStill)
            createSphere((Math.random() * 0.5) + bubbleBasicR, {
                x: keyPress.position.x,
                y: (Math.random() - adjustNum) * 0.5,
                z: (Math.random() - adjustNum) * 3
            }, splashStill)
            createSphere((Math.random() * 0.5) + bubbleBasicR, {
                x: keyPress.position.x,
                y: (Math.random() - adjustNum) * 0.5,
                z: (Math.random() - adjustNum) * 3 - 1
            }, splashStill);
            console.log("Current: " + currentKeyIndex + " Prev: " + prevKeyIndex)
            console.log("Splash Still")
            prevKeyIndex = currentKeyIndex
        }
    };
});



/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0
let torusRotateV = 0.2
let coneRotateV = 0.3

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

      // Water
      waterMaterial.uniforms.uTime.value = elapsedTime

    torus.rotation.y = torusRotateV * elapsedTime
    torus.rotation.x = torusRotateV * elapsedTime

    cone.rotation.y = coneRotateV * elapsedTime
    cone.rotation.x = -coneRotateV * elapsedTime
    

    // Update physics
    world.step(1 / 60, deltaTime, 3)

    for (const object of objectsToUpdate) {
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


import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui';
import testVertexShader from './shaders/water/vertex.glsl';
import testFragmentShader from './shaders/water/fragment.glsl';
import color from 'nice-color-palettes'

// var colors = require("nice-color-palettes");
// console.log(colors.length)

let ind = Math.floor(Math.random()*color.length);
let pallete = color[ind];
ind = 19;
pallete = pallete.map((color)=> new THREE.Color(color));
console.log(pallete);
/**
 * Base
 */

// Debug
// const gui = new GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// AxesHelper
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(3, 3, 256, 256)

// Material
//const waterMaterial = new THREE.MeshBasicMaterial()
const waterMaterial = new THREE.ShaderMaterial({
    uniforms:{
        time:{value:0},
        uColor:{value:pallete},
        resolution:{value:new THREE.Vector4()},
    },
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,
})
//waterMaterial.wireframe = true;

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

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
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 100)
//camera.position.set(0, 1, 0.4)
camera.position.set(0, 0.5, 0)
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
    waterMaterial.uniforms.time.value +=0.0005;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
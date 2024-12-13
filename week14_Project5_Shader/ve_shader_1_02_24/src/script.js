import * as THREE from '../node_modules/three';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js'
import GUI from './node_modules/lil-gui';
import testVertexShader from './shaders/water/vertex.glsl';
import testFragmentShader from './shaders/water/fragment.glsl';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */

// Debug
const gui = new GUI({ width: 300 });
const params = {
    progress:0,
    triScale: 1, 
    start: 0,   
    translate: 0,
    mosaic: 4 ,
};
gui.add(params, 'progress', 0, 1, 0.01).onChange((val) => {
    voxelizedMaterial.uniforms.progress.value = val;
});
gui.add(params, 'mosaic', 0, 5, 0.01).onChange((val) => {
    voxelizedMaterial.uniforms.mosaic.value = val;
});
gui.add(params, 'triScale', 0, 1, 0.01).onChange((val) => {
    voxelizedMaterial.uniforms.triScale.value = val;
});
gui.add(params, 'start', 0, 1, 0.01).onChange((val) => {
    postQuad.material.uniforms.start.value = val;
});
gui.add(params, 'translate', 0, 1, 0.01).onChange((val) => {
    postQuad.material.uniforms.translate.value = val;
});

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

/**
 * Water
 */
// Geometry
// const waterGeometry = new THREE.PlaneGeometry(3, 3, 256, 256)

// Material
const voxelizedMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms:{        
        time: {value:0},
        mosaic:{value:params.mosaic},
        progress:{value:params.progress},
        triScale:{value:params.triScale},
        resolution:{value: new THREE.Vector4()},
    },
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
})

/**
 * Models
 */
let model;
const gltfLoader = new GLTFLoader();
gltfLoader.load(
    './LeePerrySmith.glb',
    (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = voxelizedMaterial;
            }
        });
        gltf.scene.children[0].geometry = gltf.scene.children[0].geometry.toNonIndexed();
        gltf.scene.children[0].geometry.center()
        let pos = gltf.scene.children[0].geometry.attributes.position.array;
        //calculate center of each triangle
        let centers = [];
        for(let i = 0;i<pos.length;i+=9){
            let centerX = (pos[i] + pos[i+3] + pos[i+6]) /3;
            let centerY = (pos[i+1] + pos[i+4] + pos[i+7]) /3;
            let centerZ = (pos[i+2] + pos[i+5] + pos[i+8]) /3;

            centers.push(centerX,centerY,centerZ);
            centers.push(centerX,centerY,centerZ);
            centers.push(centerX,centerY,centerZ);
        }
        gltf.scene.children[0].geometry.setAttribute('center', new THREE.BufferAttribute(new Float32Array(centers),3));
        model = gltf.scene;
        scene.add(gltf.scene); 
    }
);

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
 * Setup Post-processing
 */
const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
orthoCamera.position.z = 1;
const orthoScene = new THREE.Scene();
const postQuad = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
        uniforms:{
            current:{value:null},
            prev:{value:null},
            start:{value:0},
            time:{value:0},
            translate:{value:0}
        },
        vertexShader: `
        varying vec2 vUv;
        void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
            `,
        fragmentShader: `
        uniform sampler2D current;
        uniform sampler2D prev;
        uniform float start;
        uniform float time;
        uniform float translate;
        varying vec2 vUv;
        void main(){
            float PI = 3.14159265359;
            vec2 uv = vUv;
            uv -= vec2(0.5);
            uv *= vec2(2., 1.);
            uv.y += translate;
            uv /= 4.;
            
            uv.x += sin(uv.y * PI * 4. + time*0.3)*0.15;
            uv.x += sin(uv.y * PI * 16. + time*0.5)*0.15;

            uv += vec2(0.5);

            uv = mix(vUv,uv, start);

            vec4 currentColor = texture2D(current, uv);
            vec4 prevColor = texture2D(prev,vUv);

            vec4 color = vec4(mix( prevColor.rgb, currentColor.rgb, 0.05), 1.0);
            gl_FragColor = color;
            //gl_FragColor = vec4(vUv, 0.0, 1.0);
    }`
    })
)
orthoScene.add(postQuad);

const finalScene = new THREE.Scene()
const finalQuad = new THREE.Mesh(
    new THREE.PlaneGeometry(2,2),
    new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: null
    })
)
finalScene.add(finalQuad);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 100)
camera.position.set(6, 1, 6)
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
// add render target
const sourceRenderTarget = new THREE.WebGLRenderTarget(sizes.width, sizes.height);
let renderTarget1 = new THREE.WebGLRenderTarget(sizes.width, sizes.height);
let renderTarget2 =new THREE.WebGLRenderTarget(sizes.width, sizes.height);

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    if (model) {
       // model.position.x = 0.5 * Math.sin(elapsedTime*headMoveSpeed); 
        postQuad.material.uniforms.time.value = elapsedTime;
    }
    
    // Update voxelizedMaterial time uniform
    voxelizedMaterial.uniforms.time.value += 0.05;

    requestAnimationFrame(tick.bind());
    renderer.setRenderTarget(sourceRenderTarget)
    renderer.render(scene,camera)
    postQuad.material.uniforms.current.value = sourceRenderTarget.texture
    postQuad.material.uniforms.prev.value = renderTarget1.texture
    
    renderer.setRenderTarget(renderTarget2)
    renderer.render(orthoScene,orthoCamera)

    finalQuad.material.map = renderTarget1.texture
    renderer.setRenderTarget(null)
    renderer.render(finalScene,orthoCamera)

    // swap render targets
    let temp = renderTarget1
    renderTarget1 = renderTarget2
    renderTarget2 = temp

    // Update controls
    controls.update()

    // Render
    //renderer.render(scene, camera)
    renderer.render(orthoScene, orthoCamera)

    // Call tick again on the next frame
    //window.requestAnimationFrame(tick)
}

tick()
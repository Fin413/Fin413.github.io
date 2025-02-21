import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

import {TrackballControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/TrackballControls.js';
import {GLTFLoader} from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js';
import {STLLoader} from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/STLLoader.js';

import {RenderPass} from 'https://unpkg.com/three@0.126.1/examples/jsm/postprocessing/RenderPass.js';
import {ShaderPass} from 'https://unpkg.com/three@0.126.1/examples/jsm/postprocessing/ShaderPass.js';

import {FilmPass} from 'https://unpkg.com/three@0.126.1/examples/jsm/postprocessing/FilmPass.js';
import {AfterimagePass} from 'https://unpkg.com/three@0.126.1/examples/jsm/postprocessing/AfterimagePass.js';


import { RGBShiftShader } from 'https://unpkg.com/three@0.126.1/examples/jsm/shaders/RGBShiftShader.js';
import { DotScreenShader } from 'https://unpkg.com/three@0.126.1/examples/jsm/shaders/DotScreenShader.js';


import {GlitchPass} from 'https://unpkg.com/three@0.126.1/examples/jsm/postprocessing/GlitchPass.js';
import { EffectComposer } from 'https://unpkg.com/three@0.126.1/examples/jsm/postprocessing/EffectComposer.js';


const scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 30000);
const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );
renderer.domElement.id = "wizardCanvas";

window.addEventListener( 'resize', onWindowResize, false );

const composer = new EffectComposer( renderer );
composer.addPass(new RenderPass(scene, camera));

const glitchPass = new GlitchPass();
composer.addPass( glitchPass );

composer.addPass( new FilmPass() )
// composer.addPass( new AfterimagePass() )

// const effect1 = new ShaderPass( DotScreenShader );
// effect1.uniforms[ 'scale' ].value = 4;
// composer.addPass( effect1 );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // renderer.setSize( window.innerWidth / 4, 312);
    renderer.setSize( window.innerWidth, window.innerHeight);

}

camera.position.set(0, 0, 60);
camera.rotation.set(0, 0, 0);

const controls = new TrackballControls( camera, renderer.domElement );

var meshBasicMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
    wireframeLinewidth: 1
});

const loader = new STLLoader()
loader.load(
    'wizard.stl',
    function (geometry) {
        const mesh = new THREE.Mesh(geometry, meshBasicMaterial)
        let loadedModel = mesh;
        scene.add(mesh)
        const moveModel = () => {
            if (loadedModel) {
                // loadedModel.rotation.x += 0.02;
                loadedModel.rotation.y += 0.02;
                // loadedModel.position.x = -20;
                // loadedModel.position.y = -20;
                // loadedModel.rotation.z += 0.01;
            }
            requestAnimationFrame(moveModel);
        };
        moveModel();
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        if((xhr.loaded / xhr.total) * 100 === 100) wizLoaded = true;
        onModelLoad();
    },
    (error) => {
        console.log(error)
    }
)

loader.load(
    'DNA.stl',
    function (geometry) {
        const mesh = new THREE.Mesh(geometry, meshBasicMaterial)
        let loadedModel = mesh;
        scene.add(mesh)
        loadedModel.position.x = 50;
        loadedModel.position.y = 35;
        loadedModel.scale.set(6,6,6)
        loadedModel.rotation.x = Math.PI / 2;
        const moveModel = () => {
            if (loadedModel) {
                loadedModel.rotation.z += 0.01;
            }
            requestAnimationFrame(moveModel);
        };
        moveModel();
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        if((xhr.loaded / xhr.total) * 100 === 100) dnaOneLoaded = true;
        onModelLoad();
    },
    (error) => {
        console.log(error)
    }
)

loader.load(
    'DNA.stl',
    function (geometry) {
        const mesh = new THREE.Mesh(geometry, meshBasicMaterial)
        let loadedModel = mesh;
        scene.add(mesh)
        loadedModel.position.x = -50;
        loadedModel.position.y = 35;
        loadedModel.scale.set(6,6,6)
        loadedModel.rotation.x = Math.PI / 2;
        const moveModel = () => {
            if (loadedModel) {
                loadedModel.rotation.z -= 0.01;
            }
            requestAnimationFrame(moveModel);
        };
        moveModel();
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        if((xhr.loaded / xhr.total) * 100 === 100) dnaTwoLoaded = true;
        onModelLoad();
    },
    (error) => {
        console.log(error)
    }
)

// const light = new THREE.AmbientLight( 0x404040, 4.5 ); // soft white light
// scene.add( light );

const light = new THREE.PointLight( 0xffffff, 5, 10000 );
light.position.set( 50, 150, 50 );
scene.add( light );

const geometry = new THREE.RingGeometry( 25, 26, 10 ); 
const geometryTwo = new THREE.RingGeometry( 30, 31, 35 ); 
const material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
const ringMesh = new THREE.Mesh( geometry, material ); 
const largerMesh = new THREE.Mesh(geometryTwo, material)
const largerMeshTwo = new THREE.Mesh(geometryTwo, material)

scene.add( ringMesh );
scene.add( largerMesh );
scene.add( largerMeshTwo );
ringMesh.rotation.x = Math.PI / 2 + 0.2;
largerMesh.rotation.x = Math.PI / 2 + 0.2;
largerMesh.rotation.y = 0.5;
largerMeshTwo.rotation.x = Math.PI / 2 + 0.2;
largerMeshTwo.rotation.y = -0.5;

let num = 60
let dir = 1;
function animate() {
    renderer.render( scene, camera );
    composer.render();
    // controls.update();
    ringMesh.rotation.z += 0.01;

    camera.position.set(0, 0, num);
    
    if(Math.abs(num) == 60){
        setTimeout(() => {
            dir = -dir;
            // num = 59 * dir;
        }, 2000);
    }else{
        num += dir;
    }

    requestAnimationFrame( animate );
};

animate();
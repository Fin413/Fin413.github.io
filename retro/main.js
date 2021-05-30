const element = document.querySelector("h1");
const cursor =  document.querySelector("h2");

var typeLoop;
var string = "Finlay Soehn.";
if(window.innerWidth <= 980) string = "Finlay.";

setTimeout(()=>{
    cursor.style.animation = "none";
    typeLoop = setInterval(typeLetter, 100);
}, 500);

function typeLetter(){
    if(element.innerHTML.length == string.length-1){
        cursor.style.animation = "blink 950ms steps(2, start) infinite";
        document.getElementById("scroll").style.visibility = "visible";
        clearInterval(typeLoop);
    }
    element.innerHTML += string[element.innerHTML.length];
}

var scramble;
var solve;
var solvedLetters = [];
element.onmouseover = () => {
    stopScramble();
    scramble = setInterval(scrambleString, 50);
}  
element.onmouseleave = unscramble;

function stopScramble(){
    clearInterval(solve);
    clearInterval(scramble);
    solvedLetters = [];
}

function scrambleString(){
    const clearCharacters = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890~!@#$%^&*()`-_=+[]{}\\|:\;\"'?/>.<,";
    for(var i = 0; i < string.length; i++){
        let temp = element.innerText;
        if(solvedLetters.includes(i) || temp[i] == " ") continue;

        let random = Math.floor(Math.random() * (clearCharacters.length)); 
        element.innerText = temp.substring(0, i) + clearCharacters[random] + temp.substring(i + 1);
    }
}

function unscramble(){        
    const solveFunc = () => {
        if(solvedLetters.length == string.length){
            stopScramble();
            return;
        }

        let numLettersSolved = Math.floor(Math.random() * 3);
        if((string.length - solvedLetters.length) == 1) numLettersSolved = 1;
        
        for(var i = 0; i < numLettersSolved; i++){
            let charIndex = Math.floor(Math.random() * string.length);

            while(solvedLetters.includes(charIndex)){ 
                if(charIndex == string.length-1) charIndex = 0;
                else charIndex++;
            }
            
            solvedLetters.push(charIndex);
            
            element.innerText = element.innerText.substring(0, charIndex) + string[charIndex] + element.innerText.substring(charIndex + 1);
        }
    }
    solve = setInterval(solveFunc, 75);
}

const htmlContainer = document.getElementById("main");
var scrollVal = 1;
function scrollHandler(e){
    e.preventDefault();
    scrollVal += e.deltaY*(-0.001);
    scrollVal = Math.min(Math.max(.01, scrollVal), 1);
    htmlContainer.style.transform = "scale(" + scrollVal + ")";
}

if (window.addEventListener){
    window.addEventListener("mousewheel", scrollHandler, {passive: false}); // IE9+, Chrome, Safari, Opera
    window.addEventListener("DOMMouseScroll", scrollHandler); // Firefox
}else{
    window.attachEvent("onmousewheel", scrollHandler); // IE 6/7/8
}
  
import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from 'https://threejs.org/examples/jsm/loaders/OBJLoader.js';


const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xff0000 );

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

const spaceTexture = new THREE.TextureLoader().load('images/space.jpeg');
scene.background = spaceTexture;

const textureLoader = new THREE.TextureLoader();
const TVmaterial = new THREE.MeshBasicMaterial({map: textureLoader.load('old-tv/textures/rsMaterial3SG_albedo.jpg')});

const loader = new OBJLoader();
loader.load(
    'old-tv/source/model.obj',

    function(object){
        object.traverse(function(node){
            if (node.isMesh) node.material = TVmaterial;
        });        
        scene.add(object);
    },

    function(xhr){
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded');
    },

    function(error){
        console.log(error);
    }
);

const gridHelper = new THREE.GridHelper(10, 50);
scene.add(gridHelper);

camera.position.z = 5;

window.onresize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    controls.update();

    renderer.setSize(window.innerWidth, window.innerHeight);
   
    stopScramble();
    if(window.innerWidth <= 980) element.innerHTML = string = "Finlay.";
    else element.innerHTML = string = "Finlay Soehn.";
}

const animate = function() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
};

animate();
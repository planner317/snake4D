import * as THREE from '../snake3D/three/three.module.js'
import { OrbitControls } from '../snake3D/three/OrbitControls.js'
import { RectAreaLightUniformsLib } from '../snake3D/three/RectAreaLightUniformsLib.js'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8080aa);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(15, 7, 16);

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 30;
controls.target.set(5, 5, 5)

// Snake
const snake = new Snake4Dbot();
snake.deleteBlock = deleteBlock;
snake.createBlock = createBlock;
snake.createApple = createApple;
snake.deleteApple = deleteApple;
snake.gameOver = gameOver;
snake.timeout = 200 - speed.value;

// Apple
const geometryApple = new THREE.SphereBufferGeometry(0.5, 16, 16)
const materialApple = new THREE.MeshPhongMaterial({ color: 0xff5555 });
const meshApple = new THREE.Mesh(geometryApple, materialApple);
meshApple.castShadow = true;
meshApple.receiveShadow = true;
scene.add(meshApple);

// Light room zona
const ambientLight = new THREE.AmbientLight
ambientLight.intensity = 0.1
scene.add(ambientLight);
const light = new THREE.PointLight()
light.position.x = snake.zona.x/2
light.position.y = snake.zona.y 
light.position.z = snake.zona.z / 2
light.castShadow = true
light.intensity = 0.1
scene.add(light)

RectAreaLightUniformsLib.init();
const rectLight = new THREE.RectAreaLight(0xffffff, 40, 2, 2);
rectLight.position.set(snake.zona.x / 2, snake.zona.y - 0.001, snake.zona.z / 2);
rectLight.rotation.x = -3.14159 / 2
scene.add(rectLight);

const rectLightMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial({ side: THREE.BackSide }));
rectLightMesh.scale.x = rectLight.width;
rectLightMesh.scale.y = rectLight.height;
rectLight.add(rectLightMesh);

const geometryZona = new THREE.BoxBufferGeometry(snake.zona.x * 1.001, snake.zona.y * 1.001, snake.zona.z * 1.001)
const materialZona = new THREE.MeshStandardMaterial({ color: 0xffFFff, roughness: 0.5, metalness: 0, side: 1 });
const meshZona = new THREE.Mesh(geometryZona, materialZona);
meshZona.position.set(snake.zona.x / 2, snake.zona.y / 2, snake.zona.z / 2)
meshZona.receiveShadow = true
scene.add(meshZona);


speed.oninput = () => snake.timeout = 200 - speed.value;
snake.start({ x: 3, y: 3, z: 3, w: 0 });
snake.createApple(snake.apple)
animate();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function createBlock(block) {
    const size = 1 - block.w * 0.25

    const geometry = new THREE.BoxBufferGeometry(size, size, size)
    const material = new THREE.MeshPhysicalMaterial( {
        metalness: 0,
        roughness: 1,
        alphaTest: 0.5, 
        depthTest: false,
        transparency: 0.5 - block.w * 0.25,
        transparent: true
    } );
    
    material.color.setHSL(block.w / 3, 0.7, 0.51)
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true
    mesh.position.set(block.x + 0.5, block.y + 0.5, block.z + 0.5)
    scene.add(mesh);
    this.blocks[0].mesh = mesh;
}

function deleteBlock(block) {
    scene.remove(block.mesh)
}

function createApple(block) {
    const size = 1 - block.w * 0.25
    meshApple.scale.setScalar(size)
    materialApple.color.setHSL(block.w / 3, 0.7, 0.5)
    materialApple.emissive.setHSL(block.w / 3, 0.7, 0.2)
    meshApple.position.set(block.x + 0.5, block.y + 0.5, block.z + 0.5)
}

function deleteApple() {
    const audio = new Audio("../audio/1.mp3")
    audio.volume = 0.3
    audio.play();
}

function gameOver() {
    const audio = new Audio("../audio/crash.mp3")
    audio.volume = 0.3
    audio.play();
}

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

setInterval(() => {
    score.innerHTML = snake.blocks.length
}, 50);
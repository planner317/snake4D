import * as THREE from './three/three.module.js'
import { OrbitControls } from './three/OrbitControls.js'
import { RectAreaLightUniformsLib } from './three/RectAreaLightUniformsLib.js'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8080aa);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 3);

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 30;
controls.target.set(-0.1, -0.1, -0.1)

// Light zona
const ambientLight = new THREE.AmbientLight()
ambientLight.intensity = 0.1
scene.add(ambientLight);
const light = new THREE.DirectionalLight();
light.position.y = 2
light.castShadow = true
light.intensity = 0.3
scene.add(light)

RectAreaLightUniformsLib.init();
const rectLight = new THREE.RectAreaLight(0xffffff, 1, 1.98, 1.98);
rectLight.position.set(-0.1, 0.899, -0.1);
rectLight.rotation.x = -3.14159 / 2
scene.add(rectLight);

const rectLightMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial({ side: THREE.BackSide }));
rectLightMesh.scale.x = rectLight.width;
rectLightMesh.scale.y = rectLight.height;
rectLight.add(rectLightMesh);

// Snake
const snake = new Snake3Dbot();
snake.deleteBlock = deleteBlock;
snake.createBlock = createBlock;
snake.createApple = createApple;
snake.deleteApple = deleteApple;
snake.gameOver = gameOver;
snake.size = 0.2
snake.timeout = 200 - speed.value;
// window.snake = snake

// Head
let materialHead = new THREE.MeshPhongMaterial({ color: 0x44ff44 });
materialHead.emissive.setRGB(0.1, 1, 0.1)
const geometry = new THREE.ConeBufferGeometry(snake.size * 0.7, snake.size, 4)
const lightHead = new THREE.PointLight(0x44ff44, 0.2);
lightHead.castShadow = true
window.headMesh = new THREE.Mesh(geometry, materialHead);
headMesh.castShadow = true
headMesh.add(lightHead)
scene.add(headMesh);

// Apple
const geometryApple = new THREE.SphereBufferGeometry(snake.size * 0.5, 16, 16)
const materialApple = new THREE.MeshPhongMaterial({ color: 0xff5555 });
materialApple.emissive.setRGB(1, 0, 0);
const meshApple = new THREE.Mesh(geometryApple, materialApple);
meshApple.castShadow = true;
meshApple.receiveShadow = true;
const lightApple = new THREE.PointLight(0xff1010, 3);
lightApple.distance = 1;
lightApple.castShadow = true;
meshApple.add(lightApple);
scene.add(meshApple);

// Zona
const geometryZona = new THREE.BoxBufferGeometry(snake.zona.width * snake.size, snake.zona.height * snake.size, snake.zona.depth * snake.size)
const materialZona = new THREE.MeshStandardMaterial({ color: 0xffFFff, roughness: 0, metalness: 0, side: 1 });
var mesh = new THREE.Mesh(geometryZona, materialZona);
mesh.position.addScalar(-snake.size / 2)
mesh.receiveShadow = true
scene.add(mesh);

// Политра
const pal = [
    0x44ff44,
    0x88ff88,
    0x22aa22,
    0x99ff99,
    0x66dd66,
    0x55ee55,
]
speed.oninput = () => snake.timeout = 200 - speed.value;
snake.start({ x: 3, y: 3, z: 3 });
snake.createApple(snake.apple)
animate();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function createBlock(block) {
    let size = this.size

    const geometry = new THREE.BoxBufferGeometry(size, size, size)
    const materialBlock = new THREE.MeshStandardMaterial({ color: 0x44cc44, roughness: 0, metalness: 0, flatShading: true });
    const mesh = new THREE.Mesh(geometry, materialBlock);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const pos = this.blocks[1]
    mesh.position.set(pos.x * size, pos.y * size, pos.z * size)
    scene.add(mesh);
    this.blocks[1].mesh = mesh;
    for (let i = 1; i < this.blocks.length; i++) {
        if (this.blocks[i].mesh) this.blocks[i].mesh.material.color.setHex(pal[(i - 1) % pal.length]);
    }

    headMesh.position.set(block.x * size, block.y * size, block.z * size)
    if (this.direction == Snake3Dbot.DIRECTION.UP) headMesh.rotation.set(0, 0.785, 0);
    else if (this.direction == Snake3Dbot.DIRECTION.DOWN) headMesh.rotation.set(0, 0.785, 3.14);
    else if (this.direction == Snake3Dbot.DIRECTION.LEFT) headMesh.rotation.set(0.785, 0, 3.14 / 2);
    else if (this.direction == Snake3Dbot.DIRECTION.RIGHT) headMesh.rotation.set(0.785, 0, -3.14 / 2);
    else if (this.direction == Snake3Dbot.DIRECTION.FORWARD) headMesh.rotation.set(-3.14 / 2, 0.785, 0);
    else headMesh.rotation.set(3.14 / 2, 0.785, 0);
}

function deleteBlock(block) {
    scene.remove(block.mesh)
}

function createApple(block) {
    meshApple.position.set(block.x * this.size, block.y * this.size, block.z * this.size)
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
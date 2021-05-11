import * as THREE from './three/three.module.js'
import { OrbitControls } from './three/OrbitControls.js'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8080aa);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.addScalar(0.9)

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 30;

// Light zona
const ambientLight = new THREE.AmbientLight()
ambientLight.intensity = 0.3
scene.add(ambientLight);
const light = new THREE.DirectionalLight();
light.position.set(0.2,0.5,0.2)
light.intensity = 1
scene.add(light)
window.l = light

// Snake
const snake = [];
const headMesh = [];
for (let i = 0; i < 20; i++) {
    snake[i] = new Snake3Dbot();
    snake[i].apple = snake[0].apple;
    snake[i].timeout = 100 - speed.value
    snake[i].deleteBlock = deleteBlock;
    snake[i].createBlock = createBlock;
    snake[i].createApple = createApple;
    snake[i].deleteApple = deleteApple;
    snake[i].gameOver = gameOver;
    snake[i].size = 0.05
    snake[i].zona.width = snake[i].zona.depth = snake[i].zona.height = 32
    snake[i].zona.start.x = snake[i].zona.start.y = snake[i].zona.start.z = -16
    snake[i].id = i;
    snake[i].light = 0
    
    // Head
    const materialHead = new THREE.MeshStandardMaterial({flatShading: true });
    materialHead.emissive.setHSL(i/20, 0.7, 0.5)
    materialHead.color.setHSL(i/20, 0.7, 0.5)
    const geometryHead = new THREE.ConeBufferGeometry(snake[0].size * 0.7, snake[0].size, 4)
    headMesh.push(new THREE.Mesh(geometryHead, materialHead));
    scene.add(headMesh[i]);
    snake[i].start({ x: i, y: i, z: i });
}


// Apple
const geometryApple = new THREE.SphereBufferGeometry(snake[0].size * 0.5, 16, 16)
const materialApple = new THREE.MeshStandardMaterial({color:0xff6060 });
materialApple.emissive.setRGB(1, 0, 0);
const meshApple = new THREE.Mesh(geometryApple, materialApple);
meshApple.castShadow = true;
meshApple.receiveShadow = true;
scene.add(meshApple);

speed.oninput = () => {
    for (let i = 0; i < 20; i++) {
        snake[i].timeout = 100 - speed.value;
    }
}


animate();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function createBlock(block) {
    let size = this.size

    const geometry = new THREE.BoxBufferGeometry(size, size, size)
    const materialBlock = new THREE.MeshStandardMaterial({ roughness: 0, metalness: 0, flatShading: true });
    const mesh = new THREE.Mesh(geometry, materialBlock);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const pos = this.blocks[1]
    mesh.position.set(pos.x * size, pos.y * size, pos.z * size)
    scene.add(mesh);
    this.blocks[1].mesh = mesh;
    for (let i = 1; i < this.blocks.length; i++) {
        if (this.blocks[i].mesh) {
            let color = new THREE.Color().setHSL(this.id / 20, 0.7, (Math.sin(i) + 11) / 20 + this.light * 0.3)
            this.blocks[i].mesh.material.color = color
            this.blocks[i].mesh.material.emissive = color
            this.blocks[i].mesh.material.emissiveIntensity = this.light
        }
    }
    if (this.light > 0) this.light -= 0.033
    headMesh[this.id].position.set(block.x * size, block.y * size, block.z * size)
    if (this.direction == Snake3Dbot.DIRECTION.UP) headMesh[this.id].rotation.set(0, 0.785, 0);
    else if (this.direction == Snake3Dbot.DIRECTION.DOWN) headMesh[this.id].rotation.set(0, 0.785, 3.14);
    else if (this.direction == Snake3Dbot.DIRECTION.LEFT) headMesh[this.id].rotation.set(0.785, 0, 3.14 / 2);
    else if (this.direction == Snake3Dbot.DIRECTION.RIGHT) headMesh[this.id].rotation.set(0.785, 0, -3.14 / 2);
    else if (this.direction == Snake3Dbot.DIRECTION.FORWARD) headMesh[this.id].rotation.set(-3.14 / 2, 0.785, 0);
    else headMesh[this.id].rotation.set(3.14 / 2, 0.785, 0);
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
    this.light = 1
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

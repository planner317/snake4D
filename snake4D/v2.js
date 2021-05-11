import * as THREE from '../snake3D/three/three.module.js'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8080aa);
window.T = THREE
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(0.2, window.innerWidth / window.innerHeight, 3800, 4100)
camera.position.set(0, 0, 4000);

// Snake
const snake = new Snake4Dbot();
snake.deleteBlock = deleteBlock;
snake.createBlock = createBlock;
snake.createApple = createApple;
snake.deleteApple = deleteApple;
snake.gameOver = gameOver;
snake.timeout = 200 - speed.value;
snake.zona.x = snake.zona.y = snake.zona.z = 4;
snake.zona.w = 8

// Apple
const geometryApple = new THREE.SphereBufferGeometry(0.5, 16, 16)
const materialApple = new THREE.MeshPhongMaterial({ color: 0xff3030 });
const meshApple = new THREE.Mesh(geometryApple, materialApple);
meshApple.castShadow = true;
meshApple.receiveShadow = true;
scene.add(meshApple);

// box zona
const geometryZona = new THREE.BoxBufferGeometry(snake.zona.x, snake.zona.y, snake.zona.z)
const materialZona = new THREE.MeshStandardMaterial({ side: 1 });
const zonas = []
for (let i = 0; i < 8; i++) {
    zonas.push(new THREE.Group())
    scene.add(zonas[i])
    const meshZona = new THREE.Mesh(geometryZona, materialZona);
    zonas[i].add(meshZona);
    meshZona.receiveShadow = true
    zonas[i].position.set(
        (i * 6) % 24 - 9,
        i < 4 ? 3.5 : -3.5,
        i * 20);
    zonas[i].rotation.set(0.5, 0.5, 0)
    const pointL = new THREE.PointLight(0xffFFff, 1, 15);
    pointL.castShadow = true;
    pointL.position.y = snake.zona.y * 2
    zonas[i].add(pointL)
}

// Light
const ambientLight = new THREE.AmbientLight()
ambientLight.intensity = 0.1
scene.add(ambientLight);

const light = new THREE.DirectionalLight()
light.position.x = 0.5
light.position.y = 1
light.position.z = 0.5
light.intensity = 0.5
scene.add(light)


speed.oninput = () => snake.timeout = 200 - speed.value;
snake.start({ x: 3, y: 3, z: 3, w: 0 });
snake.createApple(snake.apple)
animate();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function createBlock(block) {
    let size = 0.95

    const geometry = new THREE.BoxBufferGeometry(size, size, size)
    var material = new THREE.MeshPhongMaterial({ color: 0x00cc00, emissive: 0x808080 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true
    mesh.position.set(block.x - 1.5, block.y - 1.5, block.z - 1.5)
    zonas[block.w].add(mesh);
    this.blocks[0].mesh = mesh;
    if (this.blocks[1].mesh) this.blocks[1].mesh.material.emissive.setScalar(0)
}

function deleteBlock(block) {
    zonas[block.w].remove(block.mesh)
}

function createApple(block) {
    meshApple.position.set(block.x - 1.5, block.y - 1.5, block.z - 1.5)
    zonas[block.w].add(meshApple);
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

let mouseL = false
renderer.domElement.onpointerdown = (e) => {
    mouseL = true;
}

renderer.domElement.onpointermove = (e) => {
    if (mouseL) {
        const x = e.movementX / 100;
        const y = e.movementY / 100;
        for (let i = 0; i < zonas.length; i++) {
            zonas[i].rotation.x += y;
            zonas[i].rotation.y += x;
        }
    }
}
renderer.domElement.onpointerup = () => mouseL = false

setInterval(() => {
    score.innerHTML = snake.blocks.length
}, 50);
const snakes =[];

for (let i = 0; i < 2; i++) {
    snakes[i] = new Snake();
    snakes[i].timeOut = 200
    snakes[i].deleteBlock = deleteBlock;
    snakes[i].deleteApple = deleteApple;
    snakes[i].createBlock = createBlock;
    snakes[i].createApple = createApple;
    snakes[i].gameOver = gameOver;
    snakes[i].size = 25
    snakes[i].zona.width = snakes[i].zona.height = 20
}
snakes[0].zona.start = { x: 0, y: 0 };
snakes[1].zona.start = { x: 21, y: 0 };

const cnv = document.createElement("canvas");
cnv.width = 41 * 25;
cnv.height = 20 * 25;
cnv.style.position = "absolute"
cnv.style.setProperty('left', (window.innerWidth - cnv.width) / 2 + 'px');
document.body.appendChild(cnv);
const ctx = cnv.getContext("2d");

createPlane(snakes[0]);
snakes[0].newApple()
snakes[0].start({ x: 5, y: 5 });
createPlane(snakes[1]);
snakes[1].newApple()
snakes[1].start({ x: 5, y: 5 });


ctx.fillStyle = "#234";

function createPlane(snake) {
    const x = snake.zona.start.x * snake.size;
    const y = snake.zona.start.y * snake.size;
    const width = snake.zona.width * snake.size;
    const height = snake.zona.width * snake.size;
    ctx.beginPath();
    ctx.fillStyle = "#234";
    ctx.fillRect(x, y, width, height);
}

function createBlock(block) {
    let size = this.size
    ctx.beginPath();
    ctx.fillStyle = "#7f7";
    ctx.fillRect(block.x * size, block.y * size, size, size);
}

function deleteBlock(block) {
    let size = this.size
    ctx.beginPath();
    ctx.fillStyle = "#234";
    ctx.fillRect(block.x * size, block.y * size, size, size);
}

function createApple(block) {
    let size = this.size
    ctx.beginPath();
    ctx.fillStyle = "#f00";
    ctx.fillRect(block.x * size, block.y * size, size, size);
}

function deleteApple() {
    const audio = new Audio("../audio/1.mp3")
    audio.volume = 0.5
    audio.play();
}

function gameOver() {
    const audio = new Audio("../audio/crash.mp3")
    audio.volume = 0.1
    audio.play();
    clearTimeout(snakes[0].idTimeout);
    clearTimeout(snakes[1].idTimeout);
    textGameOver.style.display = "block"
    const x = this.zona.start.x * this.size;
    const y = this.zona.start.y * this.size;
    const width = this.zona.width * this.size;
    const height = this.zona.width * this.size;
    ctx.beginPath();
    ctx.strokeStyle = "#f00";
    ctx.lineWidth = 10
    ctx.strokeRect(x, y, width, height);
}
window.onkeydown = handlerKey;

function handlerKey(e) {
    if (e.code == "KeyS") snakes[0].queueOfDirections.push(Snake.DIRECTION.UP)
    if (e.code == "KeyD") snakes[0].queueOfDirections.push(Snake.DIRECTION.RIGHT)
    if (e.code == "KeyW") snakes[0].queueOfDirections.push(Snake.DIRECTION.DOWN)
    if (e.code == "KeyA") snakes[0].queueOfDirections.push(Snake.DIRECTION.LEFT)

    if (e.code == "ArrowDown")  snakes[1].queueOfDirections.push(Snake.DIRECTION.UP)
    if (e.code == "ArrowRight") snakes[1].queueOfDirections.push(Snake.DIRECTION.RIGHT)
    if (e.code == "ArrowUp")    snakes[1].queueOfDirections.push(Snake.DIRECTION.DOWN)
    if (e.code == "ArrowLeft")  snakes[1].queueOfDirections.push(Snake.DIRECTION.LEFT)

    if (e.code == "Space") document.location.reload();
}

setInterval(() => {
    score.innerHTML = snakes[0].blocks.length - 2 + " ♦ " + (snakes[0].blocks.length + snakes[1].blocks.length - 4) + " ♦ " + (snakes[1].blocks.length - 2)
}, 50);
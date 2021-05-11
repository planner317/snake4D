// Snake player
const snake1 = new Snake();
snake1.timeOut = 160
snake1.deleteBlock = deleteBlock;
snake1.deleteApple = deleteApple;
snake1.createBlock = createBlock;
snake1.createApple = createApple;
snake1.gameOver = gameOver;

snake1.size = 25
snake1.zona.start = { x: 0, y: 0 };
snake1.zona.width = snake1.zona.height = 25


// Snake bot
Snake2DBot.arrBlocks = Snake.arrBlocks;     // общий массив блоков
const snakeBot = new Snake2DBot();
snakeBot.apple = snake1.apple;              // общее яблоко
snakeBot.timeOut = 80
snakeBot.deleteBlock = deleteBlock;
snakeBot.createBlock = createBlock;
snakeBot.createApple = createApple;
snakeBot.deleteApple = deleteApple;
snakeBot.gameOver = gameOver;

snakeBot.size = snake1.size
snakeBot.zona = snake1.zona

const cnv = document.createElement("canvas");
cnv.width = cnv.height = snake1.size * snake1.zona.width;
cnv.style.position = "absolute"
cnv.style.setProperty('left', (window.innerWidth - cnv.width) / 2 + 'px');
document.body.appendChild(cnv);
const ctx = cnv.getContext("2d");

createPlane(snake1);
snake1.hue = 120
snake1.newApple();
snake1.start({ x: 5, y: 5 });

snakeBot.hue = 240;
snakeBot.start({ x: 20, y: 20 });

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
    for (let i = 0; i < this.blocks.length; i++) {
        ctx.fillStyle = "hsl(" + this.hue + ", 70%, " + Math.floor(((Math.sin(i) + 6) / 10) * 100) + "%)";
        ctx.fillRect(this.blocks[i].x * size, this.blocks[i].y * size, size, size);
    }
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
    snake1.apple = snakeBot.apple = block;
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
    while (this.blocks.length) {
        deleteBlock.bind(this)(this.blocks.pop())
    }
    restart.bind(this)();
    this.run()
}

function restart() {
    const block = [];
    while (block.length < 2) {
        let pos = this.randomPosition()
        if (!this.isСollision(pos)) {
            block.push(pos)
            let pos1 = this.add(block[0], this.direction);
            if (this.isСollision(pos1)) {
                restart.bind(this)();
                return;
            }
            block.push(pos1)
            this.blocks.push(block[1], block[0]);
        }
    }
}
window.onkeydown = handlerKey;

function handlerKey(e) {
    if (e.code == "KeyS") snake1.queueOfDirections.push(Snake.DIRECTION.UP)
    if (e.code == "KeyD") snake1.queueOfDirections.push(Snake.DIRECTION.RIGHT)
    if (e.code == "KeyW") snake1.queueOfDirections.push(Snake.DIRECTION.DOWN)
    if (e.code == "KeyA") snake1.queueOfDirections.push(Snake.DIRECTION.LEFT)

    if (e.code == "Space") document.location.reload();
}

setInterval(() => {
    score.innerHTML = snake1.blocks.length - 2 + " ♦ " + (snake1.blocks.length + snakeBot.blocks.length - 4) + " ♦ " + (snakeBot.blocks.length - 2)
}, snake1.timeOut);
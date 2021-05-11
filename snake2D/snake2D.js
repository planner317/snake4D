class Snake {
    static DIRECTION = {
        LEFT: { x: -1, y: 0, },
        RIGHT: { x: 1, y: 0, },
        DOWN: { x: 0, y: -1, },
        UP: { x: 0, y: 1, },
    }

    zona = {
        start: { x: -5, y: -5 },
        width: 10, height: 10
    }

    size = 40;
    blocks = [];     // свои блоки хвоста
    static arrBlocks = [] // массив из массивов блоков для проверки на столкновения
    apple = { x: 2, y: 2 }
    direction;
    queueOfDirections = [] // массив очередь из направлений
    timeOut = 100;
    idTimeout = 0;

    constructor(){
        Snake.arrBlocks.push(this.blocks)
    }

    createBlock = () => console.log("no function createBlock");
    deleteBlock = () => console.log("no function deleteBlock");
    createApple = () => console.log("no function createApple");
    deleteApple = () => console.log("no function deleteApple");
    gameOver = () => console.log("no function gameOver");

    compare = (a, b) => a.x == b.x && a.y == b.y;
    add = (a, b) => {
        return { x: a.x + b.x, y: a.y + b.y, }
    }
    sub = (a, b) => {
        return { x: a.x - b.x, y: a.y - b.y, }
    }

    start(startPos) {
        this.blocks.push(this.add(startPos, this.zona.start))
        this.direction = Snake.DIRECTION.RIGHT
        this.blocks.unshift(this.add(this.blocks[0], this.direction))
        this.createBlock(this.blocks[0]);
        this.run()
    }

    stop() {
        this.gameOver();
    }

    run() {
        if (this.queueOfDirections.length) this.setDirection(this.queueOfDirections.shift());
        let pos = this.add(this.blocks[0], this.direction);

        if (this.isСollision(pos)) {
            this.gameOver();
            return;
        }
        this.blocks.unshift(pos);
        if (this.compare(pos, this.apple)) {
            this.deleteApple();
            this.newApple();        // если съел яблоко
        }
        else this.deleteBlock(this.blocks.pop());

        this.createBlock(pos);
        this.idTimeout = setTimeout(this.run.bind(this), this.timeOut)
    }

    isСollision(pos) {
        if (pos.x < this.zona.start.x || pos.x >= this.zona.start.x + this.zona.width ||
            pos.y < this.zona.start.y || pos.y >= this.zona.start.y + this.zona.height) return true; // стена на этой позиции

        for (const arr of Snake.arrBlocks) {
            for (const e of arr) {
                if (this.compare(pos, e)) return true; // хвост на этой позиции
            }
        }

        return false;
    }

    // изменение направления от пользователя
    setDirection(direction) {
        let pos = this.add(this.blocks[0], direction);
        if (this.compare(this.blocks[1], pos)) return;
        this.direction = direction
    }

    newApple() {
        let apple = this.randomPosition();

        for (const arr of Snake.arrBlocks) {
            for (const e of arr) {
                if (this.compare(apple, e)) {
                    this.newApple()
                    return;
                }
            }
        }
        this.createApple(apple);
        this.apple.x = apple.x;
        this.apple.y = apple.y;
    }

    randomPosition() {
        return {
            x: Math.floor(Math.random() * this.zona.width + this.zona.start.x),
            y: Math.floor(Math.random() * this.zona.height + this.zona.start.y),
        }
    }
}

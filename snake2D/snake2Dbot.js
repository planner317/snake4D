class Snake2DBot {
    static DIRECTION = {
        LEFT: { x: -1, y: 0, },
        RIGHT: { x: 1, y: 0, },
        DOWN: { x: 0, y: -1, },
        UP: { x: 0, y: 1, },
    }

    zona = {
        start: { x: 0, y: 0 },
        width: 10, height: 10
    }
    size = 40;
    blocks = [];     // свои блоки хвоста
    static arrBlocks = [] // массив из массивов блоков для проверки на столкновения
    apple = { x: 2, y: 2 }
    direction;
    timeOut = 100;
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

    constructor() {
        Snake2DBot.arrBlocks.push(this.blocks);
    }

    start(startPos) {
        this.blocks.push(this.add(startPos, this.zona.start))
        this.changingDirection();
        this.blocks.unshift(this.add(this.blocks[0], this.direction))
        this.createBlock(this.blocks[0]);
        this.run()
    }

    stop() {
        this.gameOver();
    }

    run() {
        this.toGoAplle();

        let pos = this.add(this.blocks[0], this.direction);
        if (this.isСollision(pos)) {
            if (!this.changingDirection()) {
                this.gameOver()
                return;
            }
            pos = this.add(this.blocks[0], this.direction);
        }
        this.blocks.unshift(pos);
        if (this.compare(pos, this.apple)) {
            this.deleteApple();
            this.newApple();        // если съел яблоко
        }
        else this.deleteBlock(this.blocks.pop());

        this.createBlock(pos);
        setTimeout(this.run.bind(this), this.timeOut)
    }

    isСollision(pos) {
        if (pos.x < this.zona.start.x || pos.x >= this.zona.start.x + this.zona.width ||
            pos.y < this.zona.start.y || pos.y >= this.zona.start.y + this.zona.height) return true; // стена на этой позиции

        for (const arr of Snake2DBot.arrBlocks) {
            for (const e of arr) {
                if (this.compare(pos, e)) return true; // хвост на этой позиции
            }
        }

        return false;
    }

    setDirection(direction) {
        let pos = this.add(this.blocks[0], direction);
        if (this.compare(this.blocks[1], pos)) return;
        this.direction = direction
    }

    newApple() {
        let apple = this.randomPosition();

        for (const arr of Snake2DBot.arrBlocks) {
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

    toGoAplle() { // движимся к яблоку
        const vec = this.sub(this.blocks[0], this.apple);

        if (vec.x == 0) this.direction = (vec.y > 0 ? Snake2DBot.DIRECTION.DOWN : Snake2DBot.DIRECTION.UP);
        if (vec.y == 0) this.direction = (vec.x > 0 ? Snake2DBot.DIRECTION.LEFT : Snake2DBot.DIRECTION.RIGHT);
    }

    changingDirection() { // меняю направление движения если спереди препятствие
        let listDirection = [
            {
                axis: "x",
                direction: [Snake2DBot.DIRECTION.LEFT, Snake2DBot.DIRECTION.RIGHT]
            },
            {
                axis: "y",
                direction: [Snake2DBot.DIRECTION.DOWN, Snake2DBot.DIRECTION.UP]
            },
        ]

        let badDirection = []
        const vec = this.sub(this.blocks[0], this.apple);
        // выбираю направление к яблоку
        for (let i = 0; i < listDirection.length; i++) {
            if (vec[listDirection[i].axis] == 0) {
                badDirection.push(listDirection[i].direction[0]);
                badDirection.push(listDirection[i].direction[1]);
                continue;
            }
            const j = vec[listDirection[i].axis] > 0 ? 0 : 1;
            const pos = this.add(this.blocks[0], listDirection[i].direction[j])
            if (!this.isСollision(pos)) {
                this.direction = listDirection[i].direction[j];
                return 1;
            }
            badDirection.push(listDirection[i].direction[j == 0 ? 1 : 0])
        }
        // путь к яблоку закрыт. Перебираю все направление что остались.
        for (const direction of badDirection) {
            const pos = this.add(this.blocks[0], direction);
            if (!this.isСollision(pos)) {
                this.direction = direction;
                return 1;
            }
        }
        return false // выхода нет
    }
}


class Snake3Dbot {
    static DIRECTION = {
        LEFT: { x: -1, y: 0, z: 0 },
        RIGHT: { x: 1, y: 0, z: 0 },
        DOWN: { x: 0, y: -1, z: 0 },
        UP: { x: 0, y: 1, z: 0 },
        FORWARD: { x: 0, y: 0, z: -1 },
        BACK: { x: 0, y: 0, z: 1 },
    }

    zona = {
        start: { x: -5, y: -5, z: -5 },
        width: 10, height: 10, depth: 10
    }
    size = 1;
    blocks = [];     // свои блоки хвоста
    static arrBlocks = [] // массив из массивов блоков для проверки на столкновения
    apple = { x: 2, y: 2, z: 2 }
    direction;
    idTimeout = 0;
    timeout = 1000 / 10;

    constructor() {
        Snake3Dbot.arrBlocks.push(this.blocks);
    }

    createBlock = () => console.log("no function createBlock");
    deleteBlock = () => console.log("no function deleteBlock");
    createApple = () => console.log("no function createApple");
    deleteApple = () => console.log("no function deleteApple");
    gameOver = () => console.log("no function gameOver");

    compare = (a, b) => a.x == b.x && a.y == b.y && a.z == b.z;
    add = (a, b) => {
        return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z, }
    }
    sub = (a, b) => {
        return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z, }
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
                this.stop();
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
        this.idTimeout = setTimeout(this.run.bind(this), this.timeout)
    }

    isСollision(pos) {
        if (pos.x < this.zona.start.x || pos.x >= this.zona.start.x + this.zona.width ||
            pos.y < this.zona.start.y || pos.y >= this.zona.start.y + this.zona.height ||
            pos.z < this.zona.start.z || pos.z >= this.zona.start.z + this.zona.depth) return true; // стена на этой позиции

        for (const arr of Snake3Dbot.arrBlocks) {
            for (const e of arr) {
                if (this.compare(pos, e)) return true; // хвост на этой позиции
            }
        }

        return false;
    }

    newApple() {
        let apple = this.randomPosition();

        for (const arr of Snake3Dbot.arrBlocks) {
            for (const e of arr) {
                if (this.compare(apple, e)) {
                    this.newApple()
                    return;
                }
            }
        }
        this.createApple(apple);
        this.apple.x = apple.x; this.apple.y = apple.y; this.apple.z = apple.z;
    }

    randomPosition() {
        return {
            x: Math.floor(Math.random() * this.zona.width + this.zona.start.x),
            y: Math.floor(Math.random() * this.zona.height + this.zona.start.y),
            z: Math.floor(Math.random() * this.zona.depth + this.zona.start.z),
        }
    }

    toGoAplle() { // движимся к яблоку
        const vec = this.sub(this.blocks[0], this.apple);

        if (vec.x == 0 && vec.y == 0) {
            this.direction = (vec.z > 0 ? Snake3Dbot.DIRECTION.FORWARD : Snake3Dbot.DIRECTION.BACK);
            return;
        }
        if (vec.x == 0 && vec.z == 0) {
            this.direction = (vec.y > 0 ? Snake3Dbot.DIRECTION.DOWN : Snake3Dbot.DIRECTION.UP);
            return;
        }
        if (vec.y == 0 && vec.z == 0) {
            this.direction = (vec.x > 0 ? Snake3Dbot.DIRECTION.LEFT : Snake3Dbot.DIRECTION.RIGHT);
            return;
        }

        if (vec.x == 0) {
            if (this.blocks.length % 2) this.direction = (vec.y > 0 ? Snake3Dbot.DIRECTION.DOWN : Snake3Dbot.DIRECTION.UP);
            else this.direction = (vec.z > 0 ? Snake3Dbot.DIRECTION.FORWARD : Snake3Dbot.DIRECTION.BACK);
        }
        if (vec.y == 0) {
            if (this.blocks.length % 2) this.direction = (vec.x > 0 ? Snake3Dbot.DIRECTION.LEFT : Snake3Dbot.DIRECTION.RIGHT);
            else this.direction = (vec.z > 0 ? Snake3Dbot.DIRECTION.FORWARD : Snake3Dbot.DIRECTION.BACK);
        }
        if (vec.z == 0) {
            if (this.blocks.length % 2) this.direction = (vec.x > 0 ? Snake3Dbot.DIRECTION.LEFT : Snake3Dbot.DIRECTION.RIGHT);
            else this.direction = (vec.y > 0 ? Snake3Dbot.DIRECTION.DOWN : Snake3Dbot.DIRECTION.UP);
        }
    }

    changingDirection() { // меняю направление движения если спереди препятствие
        let listDirection = [
            {
                axis: "x",
                direction: [Snake3Dbot.DIRECTION.LEFT, Snake3Dbot.DIRECTION.RIGHT]
            },
            {
                axis: "y",
                direction: [Snake3Dbot.DIRECTION.DOWN, Snake3Dbot.DIRECTION.UP]
            },
            {
                axis: "z",
                direction: [Snake3Dbot.DIRECTION.FORWARD, Snake3Dbot.DIRECTION.BACK]
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


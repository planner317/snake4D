class Snake4Dbot {
    static DIRECTION = {
        LEFT: { x: -1, y: 0, z: 0, w: 0 },
        RIGHT: { x: 1, y: 0, z: 0, w: 0 },
        DOWN: { x: 0, y: -1, z: 0, w: 0 },
        UP: { x: 0, y: 1, z: 0, w: 0 },
        FORWARD: { x: 0, y: 0, z: -1, w: 0 },
        BACK: { x: 0, y: 0, z: 1, w: 0 },
        IN: { x: 0, y: 0, z: 0, w: -1 },
        OUT: { x: 0, y: 0, z: 0, w: 1 },
    }

    zona = { // ширина высота длина глубина(4D)
        x: 10, y: 10, z: 10, w: 3
    }
    blocks = [];     // свои блоки хвоста
    static arrBlocks = [] // массив из массивов блоков для проверки на столкновения
    apple = { x: 1, y: 1, z: 1, w: 0 }
    direction;
    idTimeout = 0;
    timeout = 1000 / 10;

    constructor() {
        Snake4Dbot.arrBlocks.push(this.blocks);
    }

    createBlock = () => console.log("no function createBlock");
    deleteBlock = () => console.log("no function deleteBlock");
    createApple = () => console.log("no function createApple");
    deleteApple = () => console.log("no function deleteApple");
    gameOver = () => console.log("no function gameOver");

    compare = (a, b) => a.x == b.x && a.y == b.y && a.z == b.z && a.w == b.w;
    add = (a, b) => {
        return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z, w: a.w + b.w, }
    }
    sub = (a, b) => {
        return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z, w: a.w - b.w, }
    }

    start(startPos) {
        this.blocks.push(startPos)
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
        if (pos.x < 0 || pos.x >= this.zona.x ||
            pos.y < 0 || pos.y >= this.zona.y ||
            pos.z < 0 || pos.z >= this.zona.z ||
            pos.w < 0 || pos.w >= this.zona.w
        ) return true; // стена на этой позиции

        for (const arr of Snake4Dbot.arrBlocks) {
            for (const e of arr) {
                if (this.compare(pos, e)) return true; // хвост на этой позиции
            }
        }

        return false;
    }

    newApple() {
        let apple = this.randomPosition();

        for (const arr of Snake4Dbot.arrBlocks) {
            for (const e of arr) {
                if (this.compare(apple, e)) {
                    this.newApple()
                    return;
                }
            }
        }
        this.createApple(apple);
        this.apple.x = apple.x; this.apple.y = apple.y; this.apple.z = apple.z; this.apple.w = apple.w;
    }

    randomPosition() {
        return {
            x: Math.floor(Math.random() * this.zona.x),
            y: Math.floor(Math.random() * this.zona.y),
            z: Math.floor(Math.random() * this.zona.z),
            w: Math.floor(Math.random() * this.zona.w),
        }
    }

    toGoAplle() { // движимся к яблоку
        const vec = this.sub(this.blocks[0], this.apple);
        if (vec.x == 0 && vec.y == 0 && vec.w == 0) {
            this.selectDir("z"); return;
        }
        if (vec.x == 0 && vec.z == 0 && vec.w == 0) {
            this.selectDir("y"); return;
        }
        if (vec.y == 0 && vec.z == 0 && vec.w == 0) {
            this.selectDir("x"); return;
        }
        if (vec.x == 0 && vec.y == 0 && vec.z == 0) {
            this.selectDir("w"); return;
        }


        if (vec.x == 0 && vec.y == 0) {
            this.blocks.length % 2 ? this.selectDir("z") : this.selectDir("w");
            return;
        }
        if (vec.x == 0 && vec.z == 0) {
            this.blocks.length % 2 ? this.selectDir("y") : this.selectDir("w");
            return;
        }
        if (vec.x == 0 && vec.w == 0) {
            this.blocks.length % 2 ? this.selectDir("z") : this.selectDir("y");
            return;
        }
        if (vec.y == 0 && vec.z == 0) {
            this.blocks.length % 2 ? this.selectDir("x") : this.selectDir("w");
            return;
        }
        if (vec.y == 0 && vec.w == 0) {
            this.blocks.length % 2 ? this.selectDir("x") : this.selectDir("z");
            return;
        }
        if (vec.z == 0 && vec.w == 0) {
            this.blocks.length % 2 ? this.selectDir("x") : this.selectDir("y");
            return;
        }


        if (vec.x == 0) {
            if (this.blocks.length % 3 == 1) this.selectDir("y");
            else if (this.blocks.length % 3 == 2) this.selectDir("z");
            else this.selectDir("w");
        }
        if (vec.y == 0) {
            if (this.blocks.length % 3 == 1) this.selectDir("x");
            else if (this.blocks.length % 3 == 2) this.selectDir("z");
            else this.selectDir("w");
        }
        if (vec.z == 0) {
            if (this.blocks.length % 3 == 1) this.selectDir("x");
            else if (this.blocks.length % 3 == 2) this.selectDir("y");
            else this.selectDir("w");
        }
        if (vec.w == 0) {
            if (this.blocks.length % 3 == 1) this.selectDir("x");
            else if (this.blocks.length % 3 == 2) this.selectDir("y");
            else this.selectDir("z");
        }

    }

    selectDir(axis) {    // выбор направления к яблоку по определенной оси
        if (axis == "x") this.direction = (this.blocks[0].x > this.apple.x ? Snake4Dbot.DIRECTION.LEFT : Snake4Dbot.DIRECTION.RIGHT);
        if (axis == "y") this.direction = (this.blocks[0].y > this.apple.y ? Snake4Dbot.DIRECTION.DOWN : Snake4Dbot.DIRECTION.UP);
        if (axis == "z") this.direction = (this.blocks[0].z > this.apple.z ? Snake4Dbot.DIRECTION.FORWARD : Snake4Dbot.DIRECTION.BACK);
        if (axis == "w") this.direction = (this.blocks[0].w > this.apple.w ? Snake4Dbot.DIRECTION.IN : Snake4Dbot.DIRECTION.OUT);
    }

    changingDirection() { // меняю направление движения если спереди препятствие
        let listDirection = [
            {
                axis: "x",
                direction: [Snake4Dbot.DIRECTION.LEFT, Snake4Dbot.DIRECTION.RIGHT]
            },
            {
                axis: "y",
                direction: [Snake4Dbot.DIRECTION.DOWN, Snake4Dbot.DIRECTION.UP]
            },
            {
                axis: "z",
                direction: [Snake4Dbot.DIRECTION.FORWARD, Snake4Dbot.DIRECTION.BACK]
            },
            {
                axis: "w",
                direction: [Snake4Dbot.DIRECTION.IN, Snake4Dbot.DIRECTION.OUT]
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


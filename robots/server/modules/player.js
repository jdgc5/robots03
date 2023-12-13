const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

class Player {
    constructor(name,tile,level) {
        this._level = level
        this._name = name;
        this._tile = tile;
        this._looking = Math.floor(Math.random()*4);
    }

    rotate() {
        this._looking = (this.looking+1)%4;
        return this.looking;
    }

    get tile() {
        return this._tile;
    }

    get name() {
        return this._name;
    }

    get looking() {
        return this._looking;
    }

    set looking(looking) {
        this._looking = looking;
    }

    static get UP() {
        return UP;
    }

    static get DOWN() {
        return DOWN;
    }

    static get LEFT() {
        return LEFT;
    }

    static get RIGHT() {
        return RIGHT;
    }
}

export { Player };
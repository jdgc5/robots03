import { Player } from "./player.js";

const ADMIN_PLAYER = 0;
const PLAYER = 1;

class Board {
    constructor() {
        this.map = this.build();
        this.players = new Map();
        this.startPoints = new Set([
            this.map.filter ((item) => item.left == null),
            this.map.filter ((item) => item.right == null),
            this.map.filter ((item) => item.top == null),
            this.map.filter ((item) => item.bottom == null)].flat());
    }

    newPlayer(ws) {
        let list = [...this.startPoints];
        let start = list[Math.floor(Math.random()*list.length)];
        this.startPoints.delete(list[Math.floor(Math.random()*list.length)]);
        start.player = new Player("noname",start);
        this.players.set(ws,{player: start.player, type: PLAYER});
        return start.player;
    }

    getPlayerList(){
        return [...this.players.values()].map((item)=>{
            return {
                "col": item.player.tile.col, 
                "row": item.player.tile.row,
                "looking": item.player.looking,
                "id": item.player.name
            }
        })
    }


    build() {
        let board = new Array(400).fill(0).map((item, index) => {
                return { id: index,player: null,left: null,right: null,top: null,bottom : null, row:Math.floor(index / 20), col:index % 20
                }
        })
        board.forEach((element,id,list) => {
            let search = (y,x,a) => {
                return a.find(item => ((item.row === y) && (item.col === x))) || null
            }
            element.right = search(element.row,element.col+1,list);
            element.left = search(element.row,element.col-1,list);
            element.top = search(element.row-1,element.col,list);
            element.bottom = search(element.row+1,element.col,list);
            
        });
        return board;
    }
}

export { Board }
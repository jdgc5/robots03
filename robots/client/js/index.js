import { Cliente} from "./cliente.js"


let canvas = {
    createMapElement:  (type,row,col) => {
        let objectHTML = document.getElementById("tablero");
        if (type === 0) {
            let tile = document.createElement("div");
            tile.setAttribute("id","tile-"+row+"-"+col);
            tile.setAttribute("class","tile");
            objectHTML.appendChild(tile);
        } else {
            let tile = document.createElement("div");
            tile.setAttribute("class","clear");
            objectHTML.appendChild(tile);
        }
    },
    notify: (data)=> {
        document.getElementById("notificaciones").innerHTML=data;
    },
    drawPlayer: (col, row, looking, id) => {
        let player = document.getElementById(id);
        console.log(player);
        player.style.top = (row * 40) + "px";
        player.style.left = (col * 40) + "px";
        player.innerHTML = "X";
    },
    newPlayer: (id) => {
        let objectHTML = document.getElementById("tablero");
        let player = document.createElement("div");
        player.setAttribute('class', 'player');
        player.setAttribute('id', id);
        objectHTML.appendChild(player);
    }
}
canvas.newPlayer('noname');
let client = new Cliente("127.0.0.1","8080",canvas);
document.getElementById("nombre").onclick = function() {
        client.setName("Nombre de prueba");
}

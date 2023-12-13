import { WebSocketServer } from 'ws';
import { Board } from "./board.js";

const ADMIN_PLAYER = 1;
const USER_PLAYER = 0;


class Server {
    constructor() {
        this.operations = {
            list: [
                {
                    op: 0,
                    type: "send",
                    command: "LIST_OPERATIONS",
                    level: 0,
                    remote_action: false,
                    action: this.listOperationToClient
                },
                {
                    op: 1,
                    type: "send",
                    command: "NOTIFY",
                    level: 0,
                    remote_action: true,
                    action: null
                },
                {
                    op: 2,
                    type: "send",
                    command: "BOARD_SIZE",
                    level: 0,
                    remote_action: true,
                    action: null
                },
                {
                    op: 50,
                    type: "receive",
                    command: "SETNAME",
                    level: 0,
                    remote_action: null,
                    action: this.setName
                },
                {
                    op: 51,
                    type: "send",
                    command: "PLAYER_LIST",
                    level: 0,
                    remote_action: true,
                    action: this.playerList
                }

            ]
        };

        this.server = new WebSocketServer({ port: 8080 });
        this.board = new Board();

        this.server.on("connection",(ws)=> {
                this.board.newPlayer(ws, ws);
                ws.on("message",(data)=> {
                    this.do(data);
                });
                this.send("LIST_OPERATIONS",null ,ws);
                this.send("BOARD_SIZE",{row: 20,col:20},ws);
                this.send("NOTIFY","Esperando jugadores...",ws);
                this.send("PLAYER_LIST", null, ws);
        });
    }

    do(data) {
        try {
            let message = JSON.parse(data);
            if (!message.hasOwnProperty("type")) return;
            let operation = this.operations.list.find((item) => item.op == message.type);
            if (operation != undefined) operation.action(message.content);
        } catch(e) {
            console.log(e);
        } 
    }

    send(command,content,ws) {

        let operation = this.operations.list.filter((item) => ((item.command == command) && (item.type==="send")));
        if (operation != undefined) {
            operation = operation[0];
            let message = {
                op: operation.op,
                content: null
            }
            if (operation.action === null) message.content = content;
                else message.content = ((content) => { return operation.action(content,this) })();
            
            if (ws === undefined) {
                this.server.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(message));
                    }
                });
            } else ws.send(JSON.stringify(message));
        }
    }

    listOperationToClient(content,that) {
        return that.operations.list.filter((item)=> (item.level===USER_PLAYER) ).map((item) => {
            return {
                "op" : item.op,
                "command": item.command,
                "action" : item.remote_action
            }
        })
    }

    setName(name) {
        console.log("Cambio el nombre del jugador" + name);
    }

    playerList (content,that){
        return that.board.getPlayerList();
    }
}

export { Server }
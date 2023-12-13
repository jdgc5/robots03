const OPERATION = 0;

class Cliente {
    constructor(host,port,canvas) {
        this.operations = new Map();
        this.client = new WebSocket("ws://"+ host + ":" + port);
        this.canvas = canvas;
        this.listOperationArray = null;
        this.search = null;


        this.client.onmessage = (message) => {
            try {
                let data = JSON.parse(message.data);
                console.log(data);
                let operation = this.operations.get(data.op);
                if (operation != undefined) {
                    operation.execute(data.content);
                } else {
                    if (data.op === OPERATION) {
                        this.list_operations(data.content);
                    }
                }
                     
                
            } catch(e) {
                console.log(e)
            } 
        }
    }

    send(type, content) {
        let message = {
            "type" : type,
            "content": content
        }
        console.log(message);
        this.client.send(JSON.stringify(message));
    }

    list_operations(content) {
        content.forEach(element => {
            Reflect.set(element, 'execute', null);
            this.operations.set(element.op,element);  
        });
        this.listOperationArray = [...this.operations].flat().filter((item) => (typeof(item) === "object"));
        this.search = (item) => { return this.listOperationArray.find( (element) => element.command === item) }

        
        this.search("BOARD_SIZE").execute = (data) => {
            for (let i=0; i<data.row;i++) {
                for (let j=0;j<data.col; j++) {
                    this.canvas.createMapElement(0,i,j);
                }
                this.canvas.createMapElement(1);
                
            }
        };

        this.search("NOTIFY").execute = (data) => {
            this.canvas.notify(data);
        };

        this.search("PLAYER_LIST").execute = (data) => {
            data.forEach((item) => {
                this.canvas.drawPlayer(item.col, item.row, item.looking, item.id);
            })
        }
    }

    setName(name) {
        console.log(this.search("SETNAME"));
        this.send(this.search("SETNAME").op,name);
        this.canvas.newPlayer(name);
    }
}

export { Cliente }
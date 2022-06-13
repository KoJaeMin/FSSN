import * as net from 'net';
import * as dotenv from 'dotenv';
import * as readline from 'readline';
import * as timers from 'timers';

dotenv.config();

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

class ChattingServer{
    /// private field
    #host=HOST;
    #port=PORT;
    #sockets=[];
    #startTime = process.uptime();

    constructor(host,port){
        this.#host = host;
        this.#port = port;
    }

    Runnig(){
        const server = net.createServer((Socket)=>{
            //socket의 decault로 encoding을 utf8로 시킴
            Socket.setDefaultEncoding('utf8');
        });

        server.on("listening",()=>{
            let IsEmpty = this.#sockets.length===0;
            timers.setInterval(()=>{
                IsEmpty = this.#sockets.length===0;
                if(IsEmpty)
                    console.log(`Waiting someone... ${process.uptime()-this.#startTime}`);
                else
                    this.#startTime = process.uptime();
            },5000);

            rl.on("line",(msg)=>{
                if(IsEmpty){
                    switch(msg){
                        case 'exit':
                        case 'quit':
                        case 'end':
                            console.log("Server is over...");
                            process.exit(0);
                    }
                }
            })
        });

        server.on("connection",(Socket)=>{
            this.#sockets.push(Socket);
            console.log(`> client connected`);
            console.log(`remote = ${Socket.remoteAddress}: ${Socket.remotePort}`);//접속 정보

            for(let i in this.#sockets)
                if(i<this.#sockets.length-1)
                    this.#sockets[i].write(`Socket#${this.#sockets.findIndex((index)=> index===Socket)} is comming\n\r`);
            Socket.write(`Welcome to tcp chatting your number is ${this.#sockets.findIndex((index)=> index===Socket)}\r\n`);
            
            rl.on("line",(msg)=>{
                if(msg==='close'){
                    rl.question("\n\n-----This is not good idea!!-----\n Are you sure? [No]/yes : ",(data)=>{
                        if(data==='yes'){
                            for(let i of this.#sockets)
                                i.write("-----Server is Down-----\n\n")
                            process.exit(1);
                        }
                    })
                }
                else if(msg==='exit'||msg==='quit'||msg==='end'){
                    for(let i of this.#sockets)
                        i.end();
                    console.log("Closing Server...");
                    process.exit(0);
                }
                else
                    Socket.write(`Server> ${msg}`);
            })
            Socket.on("data",(msg)=>{
                let message = msg.toString()
                let socketno = this.#sockets.findIndex((index)=> index===Socket);
                console.log(`Socket#${socketno}> `,message);
                for(let i in this.#sockets)
                    this.#sockets[i].write(`Socket#${socketno}> ${message}`);
            })
            Socket.on("end",()=>{
                const ExitSocket = this.#sockets.findIndex((index)=> index===Socket);
                if (ExitSocket > -1)
                    this.#sockets.splice(ExitSocket, 1);
                console.log(`Socket#${ExitSocket} is exit.\nRemain #${this.#sockets.length} of Socket`);
                for(let i in this.#sockets)
                    this.#sockets[i].write(`Now your number is ${i}`);
            })
        });
        server.on('error', (err) => {
            console.log(err.stack);
            throw err;
        });
    
        server.listen(PORT, () => {
            console.log('> server bound on ',server.address());            
        });
    };
};

let server = new ChattingServer;
server.Runnig()
import net from 'net';
import dotenv from 'dotenv';
import readline from 'readline';

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

        // server.on("listening",()=>{
        //     if(this.#sockets.length===0){
        //         ///client가 없었던 시간을 알려줌
        //         setTimeout(console.log,1000,`Waiting someone... ${process.uptime()-this.#startTime}`);
        //     }
        // });

        server.on("connection",(Socket)=>{
            this.#sockets.push(Socket);
            console.log(`> client connected`);

            console.log(`   local = ${Socket.localAddress}: ${Socket.localPort}`);//
            console.log(`   remote = ${Socket.remoteAddress}: ${Socket.remotePort}`);//접속 정보

            for(var i in this.#sockets)
                if(i<this.#sockets.length-1)
                    this.#sockets[i].write(`Socket#${this.#sockets.findIndex((index)=> index===Socket)} is comming\n\r`);
            Socket.write(`Welcome to tcp chatting your number is ${this.#sockets.findIndex((index)=> index===Socket)}\r\n`);
            
            rl.on("line",(msg)=>{
                if(msg==='close'){
                    console.log("\n\n-----This is not good idea!!-----\n Are you sure? [No]/yes : ")
                    if(msg ==='yes') process.exit(1);
                }
                else if(msg==='exit'||msg==='quit'||msg==='end'){
                    Socket.end();
                    console.log("Closing Server...");
                }
                Socket.write(msg);
            })
            Socket.on("data",(msg)=>{
                var message = msg.toString()
                var socketno = this.#sockets.findIndex((index)=> index===Socket);
                console.log(`Socket#${socketno}> `,message);
                for(var i in this.#sockets) this.#sockets[i].write(`Socket#${socketno}> ${message}`);
            })
            Socket.on("end",()=>{
                const ExitSocket = this.#sockets.findIndex((index)=> index===Socket);
                if (ExitSocket > -1) this.#sockets.splice(ExitSocket, 1);
                console.log(`Socket#${ExitSocket} is exit.\nRemain #${this.#sockets.length} of Socket`);
                for(var i in this.#sockets) this.#sockets[i].write(`Now your number is ${i}`);
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

var server = new ChattingServer;
server.Runnig()
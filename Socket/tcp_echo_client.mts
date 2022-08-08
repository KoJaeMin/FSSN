import * as net from 'net';
import * as readline from 'readline';
import * as dotenv from 'dotenv';
import * as os from 'os';
import * as util from 'util';

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const question = util.promisify(rl.question).bind(rl);;

type HOST = string;
type PORT = number;
type ANNOUNCEMENT = string;
type SettingTime = number;

const CONNECTION :ANNOUNCEMENT = `Connect to Server!`;


interface SocketAddress {
    port : PORT,
    host : HOST
}

class client{
    constructor(
        private address : SocketAddress = {port:Number(process.env.PORT),host:String(process.env.HOST)},
        private timeout : SettingTime = 3000
    ){}

    private GetPublicIP(){
        const inter = os.networkInterfaces();
        for (let devName in inter) {
            const iface = inter[devName];
            if(iface === undefined)
                return " - "
            const len = iface.length;
            for(let i = 0; i<len; i++){
                const temp = iface[i];
                if(temp.family === 'IPv4' && temp.address !== '127.0.0.1')
                    return temp.address;
            }
        }
    }

    private ConnectionInfo(){
        console.clear();
        console.log('-'.repeat(10)+`Connection Info`+'-'.repeat(10));
        console.log(`Local HOST : ${this.GetPublicIP()}`);
        console.log(`Remote HOST : ${this.address.host}`);
        console.log(`Remote PORT : ${this.address.port}`);
    }

    private Drain(socket : net.Socket, msg : string) : void {
        socket.once("drain",()=>{
            this.SendMSG(socket,msg)
        })
    }

    private SendMSG(socket : net.Socket, msg : string){
        if(msg==='exit'||msg==='quit'||msg==='end'){
            console.log("Exit Chatting Room");
            socket.end();
        }else{
            const WriteSuc : boolean = socket.write(msg);
            if(!WriteSuc){
                this.Drain(socket, msg)
            }
        }
    }

    public Runnig() {
        const mysocket = net.createConnection(this.address);
        mysocket.setTimeout(this.timeout);
        mysocket.setDefaultEncoding('utf8');
        mysocket.on("connect",()=>{
            this.ConnectionInfo();
            rl.on("line",(msg)=>{
                this.SendMSG(mysocket,msg);
            })
        });
        mysocket.on("data", (data) => {
            console.log(data.toString());
        });
        
        mysocket.on("end",({haderror})=>{
            if(haderror===true) throw "Error";
            mysocket.end()
        })
        
        //socket이 완전히 닫혔을때
        mysocket.on("close",(haderror)=>{
            if(haderror===true) throw "Error";
            console.log("> End")
            process.exit(0);
        })
    }
}
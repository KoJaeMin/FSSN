import net from 'net';
import readline from 'readline';
import dotenv from 'dotenv';

dotenv.config();

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const client = net.createConnection({port:PORT,host:HOST});
client.setDefaultEncoding('utf8');
    
client.on("connect",()=>{
    console.log("Connect to Server!\n");
    
    rl.on("line",(msg)=>{
        if(msg==='exit'||msg==='quit'||msg==='end'){
            console.log("Exit Chatting Room")
            client.end()
        }else
            client.write(msg);
    })
});
client.on("data", (data) => {
    console.log(data.toString());
});

client.on("end",(haderror)=>{
    if(haderror===true) throw "Error";
    client.end()
})

//socket이 완전히 닫혔을때
client.on("close",(haderror)=>{
    if(haderror===true) throw "Error";
    console.log("> End")
    process.exit(0);
})
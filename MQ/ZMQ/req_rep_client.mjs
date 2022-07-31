// Hello World server
// Binds REP socket to tcp://*:5555
// Expects "Hello" from client, replies with "world"
// Reference : https://zeromq.org/languages/nodejs/

import * as zmq from 'zeromq';
import * as dotenv from 'dotenv';
import * as readline from 'readline';
import * as os from 'os';

dotenv.config();

const HOST = process.env.HOST;
const PORT = process.env.PORT;

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });


function get_public_id(){
	const inter = os.networkInterfaces();
	for (let devName in inter) {
		const iface = inter[devName];
		const len = iface.length;
		for(let i = 0; i<len; i++){
			const temp = iface[i];
			if(temp.family === 'IPv4' && temp.address !== '127.0.0.1')
				return temp.address;
		}
	}
}

function get_mac(){
	const inter = os.networkInterfaces();
	for (let devName in inter) {
		const iface = inter[devName];
		const len = iface.length;
		for(let i = 0; i<len; i++){
			const temp = iface[i];
			if(temp.family === 'IPv4' && temp.address !== '127.0.0.1')
				return temp.mac;
		}
	}
}

// class client{
// 	#identity = process.pid.toString();
// 	#remote_host=HOST;
//     #remote_port=PORT;
	
// 	constructor(){
// 		this.#identity = '';
// 	}

// 	running(){}
// }

// socket to talk to server
console.log("Connecting to hello world server...");
let requester = zmq.socket('req');

let x = 0;
requester.on("message", function(reply) {
  console.log("Received reply", x, ": [", reply.toString(), ']');
  x += 1;
  if (x === 10) {
    requester.close();
    process.exit(0);
  }
});

requester.connect(`tcp://${HOST}:${PORT}`);
const ip = get_public_id();
const mac = get_mac();
requester.identity = 'client [' + ip +" - "+mac + "] " +process.pid;

for (var i = 0; i < 10; i++) {
  console.log("Sending request", i, '...');
  const message = "Hello";
  requester.send(requester.identity+"["+i+"] : "+message);
}

process.on('SIGINT', function() {
  requester.close();
});
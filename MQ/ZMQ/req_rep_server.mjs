// Hello World server
// Binds REP socket to tcp://*:5555
// Expects "Hello" from client, replies with "world"
// Reference : https://zeromq.org/languages/nodejs/

import * as zmq from 'zeromq';
import * as dotenv from 'dotenv';
import * as readline from 'readline';

dotenv.config();

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


// // socket to talk to clients
var responder = zmq.socket('rep');

responder.on('message', function(request) {
    const msg = request.toString();
    // const pid = request.pid.toString();
    // if(msg!=='Hello')
    console.log("Received request: [",msg, "]");
    // console.log(pid)

    // do some 'work'
    setTimeout(function() {
    // send reply back to client.
        responder.send("World");
    }, 1000);
});

responder.bind(`tcp://${HOST}:${PORT}`, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`Listening on ${PORT}...`);
        rl.on("line",(input)=>{
            if(input==='exit'){
                responder.close();
                process.exit(1);
            }
        })
    }
});


process.on('SIGINT', function() {
  responder.close();
});
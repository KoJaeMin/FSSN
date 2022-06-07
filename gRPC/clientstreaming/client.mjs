import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = '../protos/clientstreaming.proto';
const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
  }
);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const routes = protoDescriptor.clientstreaming;
let client = new routes.ClientStreaming('localhost:50051', grpc.credentials.createInsecure());

function make_message(msg){
    return {message:msg}
}
    
function* generate_messages(){
    let messages = [
        make_message("message #1"),
        make_message("message #2"),
        make_message("message #3"),
        make_message("message #4"),
        make_message("message #5"),
    ]
    for(let msg of messages){
        console.log(`[client to server] ${msg.message}`);
        yield msg;
    }
}

function send_message(){
    let call = client.GetServerResponse((err,socket)=>{
        console.log(`[server to client] ${socket.value}`)
    });
    let iterator = generate_messages();
    for(let i of iterator){
        call.write(i);
    }
    call.end();
}

function main() {
    send_message();
}

main();
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = '../protos/serverstreaming.proto';
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
const routes = protoDescriptor.serverstreaming;

function make_message(msg){
    return {message:msg}
}
    
function GetServerResponse(call){
    let messages = [
        make_message("message #1"),
        make_message("message #2"),
        make_message("message #3"),
        make_message("message #4"),
        make_message("message #5"),
    ]
    console.log(`Server processing gRPC server-streaming ${call.request.value}.`)
    for(let msg of messages){
        call.write(msg)
    }
    call.end();
}
function main(){
    let server = new grpc.Server();
    server.addService(routes.ServerStreaming.service, {
      GetServerResponse:GetServerResponse
    });
    server.bindAsync('localhost:50051', grpc.ServerCredentials.createInsecure(), () => {
      server.start();
    });
}
    
main()
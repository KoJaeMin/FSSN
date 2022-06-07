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

function GetServerResponse(call, callback){
    console.log('Server processing gRPC client-streaming.')
    let count = 0;
    call.on("data",function(req){
        count++;
    })
    call.on('end',function(){
        callback(null,{value:count});
    });
  }
    
  
  function main(){
    let server = new grpc.Server();
    server.addService(routes.ClientStreaming.service, {
      GetServerResponse:GetServerResponse
    });
    server.bindAsync('localhost:50051', grpc.ServerCredentials.createInsecure(), () => {
      server.start();
    });
  }
    
  main()
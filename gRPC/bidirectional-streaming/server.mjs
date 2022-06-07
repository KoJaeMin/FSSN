import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = '../protos/bidirectional.proto'
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
const routes = protoDescriptor.bidirectional;

function GetServerResponse(call){
  console.log('Server processing gRPC bidirectional streaming.')
  call.on("data",function(req){
    call.write(req)
  })
  call.on('end',function(){
    call.end();
  });
}
  

function main(){
  let server = new grpc.Server();
  server.addService(routes.Bidirectional.service, {
    GetServerResponse:GetServerResponse
  });
  server.bindAsync('localhost:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    // server.tryShutdown();
  });
}
  
main()
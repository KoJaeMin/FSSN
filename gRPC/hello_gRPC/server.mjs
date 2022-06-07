import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as hello_grpc from './hello_grpc.mjs';

const PROTO_PATH = '../protos/hello_grpc.proto'
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
const routes = protoDescriptor.hello_grpc;

function MyFunction(call, callback){
  const response = call.request.value;
  callback(null,{value:hello_grpc.my_func(response)});
}
  
function main(){
  let server = new grpc.Server();
  server.addService(routes.MyService.service, {
    MyFunction:MyFunction
  });
  server.bindAsync('localhost:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
  
}
  
main()
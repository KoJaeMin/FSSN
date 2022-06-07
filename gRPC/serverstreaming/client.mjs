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
let client = new routes.ServerStreaming('localhost:50051', grpc.credentials.createInsecure());

const call = client.GetServerResponse({value:5});
call.on('data',(response)=>{
    console.log(`[server to client] ${response.message}`);
})

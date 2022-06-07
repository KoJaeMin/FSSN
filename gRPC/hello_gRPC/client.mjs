import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = '../protos/hello_grpc.proto';
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

function main() {
    let client = new routes.MyService('localhost:50051', grpc.credentials.createInsecure());
    client.MyFunction({value: 4}, function(err, response) {
      console.log('gRPC result:', response.value);
    });
}

main()
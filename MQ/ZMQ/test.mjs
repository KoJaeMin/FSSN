// function bufferLength(buffer) {
//     var lenStr = "" + buffer.length;
//     while (lenStr.length < 3) {
//       lenStr = "0" + lenStr;
//     }
  
//     return lenStr;
//   }
  
//   // Return the buffer's contents as printable text if every
//   // character is printable, or as hexadecimal otherwise
//   function formatBuffer(buffer) {
//     for (var i = 0; i < buffer.length; i++) {
//       if (buffer[i] < 32 || buffer[i] > 127) {
//         return buffer.toString("hex")
//       }
//     }
  
//     return buffer.toString("utf8");
//   }

// var zmq = require('zeromq');
// var dotenv = require('dotenv').config();

// const HOST = process.env.HOST;
// const PORT = process.env.PORT;

// var sink = zmq.socket("router");
// sink.bind(`tcp://${HOST}:${PORT}`);

// sink.on("message", ()=>{
//     let frames;
//     if (arguments.length == 1) {
//       const arg = arguments[0];
//       if (Array.isArray(arg)) {
//         // Single argument is an array of frames (buffers)
//         frames = arg;
//       } else {
//         // Single argument is a single frame (buffer)
//         frames = [arg];
//       }
//     } else {
//       // Multiple arguments; each is a frame (buffer)
//       frames = Array.prototype.slice.call(arguments);
//     }

//     console.log("----------------------------------------");
//     frames.forEach(function(frame) {
//       console.log("[%s] %s", bufferLength(frame), formatBuffer(frame));
//     });
// });

// //  First allow 0MQ to set the identity
// var anonymous = zmq.socket("req");
// anonymous.connect(`tcp://${HOST}:${PORT}`);
// anonymous.send("ROUTER uses generated 5 byte identity");

// //  Then set the identity ourselves
// var identified = zmq.socket("req");
// identified.identity = "PEER2";
// identified.connect(`tcp://${HOST}:${PORT}`);
// identified.send("ROUTER uses REQ's socket identity");

// setTimeout(function() {
// anonymous.close();
// identified.close();
// sink.close();
// }, 250);
let lst = [12,321,32121,121,2];
for(let i of lst){
  console.log(typeof(i))
}
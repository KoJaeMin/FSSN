// import * as timers from 'timers';
import * as zmq from 'zeromq';
import * as config from './config.mjs'

console.log("Publishing updates at weather server... ");

let publisher = zmq.socket('pub');

publisher.bindSync(`tcp://${config.HOST}:${config.PORT}`);
// publisher.bindSync("ipc://weather.ipc");

function zeropad(num) {
    return num.toString().padStart(3, "0");
};
  
function rand(upper, extra) {
    var num = Math.abs(Math.round(Math.random() * upper));
    return num + (extra || 0);
};


const startTime = process.uptime();

config.timers.setInterval(()=>{
    let zipcode     = rand(150)
      , temperature = rand(215, -80)
      , relhumidity = rand(50, 10)
      , update      = `${zeropad(zipcode)} ${temperature} ${relhumidity}`;
    if(zeropad(zipcode)==='100'){
        console.log(`Push ${update}`)
    }
    publisher.send(update);
},10);

process.on('SIGINT', () => {
    publisher.close();
    process.exit(0);
});
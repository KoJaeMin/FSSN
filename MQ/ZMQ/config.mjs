import * as dotenv from 'dotenv';
import * as readline from 'readline';
import * as timers from 'timers';

dotenv.config();

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export {HOST,PORT,rl,timers};
const Koa = require('koa');
const app = new Koa();
const cors = require('@koa/cors');
const { socketFn } = require('./socket');
app.use(cors({
  origin: '*',
}));

const server = require('http').createServer(app.callback());


const io = require('socket.io')(server); 
io.on('connection', socketFn(io));

const port = process.env.PORT || 3001;
console.log(port);
server.listen(port, () => console.log(`webrtc-token-server listening on port ${port}`))

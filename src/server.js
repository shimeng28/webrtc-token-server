const Koa = require('koa');
const app = new Koa();
const cors = require('@koa/cors');

app.use(cors({
  origin: '*',
}));

const server = require('http').createServer(app.callback());


const io = require('socket.io')(server); 
io.on('connection', socket => {
  socket.on('join', room => {
    console.log('join..', room);
    socket.join(room);
    const myRoom = io.sockets.adapter.rooms.get(room);

    const users = myRoom.size;
    // 给自己发消息
    socket.emit('joined', room, socket.id);
    // 给房间的除了自己以外的所有人发消息
    // socket.to(room).emit('joined', room, socket.id);
    // 给房间的所有人回消息
    // io.in(room).emit('joined', room, socket.id);
    // 除自己，整个站点所有人发消息
    // socket.broadcast.emit('joined', room, socket.id);
  });
  socket.on('leave', room => {
    socket.join(room);
    const myRoom = io.sockets.adapter.rooms.get(room);

    const users = myRoom.size;
    // 给自己发消息
    // socket.emit('joined', room, socket.id);
    // 给房间的除了自己以外的所有人发消息
    // socket.to(room).emit('joined', room, socket.id);
    // 给房间的所有人回消息
    // io.in(room).emit('joined', room, socket.id);
    // 除自己，整个站点所有人发消息
    socket.broadcast.emit('joined', room, socket.id);
  });
});

const port = process.env.PORT || 3001;
console.log(port);
server.listen(port, () => console.log(`webrtc-token-server listening on port ${port}`))

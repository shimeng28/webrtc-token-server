const MAX_USER_COUNT = 5;

const socketFn = io => socket => {
  socket.on('join', room => {
    console.log('join..', room);
    socket.join(room);
    const myRoom = io.sockets.adapter.rooms.get(room);

    const users = myRoom.size;

    if (users <= MAX_USER_COUNT) {
      socket.emit('joined', room, socket.id);
      if (users > 1) {
        socket.to(room).emit('otherjoin', room, socket.id);
      }
    } else {
      socket.leave(room);
      socket.emit('full', room, socket.id);
    }

    // 给自己发消息
    // socket.emit('joined', room, socket.id);
    // 给房间的除了自己以外的所有人发消息
    // socket.to(room).emit('joined', room, socket.id);
    // 给房间的所有人回消息
    // io.in(room).emit('joined', room, socket.id);
    // 除自己，整个站点所有人发消息
    // socket.broadcast.emit('joined', room, socket.id);
  });
  socket.on('leave', room => {
    const myRoom = io.sockets.adapter.rooms.get(room);
    myRoom.delete(socket.id);
    socket.to(room).emit('bye', room, socket.id);
    socket.emit('leave', room, socket.id);
    // 给自己发消息
    // socket.emit('joined', room, socket.id);
    // 给房间的除了自己以外的所有人发消息
    // socket.to(room).emit('joined', room, socket.id);
    // 给房间的所有人回消息
    // io.in(room).emit('joined', room, socket.id);
    // 除自己，整个站点所有人发消息
    // socket.broadcast.emit('joined', room, socket.id);
  });
  socket.on('message', (room, data) => {
    socket.to(room).emit('message', room, data);
  });
};

module.exports = {
  socketFn,
};
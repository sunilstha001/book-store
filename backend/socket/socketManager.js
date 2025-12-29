const socketManager = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 New user connected: ${socket.id}`);

    // This is how a user (or admin) can "listen" to a specific order
    socket.on('join_order_room', (orderId) => {
      socket.join(orderId);
      console.log(`User ${socket.id} joined room for order ${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔥 User disconnected: ${socket.id}`);
    });
  });
};

export default socketManager;
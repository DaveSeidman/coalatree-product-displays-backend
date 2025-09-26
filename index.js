import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();


const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;
const io = new Server(server, {
  cors: {
    origin: ['https://daveseidman.github.io'],
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: ['http://localhost:8080', 'https://172.20.10.14:8080', 'https://daveseidman.github.io'],
  methods: ['GET', 'POST'],
}));

app.get('/', (req, res) => {
  res.send('Socket server running.');
});

io.on('connection', (socket) => {
  const { role, product } = socket.handshake.query;
  console.log('connected', socket.id, { role, product });

  if (product) {
    // Put every socket into a room named after its product
    socket.join(product);
    console.log(`➡️ ${socket.id} joined room: ${product}`);
  }

  if (role === 'pedestal') {
    socket.on('rotation', (data) => {
      // console.log('motion from', product, data);
      // Send only to displays in the same product room
      socket.to(product).emit('rotation', data);
    });
  }

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});


server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

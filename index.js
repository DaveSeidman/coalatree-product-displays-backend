import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const PORT = 8000;
const io = new Server(server, {
  cors: {
    origin: ['https://daveseidman.github.io'],
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: ['http://localhost:8080', 'https://coalatree-products-frontend.ngrok.app/', 'https://daveseidman.github.io'],
  methods: ['GET', 'POST'],
}));

app.get('/', (req, res) => {
  res.send('Socket server running.');
});

io.on('connection', (socket) => {
  const { role, product } = socket.handshake.query;
  if (!role || !product) return console.log('missing role or product name');
  console.log('connected:', socket.id, { role, product });

  socket.join(product);

  if (role === 'pedestal') {
    socket.on('rotation', (data) => {
      socket.to(product).emit('rotation', data);
    });
  }

  socket.on('disconnect', () => {
    console.log('disconnected:', socket.id, { role, product });
  });
});


server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

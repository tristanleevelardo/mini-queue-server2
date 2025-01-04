const cron = require('node-cron');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const QueueSchema = require('./models/queueItem'); 
const CounterData = require('./models/counter');
const CounterDataP = require('./models/counterP');

// Increase the limit for disconnect and tellerHeartbeat listeners

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.setMaxListeners(20); // Set a higher value based on your requirements
// Connect to MongoDB
mongoose.connect('mongodb+srv://Agile146658:Agile146658@queuewisedbazure.rqghptb.mongodb.net/');


app.use(bodyParser.json());
// Use CORS middleware
app.use(cors());
// Serve static files
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Server Status</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f4f4f9;
          color: #333;
        }
        .container {
          text-align: center;
          padding: 20px;
          border: 2px solid #4caf50;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
        }
        h1 {
          color: #4caf50;
          font-size: 2.5rem;
        }
        p {
          font-size: 1.2rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>MiniQueue is Running 🚀</h1>
        <b> <i> Powered by Microsoft Azure </i> </b>
      </div>
    </body>
    </html>
  `);
});

//Import API Directory

const queueGenerate = require('./API/generate')(io);
const queueAccept = require('./API/accept')(io);
const queueDone = require('./API/done')(io);
const queueDelete = require('./API/delete')(io);
const queueShow = require('./API/show')(io);

//API Call 

app.use('/generate',queueGenerate); //http://localhost:5000/generate?priority=true
app.use('/accept',queueAccept); //http://localhost:5000/accept/P003
app.use('/done',queueDone); //http://localhost:5000/done/P003
app.use('/delete',queueDelete); //
app.use('/show',queueShow); //http://localhost:5000/show?status=for-release

//Delete all Data @ given time

cron.schedule('00 23 * * *', async () => {

  try {
      // Delete all data from the QueueSchema
      await QueueSchema.deleteMany({});
      console.log('All queueItem Deleted');

      // Delete all data from the CounterSchema
      await CounterData.deleteMany({});
      console.log('Counter data Deleted');

      // Delete all data from the CounterSchema
      await CounterDataP.deleteMany({});
      console.log('Counter data Deleted');

  } catch (error) {
      console.error('Error deleting data:', error);
  }
}, {
  timezone: 'Asia/Shanghai' // Replace with your timezone
});


  
// Start server Local

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//Start the server Microsoft Azure
// const PORT = process.env.PORT || 3001;

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
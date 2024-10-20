import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/routes.js';
import { initializeAWS } from './awsConfig.js';
//import { listTables } from './scripts/checkifTableExists.js'; --> check if the the table can be accessed.
//import { updateTables } from './scripts/updateTables.js';
//import { createTables } from './scripts/createTables.js';

dotenv.config();
initializeAWS();

//listTables(); --> call the list tables function.





const app = express();

app.use(cors());
app.use(express.json());
 
// Define Routes
app.use('/api', routes);


const PORT = process.env.PORT || 5000;

//funtion to start the server
const startServer = (port) => {
  const server = app.listen(parseInt(port, 10), () => {
    console.log(`Server is running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = parseInt(port, 10) + 1;
      console.error(`Port ${port} is already in use. Trying port ${nextPort}...`);
      startServer(nextPort); // Try the next port
    } else {
      console.error('Server error:', err);
    }
  });
};

//start the server
startServer(PORT);


//create tables
//createTables();


//update table schema
//updateTables();


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

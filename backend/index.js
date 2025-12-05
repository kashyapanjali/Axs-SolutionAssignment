const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
dotenv.config();

app.get('/', (req, res) => {
  res.send('Hello World')
})

connectDB;

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes');

const app = express();
const port = 3002;

// Get files or Images by this location
app.use(express.static('./uploads'))

app.use(cors());

mongoose.connect('mongodb+srv://auroyuva:2WR2yx7x6hZ5ek5l@test.rfisdng.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err));

// parse application/json
app.use(bodyParser.json());

// router for all routes
app.use('/', router);

// Listening to the port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

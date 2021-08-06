const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const app = express();
const cors = require('cors')

const PORT = process.env.PORT || 3000;  // always listen for preset environement port otherwise listen to port 3000
const NODE_ENV = process.env.NODE_ENV || 'development'; 


app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(cors())

app.use(logger('tiny')); // for a given format
app.use(bodyParser.json()); //app.use(express.json());

app.use('/', require(path.join(__dirname, 'routes', 'stats.js'))); //directory to serve

// detect the error here if there is one
app.use((req, res, next) => {
  const err = new Error(`${req.method} ${req.url} Not Found`);
  err.status = 404;
  next(err);
});

// send error message back to the front end
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(
    `Express Server started on Port ${app.get(
      'port'
    )} | Environment : ${app.get('env')}`
  );
});
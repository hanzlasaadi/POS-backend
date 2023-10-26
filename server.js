/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-use-before-define */
/**
 * Module dependencies.
 */

const debug = require('debug')('newproject:server');
const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

// Connect config.env file with server
dotenv.config({ path: `./config.env` });

// Connect to DataBase
const DB = process.env.DB_URL.replace('<password>', process.env.DB_PASS);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection sucessfull!!!');
  })
  .catch((err) => {
    console.log("Could'nt connect to database!");
    console.log('error: ', err);
  });

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const portInner = parseInt(val, 10);

  if (Number.isNaN(Number(portInner))) {
    // named pipe
    return val;
  }

  if (portInner >= 0) {
    // portInner number
    return portInner;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

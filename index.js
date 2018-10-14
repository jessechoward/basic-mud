require('dotenv').config();
const path = require('path');
const express = require('express');
const ws = require('ws');
const Mud = require('./mud/mud');
const app = express();

// parse request bodies into objects so we can work with them
// like civilized humanoids
app.use(express.json()); // json body
app.use(express.urlencoded({extended: true})); // url encoded body

// views are used to present the web interface
// along with user specific details
// pug is used as the view/template engine
app.set('view engine', 'pug');
// web/views is used as the base directory for where the
// view engine should look for view/pug files when calling
// res.render('view_name.pug')
app.set('views', path.join(__dirname, 'web', 'views'));

// static assets like client side javascript, css and images
// stored under web/static
app.use('/static', express.static(path.join(__dirname, 'web', 'static')));

// other routes
// stored under web/routes
app.use(require(path.join(__dirname, 'web', 'routes')));

// it is recommended environment variables like this be set
// in a .env file. Note that .env files are excluded in the
// .gitignore file however a sample is provided under example.env

// set the listening port
const listenPort = process.env.LISTEN_PORT || 4000;
// set the listening address
const listenAddr = process.env.LISTEN_ADDRESS || 'localhost';

// a place holder for our mud instance
let mud = null;

// listen on the port and address specified
// express gives us a nice http.server instance as the result
// which we use to initialize the MUD
const server = app.listen(listenPort, listenAddr, () =>
{
	console.log(`Listening on ${server.address().address}:${server.address().port}`);
	const wsServer = new ws.Server({server});
	mud = new Mud(wsServer);
});

// we export the server for testing
exports.server = server;
// we export the mud for testing
exports.mud = mud;

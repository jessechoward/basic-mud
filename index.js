require('dotenv').config();
const path = require('path');
const express = require('express');
const ws = require('ws');
const Mud = require('./mud/mud');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// views
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'web', 'views'));
// static assets like client side javascript, css and images
app.use('/static', express.static(path.join(__dirname, 'web', 'static')));

app.use(require(path.join(__dirname, 'web', 'routes')));

const listenPort = process.env.LISTEN_PORT || 4000;
const listenAddr = process.env.LISTEN_ADDRESS || 'localhost';

const server = app.listen(listenPort, listenAddr, () =>
{
	console.log(`Listening on ${server.address().address}:${server.address().port}`);
	const wsServer = new ws.Server({server});
	new Mud(wsServer);
});

module.exports = server;

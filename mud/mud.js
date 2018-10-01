const EventEmitter = require('events').EventEmitter;
const ws = require('ws');
const url = require('url');
const querystring = require('querystring');
// const jwt = require('jsonwebtoken');
const Player = require('./player');

class Mud extends EventEmitter
{
	constructor(webServer)
	{
		super();
		const wsServer = new ws.Server({server: webServer});
		this._players = new Set();

		wsServer.on('connection', (sock, request) =>
		{
			const query = querystring.parse(url.parse(request.url).query);

			console.log('New connection: ', query);
			sock.send('Connected');

			// todo: add logic to validate and load player from jwt in query string
			const player = new Player({name: 'new player'}, sock);
			this._addPlayer(player);
		});
	}

	_addPlayer(player)
	{
		this._players.add(player);
	}
};

module.exports = Mud;


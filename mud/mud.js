const EventEmitter = require('events').EventEmitter;
const ws = require('ws');
const url = require('url');
const querystring = require('querystring');
// const jwt = require('jsonwebtoken');
const Player = require('./player');
const commands = require('./commands');

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

			// todo: add logic to validate and load player from jwt in query string
			const player = new Player({name: query.name}, sock);
			this.addPlayer(player);
		});
	}

	close(message, code)
	{
		console.log('Exiting: ', message);
	}

	get players(){return this._players;}

	addPlayer(player)
	{
		this._players.add(player);
		player.on('closed', this.removePlayer.bind(this));
		player.on('command', this.handleInput.bind(this));
	}

	removePlayer(player)
	{
		this._players.delete(player);
	}

	handleInput(player, data)
	{
		if (!data || !data.type || data.type != 'command')
		{
			console.log('Client sent something unexpected: ', data);
			return;
		}

		// reset idle
		player.idle = Date.now();
		// execute the command
		commands.execute(this, player, data.command, data.args)
		.then(() =>
		{
			// successful command
			
		})
		.catch((message) =>
		{
			player.writeToCharacter(message);
		});
	}
};

module.exports = Mud;
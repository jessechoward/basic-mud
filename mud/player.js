const EventEmitter = require('events').EventEmitter;
// const Character = require('./character');

class Player extends EventEmitter// extends Character
{
	constructor(data, ws)
	{
		// super(data);
		ws.on('message', this.pushCommand.bind(this));
		ws.on('error', this.errorHandler.bind(this));
		ws.on('close', this.closeHandler.bind(this));
		this._ws = ws;
		this._name = data.name;
	}

	get name(){return this._name;}
	get connected(){return this._ws ? true : false;}

	pushCommand(data)
	{
		if (!this.connected) return;

		/* try
		{
			const cmd = JSON.parse(data);
			this.emit(cmd, this);
		}
		catch (error)
		{
			console.log('Error parsing command form JSON: ', error);
		} */
		this.writeToCharacter(`Received: ${data}`);
		try
		{
			this.emit('command', this, JSON.parse(data));
		}
		catch(error)
		{
			console.log('[ERROR] received non-JSON string from player: ', this.name);
		}
	}

	writeToCharacter(data)
	{
		if (!this.connected) return;

		this._ws.send(data);
	}

	errorHandler(error)
	{
		console.log(`[ERROR] Player ${this.name} error: ${error}`);
	}

	closeHandler()
	{
		console.log(`Player ${this.name} disconnected`);
		this.emit('closed', this);
	}
};

module.exports = Player;

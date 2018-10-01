// const Character = require('./character');

class Player // extends Character
{
	constructor(data, ws)
	{
		// super(data);
		ws.on('message', this.pushCommand.bind(this));
		ws.on('error', this.errorHandler.bind(this));
		ws.on('close', this.closeHandler.bind(this));
		this._ws = ws;
	}

	pushCommand(data)
	{
		/* try
		{
			const cmd = JSON.parse(data);
			this.emit(cmd, this);
		}
		catch (error)
		{
			console.log('Error parsing command form JSON: ', error);
		} */
		this._ws.send(`Received: ${data}`);
	}

	errorHandler(error)
	{
		console.log(`[ERROR] Player ${this.name} error: ${error}`);
	}

	closeHandler()
	{
		console.log(`Player ${this.name} disconneted`);
	}
};

module.exports = Player;

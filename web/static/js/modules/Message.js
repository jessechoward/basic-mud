export class MudMessage
{
	constructor(data)
	{
		this._data = data;
	}

	writeToSocket(sock)
	{
		if (sock)
		{
			sock.send(JSON.stringify(this._data));
		}
	}
};

// check out regex101.com to test examples of the groupings
// Parse the first arg from a string. The arg optionally can be
// single or double quoted. Escaping quotes is not yet supported.
// If you need a multi word arg that contains a single or double
// quote, surround the arg with whichever single or double quote
// you are not using.
const oneArg = /^(([^'"][^\s]+)|(?:'([^']+)')|(?:"([^"]+)"))\s?(.*)/i;

export class MudCommand extends MudMessage
{
	constructor(commandString)
	{
		super({type: 'command'});
		this._parseCommand(commandString);
	}

	_parseCommand(args)
	{
		if (!args || args === '')
		{
			this._data.command = 'update_prompt';
			this._data.args = '';
			return;
		}

		const match = oneArg.exec(args);
		if (match)
		{
			// check out regex101.com for the groupings
			// the command
			this._data.command = match[2];
			// the args
			this._data.args = match[3] || '';
		}
	}
};

import {MudCommand} from './Message.js';

export class WebsockClient
{
	constructor(url, jwt)
	{
		console.log('Websocket connecting');
		this._sock = new WebSocket(url+'?'+$.param({jwt: jwt}));
		this._sock.onopen = this.onOpen.bind(this);
		this._sock.onmessage = this.onData.bind(this);
		this._sock.onclose = this.onClose.bind(this);
		this._sock.onerror = this.onError.bind(this);

		$('#user-input').keypress(this.onInput.bind(this));
	}

	onOpen(event)
	{
		alert('Connection opened');
		$('#console-output').append(`<p>Connected</p>`);
	}

	onError(error)
	{
		alert(error);
		this.close();
	}

	onClose()
	{
		alert('Connection closed');
		$('#console-output').append(`<p>Connection closed</p>`);
		this._sock = null;
	}

	onData(message)
	{
		$('#console-output').append(`<p>${message.data}</p>`);
		$('#console-output').scrollTop($('#console-output').prop('scrollHeight'));
	}

	onInput(event)
	{
		if (event.which != 13) return;

		const userCommand = $('#user-input').val();
		if (userCommand)
		{
			const cmd = new MudCommand(userCommand);
			cmd.writeToSocket(this._sock);
		}
		// clear the input
		$('#user-input').val('');
	}

	close()
	{
		if (this._sock)
		{
			this._sock.close();
		}
	}

	send(data)
	{
		if (this._sock)
		{
			this._sock.send(data);
		}
	}
};

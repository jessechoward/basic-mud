const guid = require('./guid');

class Affect
{
	constructor(data)
	{
		this._id = guid();
		this.data = JSON.parse(JSON.stringify(data));
	}

	get id(){return this._id;}
	get name(){return this._data.name;}
	get duration(){return this._data.duration;}
	get attributes(){return this._data.attributes;}
};

module.exports = Affect;

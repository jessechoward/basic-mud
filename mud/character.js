const EventEmitter = require('events').EventEmitter;
const dice = require('./dice');
const Attribute = require('./attribute');
const races = require('./races');

class Character extends EventEmitter
{
	constructor(data)
	{
		super();
		this._data = JSON.parse(data);
		this._race = races[this._data.race];
		this._class = classes[this._data.class];
		this._applyAttributes();
		this.applyAffects(this._data.affectedBy);
		this._updateChar();
	}

	_applyAttributes()
	{
		// build a list of permanent mods from the race and class
		const perms = [].concat(this._race.attributes, this._class.attributes);
		// the attributes
		this._attributes = {};

		for (let name of Object.keys(this._data.attributes))
		{
			// set the base score for each attribute
			this._attributes[name] = new Attribute(this._data.attributes[name].base);
			// filter based on the current attribute we are initializing
			perms.filter((mod) =>
			{
				return mod.hasOwnProperty(name);
			})
			.forEach((mod) =>
			{
				// apply the permanent mod
				this._attributes[name].applyPerm(mod);
			});
		}
	}

	applyAffect(affect)
	{
		this._data.affectedBy.push(affect);

		if (!affect.attributes) return;

		const names = Object.keys(this._attributes);

		names.forEach((name) =>
		{
			affect.attributes.filter((mod) =>
			{
				return mod.hasOwnProperty(name);
			})
			.forEach((mod) =>
			{
				this._attributes[name]
					.applyTemp({name: affect.name, value: mod.value, duation: affect.duration});
			});
		});
	}

	applyAffects(afffectList)
	{
		affectList.forEach((affect) =>
		{
			this.applyAffect(affect);
		});
	}

	get name(){return this._data.name;}
	get shortDesc(){return this._data.shortDesc;}
	get description(){return this._data.description;}
	get inventory(){return this._data.inventory;}
	get equiped(){return this._data.equiped;}
	get attributes(){return this._attributes;}
	get affects(){return this._affectedBy;}

	pushCommand(command)
	{
		this.emit('command', {character: this, command: command});
	}

	_updateChar()
	{
		// decrement the affects
		for (let affect of this._data.affectedBy)
		{
			// perm-affects
			if (affect.duration !== -1 && --affect.duration === 0)
			{
				affect.delete = true;
			}
		}
		// remove deleted affects
		this._data.affectedBy = this._data.affectedBy.filter((affect) =>
		{
			return !affect.delete;
		});


		// do it all again every 1 minute give or take 15 seconds
		setTimeout(this._updateChar.bind(this), 1000*dice.numRange(45, 75));
	}
};

module.exports = Character;

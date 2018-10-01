const fs = require('fs');

class Class
{
	constructor(data)
	{
		this.name = data.name;
		this.attributes = new Set(data.attributes);
		this.traits = new Set(data.traits);
		this.skills = new Set(data.skills.concat(data.proficiencies));
		this.spells = new Set(data.spells);
		this.proficiencies = new Set(data.proficiencies);
		this.languages = new Set(['common'].concat(data.languages));
		this.playable = false;
	}
};

const loadClassList = () =>
{
	try
	{
		return JSON.parse(fs.readFileSync('../data/classes.json', {encoding: 'utf-8'}));
	}
	catch (error)
	{
		console.log('[FATAL] Unable to load class table: ', error);
		process.exit(-1);
		return null;
	}
};

const classList = loadClassList();
const classes = {};
for (let classData of classList)
{
	classes[classData.name] = new Class(classData);
}

module.exports = Object.freeze(classes);

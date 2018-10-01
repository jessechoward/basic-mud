const fs = require('fs');

class Race
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

const loadRaceList = () =>
{
	try
	{
		return JSON.parse(fs.readFileSync('../data/races.json', {encoding: 'utf-8'}));
	}
	catch (error)
	{
		console.log('[FATAL] Unable to load race table: ', error);
		process.exit(-1);
		return null;
	}
};

const raceList = loadRaceList();
const races = {};
for (let race of raceList)
{
	races[race.name] = new Race(race);
}

module.exports = Object.freeze(races);

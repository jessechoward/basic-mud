const fs = require('fs');
const path = require('path');
const EnumValue = require('../enum');
const FlagValue = require('../flags');
const constants = require('../constants');
// the file we write our command table to
const commandFile = '../../data/commands.json';

const commands = {};

const loadCommand = (name, minPos='dead', minLevel=0, logLevel='normal', enabled=true) =>
{
	if (!name || name === '')
	{
		throw new Error('command.load requires a command name');
	}
	// build a path from the command name
	const filename = path.join(__dirname, `${name}.js`);

	return new Promise((resolve, reject) =>
	{
		// check if the path exists
		path.exists(filename, (exists) =>
		{
			if (!exists)
			{
				return reject(`command file ${filename} not found`);
			}

			// check if a reload of the cache is necessary
			if (Object.keys(commands).includes(filename))
			{
				delete require.cache[filename];
			}

			try
			{
				// add the command to the list
				commands[name] =
				{
					method: require(filename),
					minPos: minPos,
					minLevel: minLevel,
					logLevel: logLevel,
					enabled: enabled
				};
			}
			catch(error)
			{
				return reject(error);
			}

			return resolve();
		});
	});
};

const defaultCommandTable =
{
	'say':			{minPos: 'resting',	minLevel: 0,	logLevel: 'normal',		enabled: true},
	'tell':			{minPos: 'resting',	minLevel: 0,	logLevel: 'normal',		enabled: true},
	'gossip':		{minPos: 'dead',	minLevel: 0,	logLevel: 'normal',		enabled: true},
	'shutdown':		{minPos: 'dead',	minLevel: 100,	logLevel: 'always',		enabled: true},
	'reboot':		{minPos: 'dead',	minLevel: 100,	logLevel: 'always',		enabled: true},
};

const loadCommandTable = () =>
{
	// check if the path exists
	path.exists(commandFile, (exists) =>
	{
		// use the tiny bare essentials default command table
		let table = defaultCommandTable;
		if (exists)
		{
			table = JSON.parse(fs.readFileSync(commandFile));
		}
			
		return Promise.all(Object.keys(table).forEach((commandName) =>
		{
			command = table[commandName];
			return loadCommand(commandName, command.minPos, command.minLevel, command.logLevel, command.enabled);
		}));
	});
};

const exportCommandTable = () =>
{
	const sorted = {};
	Promise.all(sortCommands().forEach((commandName) =>
	{
		return new Promise((resolve, reject) =>
		{
			const command = commands[commandName];
			sorted[commandName] = {minPos: command.minPos, minLevel: command.minLevel, logLevel: command.logLevel, enabled: command.enabled};
			return resolve(sorted);
		});
	}))
	.then((data) =>
	{
		fs.writeFile(commandFile, JSON.stringify(data, null, 2), {flag: 'w'});
	});
};

const execute = (mud, ch, command, args) =>
{
	return new Promise((resolve, reject) =>
	{
		const cmd = commands[command] || null;
		if (!cmd)
		{
			console.log(`Unknown command: ${command} requested by: ${ch.name}`);
			return reject('Unknown command. Consult the help pages or type "commands" for a list of available commands.');
		}

		if (!cmd.enabled)
		{
			console.log(`Disabled command: ${command} requested by: ${ch.name}`);
			return reject('Unknown command. Consult the help pages or type "commands" for a list of available commands.');
		}

		if (ch.level < cmd.minLevel) return reject('Unknown command. Consult the help pages or type "commands" for a list of available commands.');
		if (ch.position.lt(cmd.minPosition)) return reject('You can\'t do that in your current position.');

		// do a better job of logging levels like info, debug, and other
		console.log(`[${cmd.logLevel}] command: ${command} requested by: ${ch.name} min level: ${cmd.minLevel}`);
		// execute the command
		return resolve(commands[command].method(mud, ch, args));
	});

};

// call update to hot load a new command module or update an existing one
// ******* Caution **********
// This may cause instability but great for testing quick changes to commands
exports.update = loadCommand;
// call this once to load the command table from file
exports.load = loadCommandTable;
// export the command table
// should call this after updating commands to save changes
exports.export = exportCommandTable;
// the command list
exports.commands = commands;
// execute a command
exports.execute = execute;

const broadcast = require('../broadcast');
const span = require('../span');

module.exports = (mud, ch, args) =>
{
	if (!args || args === '')
	{
		ch.writeToCharacter('Tell who what?');
		return;
	}

	const argv = args.split(' ');
	const target = mud.findPlayerByName(argv.shift());
	const message = args.substr(argv[0].length).trim();

	if (!target)
	{
		ch.writeToCharacter('Tell who what?');
		return;
	}
	// send to self
	broadcast.act(`You tell $N ${span.open('channel_tell')}"${message}"${span.end}`,
		ch, null, ch, 'TO_CHAR', 'POS_SLEEPING');
	// send to others
	broadcast.act(`$n tells you ${span.open('channel_tell')}"${message}"${span.end}`,
		ch, null, target, 'TO_VICT', 'POS_SLEEPING');
};
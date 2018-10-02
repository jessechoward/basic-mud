const broadcast = require('../broadcast');
const span = require('../span');

module.exports = (mud, ch, args) =>
{
	if (!args || args === '')
	{
		ch.writeToCharacter('Say what?');
		return;
	}
	// send to self
	broadcast.act(`You say ${span.open('channel_say')}"${args}"${span.end}`,
		ch, null, ch, 'TO_CHAR', 'POS_RESTING');
	// send to others
	broadcast.act(`$n says ${span.open('channel_say')}"${args}"${span.end}`,
		ch, null, null, 'TO_ROOM', 'POS_RESTING');
};
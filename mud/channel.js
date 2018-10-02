const broadcast = require('./broadcast');
const span = require('./span');

module.exports = (mud, ch, channel, args) =>
{
	if (!args || args === '')
	{
		ch.writeToCharacter(`What do you want to ${channel}?`);
		return;
	}

	// send to self
	broadcast.act(`[${channel} you]: ${span.open(`channel_${channel}`)}"${args}"${span.end}`,
		ch, null, ch, 'TO_CHAR', 'POS_DEAD');
	// send to others
	mud.players.forEach((player) =>
	{
		// check if player is in silent mode
		if (player.channels && player.channels.silent) return;
		// check if player is subscribed to channel
		if (player.channels && player.channels.subscribed && !player.channels.subscribed.includes(channel)) return;
		// check if player has channel muted
		if (player.channels && player.channels.muted && player.channels.muted.includes(channel)) return;
		broadcast.act(`[ $n]: ${span.open(`channel_${channel}`)}"${args}"${span.end}`,
			ch, null, player, 'TO_VICT', 'POS_DEAD');
	});
};
const broadcast = require('../broadcast');
const span = require('../span');
const channel = require('../channel');

module.exports = (mud, ch, args) =>
{
	channel(mud, ch, 'gossip', args);
};
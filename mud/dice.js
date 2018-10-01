/**
 * A lookup of dice types (names) to number of sides
 */
const diceType = {d4: 4, d6: 6, d8: 8, d10: 10, d20: 20};
exports.diceType = Object.freeze(diceType);

/**
 * A pseudo random number generator
 * @param {int} min inclusive minimum value
 * @param {int} max inclusive maximum value
 * @returns {int} an integer between min and max inclusive
 */
const numRange = (min, max) =>
{
	// a random number between 0 and max -1
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.numRange = numRange;

/**
 * simulate rolling a number of same sided dice with an optional bonus/base value
 * @param {int} count the number of dice to roll
 * @param {string} type the type of dice to roll (diceType)
 * @param {int} [bonus=0] a bonus or ultimately base value to add to the roll
 */
const roll = (count, type, bonus=0) =>
{
	let rval = bonus;
	for (let die = 0; die < count; die++)
	{
		// default to 6
		rval += numRange(1, diceType[type] || 6);
	}
	return rval;
};
exports.roll = roll;

const advantage = (bonus=0) =>
{
	return Math.max(roll(1, 'd20', bonus), roll(1, 'd20', bonus));
};
exports.advantage = advantage;

const disadvantage = (bonus=0) =>
{
	return Math.min(roll(1, 'd20', bonus), roll(1, 'd20', bonus));
};
exports.disadvantage = disadvantage;

const percentage = (bonus=0) =>
{
	const rval = (numRange(0, 9) * 10) + numRange(0, 9);
	// a 00 and a 0 = 100%
	if (rval === 0) rval = 100;
	// apply the bonus - note it can be > 100%
	// this may need to change...
	return rval + bonus;
};
exports.percentage = percentage;

// the dicestring regex
const dicePattern = /^(\d+)(d(?:4|6|8|10|12|20))([+-](?:\d+))?$/i;
exports.dicePattern = dicePattern;

const rollString = (diceString) =>
{
	const match = diceString.match(dicePattern);
	if (match) return roll(match[1], match[2], match[3] || 0);
	console.log('Invalid string passed to rollString: ', diceString);
	// default to rolling a single d6 die. Any errors should be taken care of!
	return roll(1, 'd6', 0);
};
exports.rollString = rollString;

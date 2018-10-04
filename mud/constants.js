/**
 * This file contains various constants such as enum and flag tables
 */

/**
 * enum of sexes
 */
const sex =
[
	'unknown',
	'male',
	'female'
];
exports.sex = Object.freeze(sex);

/**
 * enum of directions
 * used for exits in rooms
 */
const direction = 
[
	'north',
	'east',
	'south',
	'west',
	'up',
	'down'
];
exports.direction = Object.freeze(direction);

/**
 * enum of character positions
 */
const position =
[
	'dead',
	'mortal',
	'incapacitated',
	'stunned',
	'sleeping',
	'resting',
	'sitting',
	'fighting',
	'standing'
];
exports.position = Object.freeze(position);

/**
 * enum of damage reistance modifiers
 */
const resistance =
[
	'vulnerable',
	'normal',
	'resistant',
	'immune'
];
exports.resistance = Object.freeze(resistance);

/**
 * enum of types of damage
 * attacks may inflict multiple types of damage
 * characters 
 */
const damageClass =
[
	'none',
	'bash',
	'pierce',
	'slash',
	'fire',
	'cold',
	'lightning',
	'acid',
	'poison',
	'evil',
	'holy',
	'energy',
	'mental',
	'disease',
	'drowning',
	'light',
	'other',
	'harm',
	'charm',
	'sound'
];
exports.damageClass = Object.freeze(damageClass);

/**
 * flags that define attributes of a room
 */
const roomFlags =
[
	'dark',
	'no_npc',
	'indoors',
	'private',
	'safe',
	'solitary'
];
exports.roomFlags = Object.freeze(roomFlags);

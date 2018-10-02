/*****************************************************************************
 * This file is a derived work from the functionality of act_new in many merc
 * derived MUD bases. Much of it is straight up copied. Since I cannot find
 * a link to the original codebase I have included what I believe to be the
 * relevant licenses to give credit where it is due.
 * 
 * Please let me know if you feel I have missed any.
 *****************************************************************************/

const broadcastType = Object.freeze(['TO_CHAR', 'TO_VICT', 'TO_ROOM', 'TO_NOTVICT']);
const he_she = Object.freeze({unknown: 'it', male: 'he', female: 'she'});
const him_her = Object.freeze({unknown: 'it', male: 'him', female: 'her'});
const his_her = Object.freeze({unknown: 'its', male: 'his', female: 'hers'});
// be sure to update this as new items are added to broadcast
const actRegex = /\$([tTnNeEmMsSpPd])/;

// See the Broadcast.act() static method for parameter descriptions.
// Note that we throw errors and not just log errors here. This
// means we need to catch those errors if we do not want them to
// cause game crashes.
const broadcast = (format, ch, arg1, arg2, bType, minPos='dead') =>
{
	// check for a format string
	if (!format || format === '')
	{
		throw new Error('Invalid format passed to broadcast');
	}
	// make sure we have a valid broadcast type
	if (!broadcastType.includes(bType))
	{
		throw new Error('Invalid broadcastType passed to broadcast');
	}
	// make sure the originator is valid
	// and the originator is in a valid room
	if (!ch || !ch.inRoom)
	{
		throw new Error('Null character or room for broadcast');
	}

	// taking advantage of javascript not being a typesafe language...
	const vch = arg2;
	const obj1 = arg1;
	const obj2 = arg2;
	let toList = ch.inRoom.characters;

	// the to list changes if the action is directed towards a victim
	if (bType === 'TO_VICT')
	{
		if (!vch || !vch.inRoom)
		{
			throw new Error('broadcast TO_VICT requires a valid target and target must be in a valid room');
		}
		toList = target.inRoom.characters;
	}

	// iterate over the list of characters to send the message to
	for (let toChar of toList)
	{
		if (toChar.position < minPos) continue;
		if (bType === 'TO_CHAR' && toChar !== ch) continue;
		if (bType === 'TO_VICT' && (toChar !== vch || toChar === ch)) continue;
		if (bType === 'TO_ROOM' && toChar === ch) continue;
		if (bType === 'TO_NOTVICT' && (toChar === vch || toChar === ch)) continue;

		// this is the magic
		let match = null;
		let result = format;
		do
		{
			match = format.match(actRegex);
			if (match)
			{
				// match[0] will be the whole token to be replaced
				// match[1] will be the letter
				switch (match[1])
				{
					case 't':
						// arg1 interpreted as a string
						result = result.replace(match[0], arg1);
						break;
					case 'T':
						// arg2 interpreted as a string
						result = result.replace(match[0], arg2);
						break;
					case 'n':
						// the name of ch or 'someone' if not visible to the target
						result = result.replace(match[0], toChar.can_see_char(ch) ? ch.name : 'someone');
						break;
					case 'N':
						// the name of arg2 (considered vch or the victim) or 'someone' if not visible to the target
						result = result.replace(match[0], toChar.can_see_char(vch) ? vch.name : 'someone');
						break;
					case 'e':
						// he she or it based on the sex of ch
						result = result.replace(match[0], he_she[ch.sex || 'unknown']);
						break;
					case 'E':
						// he she or it of arg2 (considered vch or the victim)
						result = result.replace(match[0], he_she[vch.sex || 'unknown']);
						break;
					case 'm':
						// him her or it based on the sex of ch
						result = result.replace(match[0], him_her[ch.sex || 'unknown']);
						break;
					case 'M':
						// him her or it based on the sex of arg2 (considered vch or the victim)
						result = result.replace(match[0], him_her[vch.sex || 'unknown']);
						break;
					case 's':
						// his her or its based on the sex of ch
						result = result.replace(match[0], his_her[ch.sex || 'unknown']);
						break;
					case 'S':
						// his her or its based on the sex of arg2 (considered vch or the victim)
						result = result.replace(match[0], his_her[vch.sex || 'unknown']);
						break;
					case 'p':
						// the short description of arg1 (considered as an item) or 'something' if invisible
						result = result.replace(match[0], toChar.can_see_item(obj1) ? obj1.shortDesc : 'something');
						break;
					case 'P':
						// the short description of arg2 (considered as an item) or 'something' if invisible
						result = result.replace(match[0], toChar.can_see_item(obj2)  ? obj2.shortDesc : 'something');
						break;
					case 'd':
						// arg2 is considered a string and should be a descriptive name for a door if it has one
						// otherwise the word 'door' is used.
						result = result.replace(match[0], arg2 ? arg2 : 'door');
						break
					default:
						// throw an exception if we find a poorly formatted description
						// !!! Be sure to handle this or it will exit the game loop because
						// someone made a bad format string...
						throw new Error('bad format string passed to broadcast');
				}
			}
		}
		while (match)
		// actually send the data to the character
		toChar.writeToCharacter(result);
	}
};

module.exports = class Broadcast
{
	/**
	 * act out a sentence with attention to details such as position, visibility and sex
	 *
	 * @static
	 * @param {string} format the format sentence containing tokens to be replaced per target
 	 * @param {Character} ch the character used for context of the broadcast
 	 * @param {(string|Item)} arg1 depending on bType this will be interpreted
 	 * @param {(string|Character|Item)} arg2 depending on bType this could be a string, character, or item reference
 	 * @param {broadcastType} bType the type of broadcast
 	 * @param {position} minPos the minimum position a target has to be in to receive the message
 	 */
	static act(format, ch, arg1, arg2, bType, minPos)
	{
		broadcast(format, ch, arg1, arg2, bType, minPos);
	}

	/**
	 * the types of broadcasting available
	 *
	 * @readonly
	 * @static
	 */
	static get types()
	{
		return broadcastType;
	}

	static validateFormat(format)
	{
		if (format && format !== '' && format.match(actRegex)) return true;
		return false;
	}
};
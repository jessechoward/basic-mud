module.exports =
{
	'uidString':
	{
		'type': 'string',
		'pattern': '^[0-9a-f]{32}$'
	},
	'email':
	{
		'type': 'string',
		'format': 'email'
	},
	'playerName':
	{
		'type': 'string',
		'pattern': '^[A-Z][a-z]+$',
		'minLength': 3,
		'maxLength': 16
	},
	'level':
	{
		'type': 'integer',
		'minimum': 1,
		'maximum': 20
	},
	'keyword':
	{
		'type': 'string',
		'pattern': '^[a-z0-9]+(?: [a-z0-9]+)*$'
	},
	'keywords':
	{
		'type': 'array',
		'items': {'$ref': '#/definitions/keyword'},
		'uniqueItems': true,
		'minItems': 1
	},
	'enumValue':
	{
		'type': 'string',
		'pattern': '^[a-z]+(_[a-z]+)?$',
		'minLength': 3,
		'maxLength': 32
	},
	'flagValue':
	{
		'type': 'array',
		'uniqueItems': true,
		'items':
		{
			'$ref': '#/definitions/enumValue'
		}
	},
	'diceString':
	{
		'type': 'string',
		'pattern': '^[1-9]\\d*d(?:4|6|8|10|12|20)(?:[+-](?:0|(?:[1-9]\\d*)))?$'
	},
	'descString':
	{
		'type': 'string',
		'pattern': '^[ -~\\t\\n]*$'
	},
	'shortDesc':
	{
		'type': 'string',
		'pattern': '^[A-Za-z]+(?: [A-Za-z0-9]+)*$',
		'maxLength': 32
	},
	'extraDesc':
	{
		'type': 'object',
		'properties':
		{
			'keywords': {'$ref': '#/definitions/keywords'},
			'description': {'$ref': '#/definitions/descString'}
		},
		'required': ['keywords', 'description']
	},
	'attribute':
	{
		'type': 'integer',
		'minimum': 1,
		'maximum': 30
	},
	'attributes':
	{
		'type': 'object',
		'properties':
		{
			'strength': {'$ref': '#/definitions/attribute'},
			'dexterity': {'$ref': '#/definitions/attribute'},
			'intelligence': {'$ref': '#/definitions/attribute'},
			'wisdom': {'$ref': '#/definitions/attribute'},
			'constitution': {'$ref': '#/definitions/attribute'},
			'charisma': {'$ref': '#/definitions/attribute'}
		},
		'additionalProperties': false,
		'required': ['strength', 'dexterity', 'intelligence', 'wisdom', 'constitution', 'charisma'],
		'default': {'strength': 15, 'dexterity': 15, 'intelligence': 15, 'wisdom': 15, 'constitution': 15, 'charisma': 15}
	},
	'duration':
	{
		'type': 'integer',
		'minimum': -1,
		'maximum': 100
	},
	'affect':
	{
		'type': 'object',
		'properties':
		{
			'name': {'$ref': '#/definitions/enumString'},
			'level': {'$ref': '#/definitions/level'},
			'duration':	{'$ref': '#/definitions/duration'}
		},
		'additionalProperties': false,
		'required': ['name', 'level', 'duration']
	},
	'affectedBy':
	{
		'type': 'array',
		'uniqueItems': true,
		'items': {'$ref': '#/definitions/affect'}
	}
};

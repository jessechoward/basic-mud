const attributeGroup =
{
	strength:
	[
		'athletics'
	],
	dexterity:
	[
		'acrobatics',
		'sleight of hand',
		'stealth'
	],
	intelligence:
	[
		'arcana',
		'history',
		'investigation',
		'nature',
		'religion'
	],
	wisdom:
	[
		'animal handling',
		'insight',
		'medicine',
		'perception',
		'survival'
	],
	charisma:
	[
		'deception',
		'intimidation',
		'performance',
		'persuasion'
	]
};
exports.byAttribute = attributeGroup;

const skillList = {};
// build the skill list
for (let attribute of Object.keys(attributeGroup))
{
	for (let skill of attributeGroup[attribute])
	{
		skillList[skill] = attribute;
	};
};

exports.bySkill = skillList;


const test = require('tape');
const dice = require('../src/dice');
const Attribute = require('../src/attribute');

const attributeNames = ['strength', 'intelligence', 'dexterity', 'wisdom', 'constitution', 'charisma'];

function buildAttributes()
{
	const attributes = {};

	for (let name of attributeNames)
	{
		// roll an advantage
		attributes[name] = new Attribute(dice.advantage());
	}

	return attributes;
};

// make sure we can create attributes how we want to
test('Attributes are created', (assert) =>
{
	const attributes = buildAttributes();

	for (let name of attributeNames)
	{
		assert.true(attributes.hasOwnProperty(name), `has a "${name}" property`);
	}

	assert.end();
});

// check that scores and modifiers exist and are numbers
test('Attributes have scores and modifiers', (assert) =>
{
	const attributes = buildAttributes();

	for (let name of attributeNames)
	{
		assert.ok(!isNaN(attributes[name].score), 'has a "score" value');
		assert.ok(!isNaN(attributes[name].modifier), 'has a "modifier" value');
	}

	assert.end();
});

test('Attributes can apply perm and temp affects/modifiers', (assert) =>
{
	const attribute = new Attribute(dice.roll(1, 'd20', 2));
	attribute.applyPerm({name: 'perm', duration: 1, value: dice.numRange(1, 3)});
	attribute.applyTemp({name: 'temp', duration: 1, value: dice.numRange(1, 3)});
	assert.equal(attribute.base + attribute.perms.score + attribute.temps.score, attribute.score, 'score adds up to the base + perm + temp');
	assert.end();
});

test('Attributes decrement temp durations on ticks', (assert) =>
{
	const attribute = new Attribute(dice.roll(1, 'd20', 2));

	attribute.applyTemp({name: 'test', duration: 1, value: dice.numRange(1, 3)});
	assert.equal(attribute.base + attribute.temps.score, attribute.score, 'applying a temp affect modifies score');
	attribute.onTick();
	assert.equal(attribute.base, attribute.score, 'when an affect times out on ticks it is removed');
	assert.end();
});

test('Attributes modifier works as expected', (assert) =>
{
	const attribute = new Attribute(10);
	assert.equal(attribute.modifier, 0, 'modifier at score of 10 is 0');

	attribute.applyPerm({name: 'test', duration: -1, value: 2});
	assert.equal(attribute.modifier, 1, 'modifier at score of 12 is 1');

	attribute.applyPerm({name: 'test', duration: -1, value: 2});
	assert.equal(attribute.modifier, 2, 'modifier at score of 14 is 2');

	attribute.applyPerm({name: 'test', duration: -1, value: 16});
	assert.equal(attribute.modifier, 10, 'modifier at score of 30 is 10');

	assert.end();
});

test('Attribute affects can be removed', (assert) =>
{
	const attribute = new Attribute(dice.roll(1, 'd20', 2));

	attribute.applyTemp({name: 'test', duration: 1, value: dice.numRange(1, 3)});
	assert.equal(attribute.base + attribute.temps.score, attribute.score, 'applying a temp affect modifies score');
	attribute.removeTemp('test');
	assert.equal(attribute.base, attribute.score, 'the temp affect was successfully removed');
	assert.end();
});

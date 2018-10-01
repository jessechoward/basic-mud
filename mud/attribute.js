const dice = require('./dice');

/**
 * Reduce function for summing up the mod values of temp/perm affects
 * 
 * @param {int} acc accumulator 
 * @param {int} curr curent value being evaluated
 */
const modReducer = (acc, curr) => acc + curr.value;

/**
 * Calculate a score modifier
 * 
 * @param {int} score the score to enter into the algorithm
 * @return {int} the modifier is calculated (score - 10) / 2 and (round closer to 0)
 */
const calculateModifier = (score) =>
{
	const rval = (score - 10)/2;
	const sign = Math.sign(rval);
	if (sign === -1) return Math.round(rval * sign) * sign;
	else return Math.floor(rval);
};

/**
 * Encapsulate an attribute
 *
 * @class Attribute
 */
class Attribute
{
	/**
	 * Creates an instance of Attribute.
	 * @param {int} base the number to use for the base score - usually from a 1d20 roll
	 * @memberof Attribute
	 */
	constructor(base)
	{
		// keep the base inside 30
		this._base = Math.max(1, Math.min(base, 30));
		// the permanent mods
		this._perms = [];
		// the temporary mods
		this._temps = [];
		// initialize the score and modifier values
		this._updateScore();
	}

	// the base score
	get base(){return this._base;}
	// the calculated score including affect mods
	get score(){return this._score;}
	// the calculated modifier based on the score with affects
	get modifier(){return this._modifier;}
	// the perm affects that are applied
	get perms(){return {score: this._perms.reduce(modReducer, 0), values: this._perms};}
	// the temps affects that are applied
	get temps(){return {score: this._temps.reduce(modReducer, 0), values: this._temps};}

	/**
	 * Calculate our modified score and modifier.
	 * This should be called internally after anything that
	 * will modify the score.
	 *
	 * @memberof Attribute
	 */
	_updateScore()
	{
		this._score = this._base;
		this._score += this.perms.score;
		this._temps = this._temps.filter((mod) => {return !mod.delete;});
		this._score += this.temps.score;
		this._score = Math.min(this._score, 30);
		this._modifier = calculateModifier(this.score);
	}

	/**
	 * Apply a temporary affect that can expire and/or be dispelled
	 *
	 * @param {affect} mod the affect to apply
	 * @returns {void}
	 * @memberof Attribute
	 */
	applyTemp(mod)
	{
		// don't apply zero/missing duration affects
		if (!mod.duration) return;
		this._temps.push(mod);
		this._updateScore();
	}

	/**
	 * remove an affect
	 *
	 * @param {string} name
	 * @memberof Attribute
	 */
	removeTemp(name)
	{
		let change = false;
		for (let mod of this._temps)
		{
			if (mod.name === name)
			{
				mod.delete = true;
				change = true;
			}
		}
		if (change) this._updateScore();
	}

	/**
	 * Apply a permanent affect that cannot be dispelled
	 *
	 * @param {affect} mod the affect to apply
	 * @returns {void}
	 * @memberof Attribute
	 */
	applyPerm(mod)
	{
		this._perms.push(mod);
		this._updateScore();
	}

	/**
	 * Update temporary affects on a tick
	 *
	 * @memberof Attribute
	 */
	onTick()
	{
		let change = false;
		for (let mod of this._temps)
		{
			// -1 is akin to perm until dispelled
			// this allows for enchanted items to be dispelled and lose worth
			if (mod.duration != -1)
			{
				if (--mod.duration <= 0)
				{
					mod.delete = true;
					change = true;
				}
			}
		}
		// don't forget to update the score if there was change
		if (change) this._updateScore();
	}
};

module.exports = Attribute;

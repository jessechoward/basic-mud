/**
 * A flag value bound to an array of flag names
 *
 * @class FlagValue
 */
module.exports = class FlagValue
{
	/**
	 * Creates an instance of FlagValue.
	 * @param {string[]} table the table (array) of acceptable values
	 * @param {string[]} [flags=[]] the initial flags to set
	 * @memberof FlagValue
	 */
	constructor(table, flags=[])
	{
		this._table = table;
		this._flags = new Set();
		this.value = flags;
	}

	get value()
	{
		const flags = [];
		for (let flag of this._flags.values) flags.append(flag);

		return flags;
	}

	set value(flags)
	{
		for (let flag of flags)
		{
			if (this._table.includes(flag)) this._flags.add(flag);
		}
	}

	equals(flags)
	{
		// first check if the sizes are the same
		if (this._flags.size !== flags.length) return false;
		// since we know the sizes are the same, we only have to
		// check equality in one direction
		for (let flag of flags)
		{
			if (!this._table.includes(flag) || !this._flags.has(flag)) return false;
		}
		// yay!
		return true;
	}

	and(flags)
	{
		const intersection = new Set([...this._flags].filter((flag) =>
		{
			flags.includes(flag);
		}));

		return Array.from(intersection);
	}

	or(flags)
	{
		const union = new Set([...flags, ...this._flags]);
		return Array.from(union);
	}
};
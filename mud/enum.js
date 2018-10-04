/**
 * a value constrained to the items in a table
 *
 * @class EnumValue
 */
module.exports = class EnumValue
{
	constructor(table, value)
	{
		this._table = table;
		this._value = 'unknown';
		this._index = -1;
		this.value = value;
	}

	get value(){return this._value;}
	set value(value)
	{
		if (!this._table.includes(value)) return;
		this._value = value;
		this._index = this._table.indexOf(this._value);
	}

	eq(value)
	{
		if (!this._table.includes(value) || !this.value === value) return false;
		return true;
	}

	gt(value)
	{
		if (!this._table.includes(value)) return false;
		const index = this._table.indexOf(value);
		return (this._index > index);
	}

	gte(value)
	{
		if (!this._table.includes(value)) return false;
		const index = this._table.indexOf(value);
		return (this._index > index);
	}

	lt(value)
	{
		if (!this._table.includes(value)) return false;
		const index = this._table.indexOf(value);
		return (this._index < index);
	}

	lte(value)
	{
		if (!this._table.includes(value)) return false;
		const index = this._table.indexOf(value);
		return (this._index <= index);
	}
};
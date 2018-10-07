const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const thisFile = path.basename(__filename);
const definitions = require('./definitions');
const ajv = new Ajv({schemaId: 'auto'});
const schemas = {}

// ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

fs.readdirSync(__dirname)
	.filter((filename) => {return filename !== thisFile && path.extname === '.json';})
	.forEach((filename) =>
	{
		try
		{
			// load and parse the json schema files
			const schema = JSON.parse(fs.readFileSync(path.join(__dirname, filename)));
			// allow to override or add more definitions
			schema.definitions = Object.assign({}, definitions, schema.definitions);
			// the schema key
			const key = path.basename(filename, '.json');
			// add the schema to ajv
			ajv.addSchema(schema, key);
			// add the schema to the schemas object
			schemas[key] =
			{
				// get the JSON schema object
				// useful for exporting to clients so clients can
				// validate against up to date schemas
				getSchema: () =>
				{
					return ajv.getSchema(key);
				},
				// validate data against the schema at this key
				validate: (data) =>
				{
					return ajv.validate(key, data);
				},
				// get errors if validate returned false
				getErrors: () =>
				{
					return ajv.errors;
				}
			};
		}
		catch(error)
		{
			console.log(`Error loading schema ${filename}: `, error);
			throw new Error(error);
		}
	});

module.exports = schemas;
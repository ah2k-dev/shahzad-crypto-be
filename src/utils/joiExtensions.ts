import Joi, { CustomHelpers } from 'joi';
import mongoose from 'mongoose';

const jsonParserJoi = Joi.extend({
  type: 'json',
  base: Joi.string(),
  messages: {
    'json.base': '{{#label}} must be a valid JSON string'
  },
  coerce: (value, helpers) => {
    try {
      return { value: JSON.parse(value) }; // Parse JSON if it's a valid string
    } catch (e) {
      console.log(e);
      return { errors: [helpers.error('json.base')] };
    }
  }
});

// Wrapper function for checking array or object
const validateParsedJSON = (type: 'array' | 'object', schema: Joi.AnySchema) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonParserJoi.string().custom((value: any, helpers: CustomHelpers) => {
    console.log('value', typeof value);
    value = JSON.parse(value);
    if (type === 'array' && !Array.isArray(value)) {
      return helpers.error('json.base', { label: 'Expected an array' });
    }
    if (type === 'object' && typeof value !== 'object') {
      return helpers.error('json.base', { label: 'Expected an object' });
    }

    // Validate the parsed JSON using the provided schema
    const { error } = schema.validate(value, { allowUnknown: true });
    if (error) {
      throw error; // Joi handles this error and formats it
    }
    return value;
  });

const objectIDJoi = Joi.extend({
  type: 'objectId',
  base: Joi.string(),
  messages: {
    'objectId.base': '{{#label}} must be a valid ObjectID'
  },
  coerce: (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return { errors: [helpers.error('objectId.base')] };
    }
    return { value };
  }
});

export { objectIDJoi, validateParsedJSON };

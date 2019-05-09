/**
 * Normalized interface to JSON builtins.
 * 
 */

/**
 * An interface for serializing
 * @typedef {object} SerializerLike
 * @property {value: any => string} dumps
 * @property {text: string => any} loads
 */

/** @type {typeof SerializerLike} */
const Json = {
  dumps: value => JSON.stringify(value, null, 0),
  loads: text => JSON.parse(text)
};
export default Json;
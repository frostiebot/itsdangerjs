/**
 * Splits a string by `delimiter` from the right
 * 
 * This is a "dumb" implementation in that we split only once. I have my reasons.
 * @param {string} str 
 * @param {string} delim
 * @return {Array<string>}
 */
export const rsplit = (str, delim) => {
  const arr = str.split(delim)
  const last = arr.pop(-1)
  return [ arr.join(delim), last ]
}

export const required = (name) => { throw new Error(`Argument '${name}' is required.'`) }

export const identity = (...keys) => keys.reduce((map, key) => ({ ...map, [key]: key }), {})

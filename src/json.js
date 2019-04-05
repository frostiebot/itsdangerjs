const isPrimitive = value => ['string', 'number', 'boolean'].includes(typeof value)

export default {
  loads: payload => isPrimitive(payload) && `${payload}` || JSON.parse(payload),
  dumps: obj => isPrimitive(obj) && `${obj}` || JSON.stringify(obj, null, 0),
}

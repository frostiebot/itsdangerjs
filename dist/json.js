"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const isPrimitive = value => ['string', 'number', 'boolean'].includes(typeof value);

var _default = {
  loads: payload => isPrimitive(payload) && `${payload}` || JSON.parse(payload),
  dumps: obj => isPrimitive(obj) && `${obj}` || JSON.stringify(obj, null, 0)
};
exports.default = _default;
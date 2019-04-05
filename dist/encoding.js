"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.base64urldecodeNumber = exports.base64urlencodeNumber = exports.base64decodeNumber = exports.base64encodeNumber = exports.base64urldecode = exports.base64urlencode = exports.base64decode = exports.base64encode = void 0;

// https://github.com/commenthol/url-safe-base64/blob/master/src/index.js
// const ENCODED = { '+': '-', '/': '-', '=': '.' }
// const DECODED = { '-': '+', '_': '/', '.': '=' }
// export const encode = string => string.replace(/[+/=]/g, m => ENCODED[m])
// export const decode = string => string.replace(/[-_.]/g, m => DECODED[m])
const base64encode = (string = '') => Buffer.from(string).toString('base64');

exports.base64encode = base64encode;

const base64decode = (string = '') => Buffer.from(string, 'base64').toString('utf8');

exports.base64decode = base64decode;

const base64urlencode = string => base64encode(string).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

exports.base64urlencode = base64urlencode;

const base64urldecode = string => {
  string = string.replace(/-/g, '+').replace(/_/g, '/');

  while (string.length % 4) string += '=';

  return base64decode(string);
};

exports.base64urldecode = base64urldecode;

const base64encodeNumber = number => {
  let hex = parseInt(number).toString(16);
  if (hex.length % 2 === 1) hex = '0' + hex;
  return Buffer.from(hex, 'hex').toString('base64');
};

exports.base64encodeNumber = base64encodeNumber;

const base64decodeNumber = string => parseInt(Buffer.from(string, 'base64').toString('hex'), 16);

exports.base64decodeNumber = base64decodeNumber;

const base64urlencodeNumber = number => base64encodeNumber(number).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

exports.base64urlencodeNumber = base64urlencodeNumber;

const base64urldecodeNumber = string => {
  string = string = string.replace(/-/g, '+').replace(/_/g, '/');

  while (string.length % 4) string += '=';

  return base64decodeNumber(string);
};

exports.base64urldecodeNumber = base64urldecodeNumber;
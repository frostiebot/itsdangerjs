/**
 * Base64 / binary data / utf8 strings utilities
 * 
 * Based on code from https://stackoverflow.com/a/43271130
 * 
 * @author Chris Ashurst
 */
import { TextEncoder, TextDecoder } from 'util';
/** Approximation of window.atob (convert ascii to bytes) */

const atob = value => Buffer.from(value, 'base64').toString('binary');
/** Convert unicode 'ascii' to bytes */


const u_atob = ascii => Uint8Array.from(atob(ascii), char => char.charCodeAt(0));
/** Approximation of window.btoa (convert bytes to ascii) */


const btoa = value => (value instanceof Buffer && value || Buffer.from(value.toString(), 'binary')).toString('base64');
/** Convert bytes to unicode 'ascii' */


const u_btoa = buffer => btoa(new Uint8Array(buffer).reduce((arr, byte) => [...arr, String.fromCharCode(byte)], []).join(''));

const encodeStr = value => new TextEncoder().encode(value);

const decodeStr = value => new TextDecoder().decode(value);
/** Encodes a string (ascii or utf8) to an ascii base64 string */


export const base64Encode = value => u_btoa(encodeStr(value));
/** Decodes an ascii base64 string to a string (ascii or utf8) */

export const base64Decode = value => decodeStr(u_atob(value));

const padHex = value => `${value.length % 2 === 1 && '0' || ''}${value}`;

const encodeInt = value => Buffer.from(padHex(parseInt(value).toString(16)), 'hex');

const decodeInt = value => parseInt(Buffer.from(value).toString('hex'), 16);
/** Encodes a number to an ascii base64 string */


export const base64EncodeInt = value => u_btoa(encodeInt(value));
/** Decodes an ascii base64 string to a number */

export const base64DecodeInt = value => decodeInt(u_atob(value));
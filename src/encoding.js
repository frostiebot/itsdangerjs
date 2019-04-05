// https://github.com/commenthol/url-safe-base64/blob/master/src/index.js
// const ENCODED = { '+': '-', '/': '-', '=': '.' }
// const DECODED = { '-': '+', '_': '/', '.': '=' }

// export const encode = string => string.replace(/[+/=]/g, m => ENCODED[m])
// export const decode = string => string.replace(/[-_.]/g, m => DECODED[m])

export const base64encode = (string = '') => Buffer.from(string).toString('base64')

export const base64decode = (string = '') => Buffer.from(string, 'base64').toString('utf8')

export const base64urlencode = string => base64encode(string).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

export const base64urldecode = (string) => {
  string = string.replace(/-/g, '+').replace(/_/g, '/')
  while (string.length % 4)
    string += '='
  return base64decode(string)
}

export const base64encodeNumber = (number) => {
  let hex = parseInt(number).toString(16)
  if (hex.length % 2 === 1)
    hex = '0' + hex
  return Buffer.from(hex, 'hex').toString('base64')
}

export const base64decodeNumber = string => parseInt(Buffer.from(string, 'base64').toString('hex'), 16)

export const base64urlencodeNumber = number => base64encodeNumber(number).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

export const base64urldecodeNumber = (string) => {
  string = string = string.replace(/-/g, '+').replace(/_/g, '/')
  while (string.length % 4)
    string += '='
  return base64decodeNumber(string)
}

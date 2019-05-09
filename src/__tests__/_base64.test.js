import {
  base64Encode,
  base64Decode,
  base64EncodeInt,
  base64DecodeInt,
} from '../_base64'

test('it works with a single plain unicode symbol', () => {
  const input = '✔'
  const base64 = base64Encode(input)
  const output = base64Decode(base64)

  expect(base64).toEqual('4pyU')
  expect(output).toEqual(input)
})

test('it works with plain unicode symbols', () => {
  const input = '👨‍👩‍👧‍👦,✔,☀️,🔥'
  const base64 = base64Encode(input)
  const output = base64Decode(base64)

  expect(base64).toEqual('8J+RqOKAjfCfkanigI3wn5Gn4oCN8J+RpizinJQs4piA77iPLPCflKU=')
  expect(output).toEqual(input)
})

test('it works with a mix of ascii, escaped unicode and plain unicode symbols', () => {
  const input = 'Base 64 \u2014 Mozilla Developer Network ✔'
  const base64 = base64Encode(input)
  const output = base64Decode(base64)

  expect(base64).toEqual('QmFzZSA2NCDigJQgTW96aWxsYSBEZXZlbG9wZXIgTmV0d29yayDinJQ=')
  expect(output).toEqual(input)
})

test('it works with a plain ascii string', () => {
  const input = 'Base 64 is Pretty Radical'
  const base64 = base64Encode(input)
  const output = base64Decode(base64)

  expect(base64).toEqual('QmFzZSA2NCBpcyBQcmV0dHkgUmFkaWNhbA==')
  expect(output).toEqual(input)
})

test('it works with integers when they are passed in', () => {
  const input = 1556919789
  const base64 = base64EncodeInt(input)
  const output = base64DecodeInt(base64)

  expect(base64).toEqual('XMy17Q==')
  expect(output).toEqual(input)
})

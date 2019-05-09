import {
  URLSafeBase64Encode,
  URLSafeBase64Decode,
  URLSafeBase64EncodeInt,
  URLSafeBase64DecodeInt,
  base64AlphabetIncludes,
} from '../encoding'

// import { BadData } from '../error'

// (0, b""), (192, b"\xc0"), (18446744073709551615, b"\xff" * 8)

const ASCII_STRING = 'abc ABC'
const ASCII_BASE64 = 'YWJjIEFCQw'

const UTF8_STRING = '👨‍👩‍👧‍👦,✔,☀️,🔥'
const UTF8_BASE64 = '8J-RqOKAjfCfkanigI3wn5Gn4oCN8J-RpizinJQs4piA77iPLPCflKU'

const TT_INT = 1556919789
const TT_BASE64 = 'XMy17Q'

test('URLSafeBase64Encode(value)', () => {
  expect(URLSafeBase64Encode(ASCII_STRING)).toEqual(ASCII_BASE64)
  expect(URLSafeBase64Encode(UTF8_STRING)).toEqual(UTF8_BASE64)
})
test('URLSafeBase64Decode(value)', () => {
  expect(URLSafeBase64Decode(ASCII_BASE64)).toEqual(ASCII_STRING)
  expect(URLSafeBase64Decode(UTF8_BASE64)).toEqual(UTF8_STRING)
})

test('URLSafeBase64EncodeInt(value)', () => {
  expect(URLSafeBase64EncodeInt(TT_INT)).toEqual(TT_BASE64)
})

test('URLSafeBase64DecodeInt(value)', () => {
  expect(URLSafeBase64DecodeInt(TT_BASE64)).toEqual(TT_INT)
})

test('base64AlphabetIncludes(byte)', () => {
  expect(base64AlphabetIncludes('_')).toBeTruthy()
  expect(base64AlphabetIncludes('-')).toBeTruthy()
  expect(base64AlphabetIncludes('=')).toBeTruthy()
})

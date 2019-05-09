import { Signer } from '../signer'

import { HashAlgorithm, HmacAlgorithm, NoneAlgorithm } from '../algorithms'

import { BadSignature } from '../error'

import { rsplit } from '../utils'

let signer

beforeEach(() => {
  signer = Signer('my-secret')
})

test('basic sign and unsign operations', () => {
  const signed = signer.sign('my string')
  expect(signer.validate(signed)).toBeTruthy()
  expect(signer.unsign(signed)).toEqual('my string')
})

test('no separator', () => {
  const signed = signer.sign('my string')
  const broken = signed.replace('.', '*')
  expect(signer.validate(broken)).not.toBeTruthy()
  expect(() => signer.unsign(broken)).toThrow(BadSignature)
})

test('broken signature', () => {
  const signed = signer.sign('b')

  let badSigned = [ ...signed ]
  badSigned.pop(-1)
  badSigned = badSigned.join('')
  let badSignature = rsplit(badSigned, '.')[1]

  expect(signer.verifySignature('b', badSignature)).not.toBeTruthy()
  expect(() => signer.unsign(badSigned)).toThrow(BadSignature)
})

test('changed value', () => {
  const signed = signer.sign('my string')
  const broken = signed.replace('my', 'other')
  expect(signer.validate(broken)).not.toBeTruthy()
  expect(() => signer.unsign(broken)).toThrow(BadSignature)
})

test('invalid separator', () => {
  expect(() => Signer('my-secret', { sep: '-' })).toThrow(/The given separator cannot be used/)
})

test('key derivation', () => {
  let kdSigner
  for (const keyDerivation of [ 'concat', 'django-concat', 'hmac', 'none' ]) {
    kdSigner = Signer('my-secret', { keyDerivation })
    expect(kdSigner.unsign(kdSigner.sign('value'))).toEqual('value')
  }
})

test('invalid key derivation', () => {
  expect(() => Signer('my-secret', { keyDerivation: 'invalid' }).deriveKey()).toThrow(/Unknown key derivation method/)
})

test('digest method', () => {
  const dSigner = Signer('my-secret', { digestMethod: 'md5' })
  expect(dSigner.unsign(dSigner.sign('value'))).toEqual('value')
})

test('algorithm', () => {
  let aSigner
  for (const algorithm of [null, NoneAlgorithm(), HmacAlgorithm(), HashAlgorithm()/*, _ReverseAlgorithm()*/]) {
    aSigner = Signer('my-secret', { algorithm })
    expect(aSigner.unsign(aSigner.sign('value'))).toEqual('value')
  }
})

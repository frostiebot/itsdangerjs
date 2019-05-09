import { Serializer } from '../serializer'

import { BadPayload, BadSignature } from '../error'

import { rsplit } from '../utils'

let serializer, obj

const makeObj = () => ({ a: 'b', c: 123, d: true, e: [4, 5, 6] })

beforeEach(() => {
  serializer = Serializer('my-secret')
  obj = makeObj()
})

test('serializer', () => {
  for (const value of [null, true, 'str', [1, 2, 3], { a: 123 }]) {
    expect(serializer.loads(serializer.dumps(value))).toEqual(value)
  }
})

test('changed value', () => {
  const signed = serializer.dumps(obj)

  expect(serializer.loads(signed)).toEqual(obj)

  const changed = signed.toUpperCase()
  expect(() => serializer.loads(changed)).toThrow(BadSignature)
})

test('bad signature error', () => {
  const signed = serializer.dumps(obj)

  let badSigned = [ ...signed ]
  badSigned.pop(-1)
  badSigned = badSigned.join('')

  expect(() => serializer.loads(badSigned)).toThrow(BadSignature)

})

test('bad payload error', () => {
  const signed = serializer.dumps(obj)
  let [payload, _] = rsplit(signed, '.') // eslint-disable-line

  let badPayload = [ ...payload ]
  badPayload.pop(-1)
  badPayload = badPayload.join('')


  const bad = serializer.makeSigner().sign(badPayload)

  expect(() => serializer.loads(bad)).toThrow(BadPayload)
})

test('alt salt', () => {
  const signed = serializer.dumps(obj, 'other')

  expect(() => serializer.loads(signed)).toThrow(BadSignature)

  expect(serializer.loads(signed, 'other')).toEqual(obj)
})

test('signer kwargs', () => {
  const other = Serializer('my-secret', { signerOptions: { keyDerivation: 'hmac' } })
  expect(other.loads(other.dumps(obj))).toEqual(obj)
  expect(other.dumps('value')).not.toEqual(serializer.dumps('value'))
})

test('digests', () => {
  const defaultValue = Serializer('my-secret').dumps([42])
  const sha1Value= Serializer('my-secret', { signerOptions: { digestMethod: 'sha1' } }).dumps([42])
  const sha512Value = Serializer('my-secret', { signerOptions: { digestMethod: 'sha512' } }).dumps([42])

  expect(defaultValue).toEqual(sha1Value)
  expect(sha1Value).toEqual('[42].MlDDs8KJw5FmwqDCq2BDd8OnwolZYcOxwqbCv8Ofw40')
  expect(sha512Value).toEqual('[42].ZcOXP8O7BGJtUGvCsMKuw73Cr1zCgyZWw4bCgR_Co043wpnCm8OMw6wpwprCu8KbRTV9UxPCjn9HIcK1fDYALWgbYyzDqmnDlMOOw71CCsOJw7cLeMKtw6xEwo0')
})

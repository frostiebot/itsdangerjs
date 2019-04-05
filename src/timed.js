import Json from './json'

import {
  base64encodeNumber,
  base64decodeNumber,
} from './encoding'

import { _Signer } from './signer'
import { _Serializer } from './serializer'

const EPOCH = 1293840000

export class _TimestampSigner extends _Signer {
  constructor(...args) { super(...args) }

  getTimestamp() {
    return Date.now() - EPOCH
  }

  timestampToDate(timestamp) {
    return new Date(timestamp + EPOCH)
  }

  sign(value) {
    const timestamp = base64encodeNumber(this.getTimestamp())
    return super.sign(`${value}${this.sep}${timestamp}`)
  }

  unsign(signedValue, maxAge, returnTimestamp = false) {
    //TODO: Wrap with all the try/catch junk we basically skipped over
    const result = super.unsign(signedValue)

    let [value, timestamp] = result.split(this.sep)

    timestamp = base64decodeNumber(timestamp)

    if (maxAge) {
      const age = this.getTimestamp() - timestamp
      if (age > maxAge) {
        throw new Error(`SignatureExpired: Signature age ${age} > ${maxAge}`)
      }
    }

    if (returnTimestamp) {
      return [value, this.timestampToDate(timestamp)]
    }

    return [value]
  }

  validate(signedValue, maxAge) {
    try {
      this.unsign(signedValue, maxAge)
      return true
    } catch (error) {
      return false
    }
  }
}

export const TimestampSigner = (secretKey, salt = 'itsdangerjs.Signer', sep = '.', digestMethod = 'sha512', algorithm) => new _TimestampSigner(secretKey, { salt, sep, digestMethod, algorithm })

export class _TimedSerializer extends _Serializer {
  constructor(...args) { super(...args) }

  loads(s, maxAge, returnTimestamp = false, salt) {
    const signer = this.makeSigner(salt)
    const [value, timestamp] = signer.unsign(s, maxAge, true)
    const payload = this.loadPayload(value)
    if (returnTimestamp) {
      return [payload, timestamp]
    }
    return payload
  }
}

export const TimedSerializer = (secretKey, salt = 'itsdangerjs', serializer = Json, signer = TimestampSigner) => new _TimedSerializer(secretKey, salt, { serializer, signer })

import {
  createHmac,
  timingSafeEqual,
} from 'crypto'

import {
  base64urlencode,
  base64urldecode,
} from './encoding'

class _HMACAlgorithm {
  constructor(digestMethod = 'sha512') {
    this.digestMethod = digestMethod
  }

  getSignature(key, value) {
    const hmac = createHmac(this.digestMethod, key)
    hmac.update(value)
    return hmac.digest('binary')
  }

  verifySignature(key, value, signature) {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(this.getSignature(key, value)))
  }
}

const HMACAlgorithm = digestMethod => new _HMACAlgorithm(digestMethod)

export class _Signer {
  constructor(secretKey, { sep = '.', salt = 'itsdangerjs.Signer', digestMethod = 'sha512', algorithm }) {
    this.secretKey = secretKey
    this.sep = sep
    this.salt = salt

    // this.keyDerivation = keyDerivation
    this.digestMethod = digestMethod
    this.algorithm = algorithm || HMACAlgorithm(this.digestMethod)
  }

  deriveKey() {
    //TODO: See itsdangerous.Signer to see other key derivation methods
    // As of right now, we'll just use HMAC
    return HMACAlgorithm(this.digestMethod).getSignature(this.secretKey, this.salt)
  }

  getSignature(value) {
    const key = this.deriveKey()
    const signature = this.algorithm.getSignature(key, value)
    return base64urlencode(signature)
  }

  sign(value) {
    return `${value}${this.sep}${this.getSignature(value)}`
  }

  verifySignature(value, signature) {
    const key = this.deriveKey()
    signature = base64urldecode(signature)
    return this.algorithm.verifySignature(key, value, signature)
  }

  unsign(signedValue) {
    if (!signedValue.includes(this.sep))
      throw new Error('No separator found in value')

    // this should be rsplit(this.sep, 1) like python
    let [value, timestamp, signature] = signedValue.split(this.sep)
    if (value && timestamp && signature) {
      value = `${value}${this.sep}${timestamp}`
    } else {
      signature = timestamp
    }

    if (this.verifySignature(value, signature))
      return value

    throw new Error('Signature does not match')
  }

  validate(signedValue) {
    try {
      this.unsign(signedValue)
      return true
    } catch (error) {
      return false
    }
  }
}

export const Signer = (secretKey, salt = 'itsdangerjs.Signer', sep = '.', digestMethod = 'sha512', algorithm) => new _Signer(secretKey, { salt, sep, digestMethod, algorithm })

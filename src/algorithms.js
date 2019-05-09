/**
 * Algorithms for signing and comparing values with signatures
 * 
 * @todo this needs a factory function
 * 
 * @module algorithms
 */

import {
  createHash,
  createHmac,
  getHashes,
  timingSafeEqual,
} from 'crypto'

const HASHES = getHashes()

export const KeyDerivations = {
  CONCAT: 'concat',
  DJANGO: 'django-concat',
  HMAC: 'hmac',
  NONE: 'none',
}

const createKeyDerivation = (keyDerivation, key, value) => {
  return {
    [KeyDerivations.CONCAT]: (key, value) => `${value}${key}`,
    [KeyDerivations.DJANGO]: (key, value) => `${value}signer${key}`,
  }[keyDerivation](key, value)
}

/**
 * Subclasses must implement `getSignature` to provide signature generation functionality.
 */
class SigningAlgorithm {
  /**
   * Returns the signature for the given key and value.
   */
  getSignature() {
    throw new Error('Not Implemented')
  }

  /**
   * Verifies the given signature matches the expected signature.
   * @param {string} key 
   * @param {string} value 
   * @param {string} signature 
   * @return {boolean}
   */
  verifySignature(key, value, signature) {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(this.getSignature(key, value)))
  }
}

/**
 * Provides an algorithm using the `crypto.Hash` hashing method for any supported digest.
 * @extends {module:algorithms~SigningAlgorithm}
 */ 
class HashSigningAlgorithm extends SigningAlgorithm {
  /**
   * 
   * @param {string} [digestMethod="sha1"]
   * @param {string} [keyDerivation="django-concat"]
   */
  constructor(digestMethod = 'sha1', keyDerivation = 'django-concat') {
    super()
    this.keyDerivation = keyDerivation
    this.digestMethod = HASHES.includes(digestMethod) && digestMethod || 'sha1'
  }

  getSignature(key, value) {
    const keyValue = createKeyDerivation(this.keyDerivation, key, value)
    return createHash(this.digestMethod).update(keyValue).digest('binary')
  }
}

/**
 * Factory function for returning instances an Hash algorithm
 * @param {string} digestMethod
 * @param {string} keyDerivation
 * @return {module:algorithms~HashSigningAlgorithm}
 */
const HashAlgorithm = (digestMethod, keyDerivation) => new HashSigningAlgorithm(digestMethod, keyDerivation)

/**
 * Provides an algorithm using the {@link crypto.Hmac} hashing algorithm for any supported digest
 * @extends {module:algorithms~SigningAlgorithm}
 */ 
class HmacSigningAlgorithm extends SigningAlgorithm {
  /**
   * 
   * @param {string} [digestMethod="sha1"]
   */
  constructor(digestMethod = 'sha1') {
    super()
    this.digestMethod = HASHES.includes(digestMethod) && digestMethod || 'sha1'
  }

  getSignature(key, value) {
    return createHmac(this.digestMethod, key).update(value).digest('binary')
  }
}

/**
 * Factory function for returning instances an Hmac algorithm
 * @param {string} digestMethod
 * @return {module:algorithms~HmacSigningAlgorithm}
 */
const HmacAlgorithm = digestMethod => new HmacSigningAlgorithm(digestMethod)

/**
 * Provides an algorithm that does not perform any signing and returns an empty signature.
 * @extends {module:algorithms~SigningAlgorithm}
 */ 
class NoneSigningAlgorithm extends SigningAlgorithm {
  getSignature() {
    return ''
  }
}

/**
 * Factory function for returning instances of a no-op algorithm
 * @return {module:algorithms~NoneSigningAlgorithm}
 */
const NoneAlgorithm = () => new NoneSigningAlgorithm()

export {
  HashSigningAlgorithm,
  HmacSigningAlgorithm,
  NoneSigningAlgorithm,
  HashAlgorithm,
  HmacAlgorithm,
  NoneAlgorithm,
}

/**
 * Base Signer class and factory
 * 
 * @module signer
 */
import { KeyDerivations, HashAlgorithm, HmacAlgorithm } from './algorithms';
import { base64AlphabetIncludes, URLSafeBase64Encode, URLSafeBase64Decode } from './encoding';
import { BadSignature } from './error';
import { rsplit } from './utils';
/**
 * Signer Options
 * @typedef {object} SignerOptions
 * @property {string} [salt="itsdanger.Signer"] - Value to salt signature
 * @property {string} [sep="."] - Signed value delimiter
 * @property {string} [keyDerivation="django-concat"] - Method for deriving signing secret
 * @property {string} [digestMethod="sha1"] - Any hash as listed in `crypto.getHashes`
 * @property {function} [algorithm=HmacAlgorithm] - Algorithm function used to get and verify signatures
 */

/**
 * Base Signing class for subclassing
 */

export class BaseSigner {
  /**
   * 
   * @param {string} secretKey
   * @param {SigningOptions} options
   */
  constructor(secretKey, {
    salt = 'itsdanger.Signer',
    sep = '.',
    keyDerivation = KeyDerivations.DJANGO,
    digestMethod = 'sha1',
    algorithm
  } = {}) {
    this.secretKey = secretKey;
    this.salt = salt;
    this.sep = sep;

    if (base64AlphabetIncludes(this.sep)) {
      throw new Error('The given separator cannot be used because it may be contained in the signature itself. Alphanumeric characters and `-_=` must not be used.');
    }

    this.keyDerivation = keyDerivation;
    this.digestMethod = digestMethod;
    this.algorithm = algorithm || HmacAlgorithm(this.digestMethod);
  }

  deriveKey() {
    if ([KeyDerivations.CONCAT, KeyDerivations.DJANGO].includes(this.keyDerivation)) {
      return HashAlgorithm(this.digestMethod, this.keyDerivation).getSignature(this.secretKey, this.salt);
    }

    if (KeyDerivations.HMAC === this.keyDerivation) {
      return HmacAlgorithm(this.digestMethod).getSignature(this.secretKey, this.salt);
    }

    if (KeyDerivations.NONE === this.keyDerivation) {
      return this.secretKey;
    }

    throw new Error('Unknown key derivation method');
  }

  getSignature(value) {
    return URLSafeBase64Encode(this.algorithm.getSignature(this.deriveKey(), value));
  }

  sign(value) {
    return `${value}${this.sep}${this.getSignature(value)}`;
  }

  verifySignature(value, signature) {
    try {
      return this.algorithm.verifySignature(this.deriveKey(), value, URLSafeBase64Decode(signature));
    } catch (error) {
      return false;
    }
  }
  /**
   * @todo signedValue.includes _must_ be a string - when base class works with objects, it is not
   * @param {string} signedValue 
   */


  unsign(signedValue) {
    if (!signedValue.includes(this.sep)) {
      throw new BadSignature(`No '${this.sep}' found in value`);
    }

    const [value, signature] = rsplit(signedValue, this.sep);

    if (this.verifySignature(value, signature)) {
      return value;
    }

    throw new BadSignature(`Signature '${signature}' does not match`, value);
  }

  validate(signedValue) {
    try {
      this.unsign(signedValue);
      return true;
    } catch (error) {
      return false;
    }
  }

}
/**
 * Factory function for creating new instances of `BaseSigner`
 * @param {string} secretKey 
 * @param {SignerOptions} [options]
 * @return {BaseSigner}
 */

export const Signer = (secretKey, options = {}) => new BaseSigner(secretKey, options);
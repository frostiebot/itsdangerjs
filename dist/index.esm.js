import { getHashes, createHash, createHmac, timingSafeEqual } from 'crypto';
import { TextEncoder, TextDecoder } from 'util';

/**
 * Algorithms for signing and comparing values with signatures
 * 
 * @todo this needs a factory function
 * 
 * @module algorithms
 */
const HASHES = getHashes();
const KeyDerivations = {
  CONCAT: 'concat',
  DJANGO: 'django-concat',
  HMAC: 'hmac',
  NONE: 'none'
};

const createKeyDerivation = (keyDerivation, key, value) => {
  return {
    [KeyDerivations.CONCAT]: (key, value) => `${value}${key}`,
    [KeyDerivations.DJANGO]: (key, value) => `${value}signer${key}`
  }[keyDerivation](key, value);
};
/**
 * Subclasses must implement `getSignature` to provide signature generation functionality.
 */


class SigningAlgorithm {
  /**
   * Returns the signature for the given key and value.
   */
  getSignature() {
    throw new Error('Not Implemented');
  }
  /**
   * Verifies the given signature matches the expected signature.
   * @param {string} key 
   * @param {string} value 
   * @param {string} signature 
   * @return {boolean}
   */


  verifySignature(key, value, signature) {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(this.getSignature(key, value)));
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
    super();
    this.keyDerivation = keyDerivation;
    this.digestMethod = HASHES.includes(digestMethod) && digestMethod || 'sha1';
  }

  getSignature(key, value) {
    const keyValue = createKeyDerivation(this.keyDerivation, key, value);
    return createHash(this.digestMethod).update(keyValue).digest('binary');
  }

}
/**
 * Factory function for returning instances an Hash algorithm
 * @param {string} digestMethod
 * @param {string} keyDerivation
 * @return {module:algorithms~HashSigningAlgorithm}
 */


const HashAlgorithm = (digestMethod, keyDerivation) => new HashSigningAlgorithm(digestMethod, keyDerivation);
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
    super();
    this.digestMethod = HASHES.includes(digestMethod) && digestMethod || 'sha1';
  }

  getSignature(key, value) {
    return createHmac(this.digestMethod, key).update(value).digest('binary');
  }

}
/**
 * Factory function for returning instances an Hmac algorithm
 * @param {string} digestMethod
 * @return {module:algorithms~HmacSigningAlgorithm}
 */


const HmacAlgorithm = digestMethod => new HmacSigningAlgorithm(digestMethod);

/**
 * Base64 / binary data / utf8 strings utilities
 * 
 * Based on code from https://stackoverflow.com/a/43271130
 * 
 * @author Chris Ashurst
 */
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


const base64Encode = value => u_btoa(encodeStr(value));
/** Decodes an ascii base64 string to a string (ascii or utf8) */

const base64Decode = value => decodeStr(u_atob(value));

const padHex = value => `${value.length % 2 === 1 && '0' || ''}${value}`;

const encodeInt = value => Buffer.from(padHex(parseInt(value).toString(16)), 'hex');

const decodeInt = value => parseInt(Buffer.from(value).toString('hex'), 16);
/** Encodes a number to an ascii base64 string */


const base64EncodeInt = value => u_btoa(encodeInt(value));
/** Decodes an ascii base64 string to a number */

const base64DecodeInt = value => decodeInt(u_atob(value));

/**
 * String/Number encoding/decoding utilities
 * 
 * The goal is for inputs to return values that are equivalent
 * to their python counterparts in `itsdangerous`
 */

const BASE64_LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE64_NUMBERS = '0123456789';
const BASE64_SYMBOLS = '-_=';
const BASE64_ALPHABET = Buffer.from([...BASE64_LETTERS, ...BASE64_NUMBERS, ...BASE64_SYMBOLS].join(''), 'ascii');
const BASE64_SYMBOL_REPLACEMENTS = {
  '+': '-',
  '/': '_',
  '-': '+',
  '_': '/',
  '=': ''
};
const BASE64_TO_URL_SAFE_RE = /[+/=]/g;
const BASE64_FROM_URL_SAFE_RE = /[-_]/g;

const replaceSymbol = symbol => BASE64_SYMBOL_REPLACEMENTS[symbol];

const replaceSymbols = regex => value => value.replace(regex, replaceSymbol);

const makeURLSafe = replaceSymbols(BASE64_TO_URL_SAFE_RE);
const makeURLUnsafe = replaceSymbols(BASE64_FROM_URL_SAFE_RE);
/**
 * Encodes a string (ascii or utf8) to a URL-safe ascii base64 string
 * @param {string} value
 * @return {string}
 */

const URLSafeBase64Encode = value => makeURLSafe(base64Encode(value));
/**
 * Decodes a URL-safe ascii base64 string to a string (ascii or utf8)
 * @param {string} value
 * @return {string}
 */

const URLSafeBase64Decode = value => base64Decode(makeURLUnsafe(value));
/**
 * Encodes a number to a URL-safe ascii base64 string
 * @param {number} value
 * @return {string}
 */

const URLSafeBase64EncodeInt = value => makeURLSafe(base64EncodeInt(value));
/**
 * Decodes a URL-safe ascii base64 string to a number
 * @param {string} value
 * @return {number}
 */

const URLSafeBase64DecodeInt = value => base64DecodeInt(makeURLUnsafe(value));
/**
 * Checks if `byte` is present within the standard ascii-encoded base64 'alphabet'
 * @param {Buffer} byte
 * @return {boolean}
 */

const base64AlphabetIncludes = byte => BASE64_ALPHABET.includes(byte);

/**
 * Base error to allow subclassing and proper stacktrace capture
 * @extends {Error}
 */
class BaseError extends Error {
  constructor(...args) {
    super(...args);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

}
/**
 * Raised if bad data of any sort was encountered.
 * @extends {BaseError}
 */


class BadData extends BaseError {
  constructor(message) {
    super(message);
  }

}
/**
 * Raised if a signature does not match.
 * @extends {BadData}
 */

class BadSignature extends BadData {
  constructor(message, payload = null) {
    super(message);
    /**
     * The payload that failed the signature test.
     * In some situations you might still want to inspect this, even if you know it was tampered with.
     */

    this.payload = payload;
  }

}
/**
 * Raised if a time-based signature is invalid.
 * @extends {BadSignature}
 */

class BadTimeSignature extends BadSignature {
  constructor(message, payload = null, dateSigned = null) {
    super(message, payload);
    /**
     * If the signature expired this exposes the date of when the signature was created.
     * This can be helpful in order to tell the user how long a link has been gone stale.
     */

    this.dateSigned = dateSigned;
  }

}
/**
 * Raised if a signature timestamp is older than `maxAge`.
 * @extends {BadTimeSignature}
 */

class SignatureExpired extends BadTimeSignature {}
/**
 * Raised if a payload is invalid.
 * This could happen if the payload is loaded despite an invalid signature, or if there is a mismatch between the serializer and deserializer.
 * The original error that occurred during loading is stored on as `originalError`.
 * @extends {BadData}
 */

class BadPayload extends BadData {
  constructor(message, originalError = null) {
    super(message);
    /**
     * If available, the error that indicates why the payload was not valid.
     * This might be `null`.
     * @type {?Error}
     */

    this.originalError = originalError;
  }

}

/**
 * Splits a string by `delimiter` from the right
 * 
 * This is a "dumb" implementation in that we split only once. I have my reasons.
 * @param {string} str 
 * @param {string} delim
 * @return {Array<string>}
 */
const rsplit = (str, delim) => {
  const arr = str.split(delim);
  const last = arr.pop(-1);
  return [arr.join(delim), last];
};
const required = name => {
  throw new Error(`Argument '${name}' is required.'`);
};

/**
 * Base Signer class and factory
 * 
 * @module signer
 */
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

class BaseSigner {
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

const Signer = (secretKey, options = {}) => new BaseSigner(secretKey, options);

/**
 * Normalized interface to JSON builtins.
 * 
 */

/**
 * An interface for serializing
 * @typedef {object} SerializerLike
 * @property {value: any => string} dumps
 * @property {text: string => any} loads
 */

/** @type {typeof SerializerLike} */
const Json = {
  dumps: value => JSON.stringify(value, null, 0),
  loads: text => JSON.parse(text)
};

/**
 * Base Serializer class and factory
 * 
 * @module serializer
 */
/**
 * Serializer Options
 * @typedef {object} SerializerOptions
 * @property {string} [salt="itsdanger.Serializer"] - Value to salt signature
 * @property {import('./_json').SerializerLike} [serializer=Json] - Signed value delimiter
 * @property {Signer} [signer=Signer] - Method for deriving signing secret
 * @property {import('./signer').SignerOptions} [signerOptions] - Options to pass to {@link Signer}
 */

/**
 * Base Serializing class for subclassing
 */

class BaseSerializer {
  /**
   * @param {string} secretKey
   * @param {SerializerOptions} [options]
   */
  constructor(secretKey, {
    salt = 'itsdanger.Serializer',
    serializer = Json,
    signer = Signer,
    signerOptions = {}
  } = {}) {
    this.secretKey = secretKey;
    this.salt = salt;
    this.serializer = serializer;
    this.signer = signer;
    this.signerOptions = signerOptions;
  }

  makeSigner(salt) {
    salt = salt || this.salt;
    return this.signer(this.secretKey, { ...this.signerOptions,
      salt
    });
  }

  dumpPayload(obj) {
    return this.serializer.dumps(obj);
  }

  loadPayload(payload, serializer) {
    try {
      return (serializer || this.serializer).loads(payload);
    } catch (error) {
      throw new BadPayload('Could not load the payload because an exception occurred on unserializing the data.', error);
    }
  }

  dumps(value, salt) {
    return this.makeSigner(salt).sign(this.dumpPayload(value));
  }

  loads(value, salt) {
    return this.loadPayload(this.makeSigner(salt).unsign(value));
  }

}
/**
 * 
 * @type {(secretKey: string, options?: SerializerOptions) => BaseSerializer}
 */

const Serializer = (secretKey, options) => new BaseSerializer(secretKey, options);

/** 
 * Returns the number of seconds since the epoch
 * @return {number} Seconds since the epoch
 */
const toTimestamp = () => Math.floor(Date.now() / 1000);
/**
 * Returns a new `Date` instance for the timestamp
 * @param {number} timestamp - Seconds since the epoch
 * @return {Date}
 */


const fromTimestamp = timestamp => new Date(timestamp * 1000);

var Time = {
  toTimestamp,
  fromTimestamp
};

/**
 * Time-based Signer and Serializer classes + factories
 */
class BaseTimestampSigner extends BaseSigner {
  constructor(secretKey = required('secretKey'), {
    salt = 'itsdanger.Signer',
    sep = '.',
    keyDerivation = 'django-concat',
    digestMethod = 'sha1',
    algorithm,
    time = Time
  } = {}) {
    super(secretKey, {
      salt,
      sep,
      keyDerivation,
      digestMethod,
      algorithm
    });
    this.time = time;
  }

  getTimestamp() {
    return this.time.toTimestamp();
  }

  timestampToDate(timestamp) {
    return this.time.fromTimestamp(timestamp);
  }

  sign(value) {
    return super.sign(`${value}${this.sep}${URLSafeBase64EncodeInt(this.getTimestamp())}`);
  }

  unsign(signedValue, maxAge, returnTimestamp = false) {
    const result = super.unsign(signedValue);

    if (!result.includes(this.sep)) {
      throw new BadTimeSignature('timestamp missing', result);
    }

    let [value, timestamp] = rsplit(result, this.sep);
    timestamp = URLSafeBase64DecodeInt(timestamp);

    if (maxAge) {
      const age = this.getTimestamp() - timestamp;

      if (age > maxAge) {
        throw new SignatureExpired(`Signature age ${age} > ${maxAge} seconds`, value, this.timestampToDate(timestamp));
      }
    }

    if (returnTimestamp) {
      return [value, this.timestampToDate(timestamp)];
    }

    return [value];
  }

  validate(signedValue, maxAge) {
    try {
      this.unsign(signedValue, maxAge);
      return true;
    } catch (error) {
      return false;
    }
  }

}
/**
 * 
 * @param {string} secretKey 
 * @param {object} options
 * @param {string} [options.salt=itsdanger.Signer]
 * @param {string} [options.sep=.]
 * @param {string} [options.keyDerivation=django-concat]
 * @param {string} [options.digestMethod=sha1]
 * @param {function} [options.algorithm=HmacAlgorithm]
 */

const TimestampSigner = function (secretKey, options = {}) {
  return new BaseTimestampSigner(secretKey, options);
};
class BaseTimedSerializer extends BaseSerializer {
  constructor(secretKey = required('secretKey'), {
    salt = 'itsdanger.Serializer',
    serializer = Json,
    signerArgs = {}
  } = {}) {
    super(secretKey, {
      salt,
      serializer,
      signer: TimestampSigner,
      signerArgs
    });
  }

  loads(signedValue, maxAge, returnTimestamp = false, salt) {
    const signer = super.makeSigner(salt);
    const [value, timestamp] = signer.unsign(signedValue, maxAge, true);
    const payload = this.loadPayload(value);

    if (returnTimestamp) {
      return [payload, timestamp];
    }

    return payload;
  }

}
/**
 * 
 * @param {string} secretKey 
 * @param {object} options
 * @param {string} [options.salt='itsdanger.Serializer']
 * @param {function} [options.serializer=Json]
 * @param {object} [options.signerArgs]
 * @param {string} [options.signerArgs.sep]
 * @param {string} [options.signerArgs.keyDerivation]
 * @param {string} [options.signerArgs.digestMethod]
 * @param {function} [options.signerArgs.algorithm]
 */

const TimedSerializer = function (secretKey, options = {}) {
  return new BaseTimedSerializer(secretKey, options);
};

const URLSafeSerializerMixin = Base => class extends Base {
  constructor(secretKey = required('secretKey'), {
    salt,
    serializer,
    signer,
    signerArgs
  } = {}) {
    super(secretKey, {
      salt,
      serializer,
      signer,
      signerArgs
    });
  }

  dumpPayload(obj) {
    return URLSafeBase64Encode(super.dumpPayload(obj));
  }

  loadPayload(payload, serializer) {
    return super.loadPayload(URLSafeBase64Decode(payload), serializer);
  }

};

const BaseURLSafeSerializer = URLSafeSerializerMixin(BaseSerializer);
/**
 * 
 * @param {string} secretKey 
 * @param {object} options
 * @param {string} [options.salt='itsdanger.Serializer']
 * @param {function} [options.serializer=Json]
 * @param {function} [option.signer=Signer]
 * @param {object} [options.signerArgs]
 * @param {string} [options.signerArgs.sep]
 * @param {string} [options.signerArgs.keyDerivation]
 * @param {string} [options.signerArgs.digestMethod]
 * @param {function} [options.signerArgs.algorithm]
 */

const URLSafeSerializer = function (secretKey, options = {}) {
  return new BaseURLSafeSerializer(secretKey, options);
};
const BaseURLSafeTimedSerializer = URLSafeSerializerMixin(BaseTimedSerializer);
/**
 * 
 * @param {string} secretKey 
 * @param {object} options
 * @param {string} [options.salt='itsdanger.Serializer']
 * @param {function} [options.serializer=Json]
 * @param {object} [options.signerArgs]
 * @param {string} [options.signerArgs.sep]
 * @param {string} [options.signerArgs.keyDerivation]
 * @param {string} [options.signerArgs.digestMethod]
 * @param {function} [options.signerArgs.algorithm]
 */

const URLSafeTimedSerializer = function (secretKey, options = {}) {
  return new BaseURLSafeTimedSerializer(secretKey, options);
};

export { Serializer, Signer, TimedSerializer, TimestampSigner, URLSafeSerializer, URLSafeTimedSerializer };

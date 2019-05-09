/**
 * Time-based Signer and Serializer classes + factories
 */
import Json from './_json';
import Time from './_time';
import { BaseSigner } from './signer';
import { BaseSerializer } from './serializer';
import { URLSafeBase64EncodeInt, URLSafeBase64DecodeInt } from './encoding';
import { BadTimeSignature, SignatureExpired } from './error';
import { required, rsplit } from './utils';
export class BaseTimestampSigner extends BaseSigner {
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

export const TimestampSigner = function (secretKey, options = {}) {
  return new BaseTimestampSigner(secretKey, options);
};
export class BaseTimedSerializer extends BaseSerializer {
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

export const TimedSerializer = function (secretKey, options = {}) {
  return new BaseTimedSerializer(secretKey, options);
};
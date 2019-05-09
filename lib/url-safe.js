import { BaseSerializer } from './serializer';
import { BaseTimedSerializer } from './timed';
import { URLSafeBase64Encode, URLSafeBase64Decode } from './encoding';
import { required } from './utils';

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

export const BaseURLSafeSerializer = URLSafeSerializerMixin(BaseSerializer);
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

export const URLSafeSerializer = function (secretKey, options = {}) {
  return new BaseURLSafeSerializer(secretKey, options);
};
export const BaseURLSafeTimedSerializer = URLSafeSerializerMixin(BaseTimedSerializer);
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

export const URLSafeTimedSerializer = function (secretKey, options = {}) {
  return new BaseURLSafeTimedSerializer(secretKey, options);
};
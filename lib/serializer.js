/**
 * Base Serializer class and factory
 * 
 * @module serializer
 */
import Json from './_json';
import { Signer } from './signer';
import { BadPayload } from './error';
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

export class BaseSerializer {
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

export const Serializer = (secretKey, options) => new BaseSerializer(secretKey, options);
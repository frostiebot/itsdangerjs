import Json from './json'

import { Signer } from './signer'

export class _Serializer {
  constructor(secretKey, salt = 'itsdangerjs', { serializer = Json, signer = Signer }) {
    this.secretKey = secretKey
    this.salt = salt

    this.serializer = serializer
    this.signer = signer
  }

  loadPayload(payload, serializer) {
    if (!serializer)
      serializer = this.serializer

    try {
      return serializer.loads(payload)
    } catch (error) {
      throw new Error('BadPayload - Could not load the payload because an exception occurred on unserializing the data.')
    }
  }

  dumpPayload(obj) {
    return this.serializer.dumps(obj)
  }

  makeSigner(salt) {
    if (!salt)
      salt = this.salt

    return this.signer(this.secretKey, salt)
  }

  dumps(obj, salt) {
    const payload = this.dumpPayload(obj)
    return this.makeSigner(salt).sign(payload)
  }

  loads(s, salt) {
    return this.loadPayload(this.makeSigner(salt).unsign(s))
  }
}

export const Serializer = (secretKey, salt = 'itsdangerjs', serializer = Json, signer = Signer) => new _Serializer(secretKey, salt, { serializer, signer })

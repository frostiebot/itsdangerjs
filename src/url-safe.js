import Json from './json'

import {
  base64urlencode,
  base64urldecode,
} from './encoding'

import { Signer } from './signer'
import { _Serializer } from './serializer'
import { _TimedSerializer, TimestampSigner } from './timed'

export const _URLSafeSerializerMixin = Base => class extends Base {
  constructor(...args) { super(...args) }

  loadPayload(payload, ...args) {
    //TODO: Add try/catch situations
    //TODO: Add decompress with zlib
    const json = base64urldecode(payload)
    return super.loadPayload(json, ...args)
  }

  dumpPayload(obj) {
    const json = super.dumpPayload(obj)
    return base64urlencode(json)
  }
}

export const _URLSafeSerializer = _URLSafeSerializerMixin(_Serializer)
export const _URLSafeTimedSerializer = _URLSafeSerializerMixin(_TimedSerializer)

export const URLSafeSerializer = (secretKey, salt = 'itsdangerjs', serializer = Json, signer = Signer) => new _URLSafeSerializer(secretKey, salt, { serializer, signer })
export const URLSafeTimedSerializer = (secretKey, salt = 'itsdangerjs', serializer = Json, signer = TimestampSigner) => new _URLSafeTimedSerializer(secretKey, salt, { serializer, signer })

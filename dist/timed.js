"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimedSerializer = exports._TimedSerializer = exports.TimestampSigner = exports._TimestampSigner = void 0;

var _json = _interopRequireDefault(require("./json"));

var _encoding = require("./encoding");

var _signer = require("./signer");

var _serializer = require("./serializer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EPOCH = 1293840000;

class _TimestampSigner extends _signer._Signer {
  constructor(...args) {
    super(...args);
  }

  getTimestamp() {
    return Date.now() - EPOCH;
  }

  timestampToDate(timestamp) {
    return new Date(timestamp + EPOCH);
  }

  sign(value) {
    const timestamp = (0, _encoding.base64encodeNumber)(this.getTimestamp());
    return super.sign(`${value}${this.sep}${timestamp}`);
  }

  unsign(signedValue, maxAge, returnTimestamp = false) {
    //TODO: Wrap with all the try/catch junk we basically skipped over
    const result = super.unsign(signedValue);
    let [value, timestamp] = result.split(this.sep);
    timestamp = (0, _encoding.base64decodeNumber)(timestamp);

    if (maxAge) {
      const age = this.getTimestamp() - timestamp;

      if (age > maxAge) {
        throw new Error(`SignatureExpired: Signature age ${age} > ${maxAge}`);
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

exports._TimestampSigner = _TimestampSigner;

const TimestampSigner = (secretKey, salt = 'itsdangerjs.Signer', sep = '.', digestMethod = 'sha512', algorithm) => new _TimestampSigner(secretKey, {
  salt,
  sep,
  digestMethod,
  algorithm
});

exports.TimestampSigner = TimestampSigner;

class _TimedSerializer extends _serializer._Serializer {
  constructor(...args) {
    super(...args);
  }

  loads(s, maxAge, returnTimestamp = false, salt) {
    const signer = this.makeSigner(salt);
    const [value, timestamp] = signer.unsign(s, maxAge, true);
    const payload = this.loadPayload(value);

    if (returnTimestamp) {
      return [payload, timestamp];
    }

    return payload;
  }

}

exports._TimedSerializer = _TimedSerializer;

const TimedSerializer = (secretKey, salt = 'itsdangerjs', serializer = _json.default, signer = TimestampSigner) => new _TimedSerializer(secretKey, salt, {
  serializer,
  signer
});

exports.TimedSerializer = TimedSerializer;
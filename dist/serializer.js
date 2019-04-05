"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Serializer = exports._Serializer = void 0;

var _json = _interopRequireDefault(require("./json"));

var _signer = require("./signer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class _Serializer {
  constructor(secretKey, salt = 'itsdangerjs', {
    serializer = _json.default,
    signer = _signer.Signer
  }) {
    this.secretKey = secretKey;
    this.salt = salt;
    this.serializer = serializer;
    this.signer = signer;
  }

  loadPayload(payload, serializer) {
    if (!serializer) serializer = this.serializer;

    try {
      return serializer.loads(payload);
    } catch (error) {
      throw new Error('BadPayload - Could not load the payload because an exception occurred on unserializing the data.');
    }
  }

  dumpPayload(obj) {
    return this.serializer.dumps(obj);
  }

  makeSigner(salt) {
    if (!salt) salt = this.salt;
    return this.signer(this.secretKey, salt);
  }

  dumps(obj, salt) {
    const payload = this.dumpPayload(obj);
    return this.makeSigner(salt).sign(payload);
  }

  loads(s, salt) {
    return this.loadPayload(this.makeSigner(salt).unsign(s));
  }

}

exports._Serializer = _Serializer;

const Serializer = (secretKey, salt = 'itsdangerjs', serializer = _json.default, signer = _signer.Signer) => new _Serializer(secretKey, salt, {
  serializer,
  signer
});

exports.Serializer = Serializer;
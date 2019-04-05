"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.URLSafeTimedSerializer = exports.URLSafeSerializer = exports._URLSafeTimedSerializer = exports._URLSafeSerializer = exports._URLSafeSerializerMixin = void 0;

var _json = _interopRequireDefault(require("./json"));

var _encoding = require("./encoding");

var _signer = require("./signer");

var _serializer = require("./serializer");

var _timed = require("./timed");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _URLSafeSerializerMixin = Base => class extends Base {
  constructor(...args) {
    super(...args);
  }

  loadPayload(payload, ...args) {
    //TODO: Add try/catch situations
    //TODO: Add decompress with zlib
    const json = (0, _encoding.base64urldecode)(payload);
    return super.loadPayload(json, ...args);
  }

  dumpPayload(obj) {
    const json = super.dumpPayload(obj);
    return (0, _encoding.base64urlencode)(json);
  }

};

exports._URLSafeSerializerMixin = _URLSafeSerializerMixin;

const _URLSafeSerializer = _URLSafeSerializerMixin(_serializer._Serializer);

exports._URLSafeSerializer = _URLSafeSerializer;

const _URLSafeTimedSerializer = _URLSafeSerializerMixin(_timed._TimedSerializer);

exports._URLSafeTimedSerializer = _URLSafeTimedSerializer;

const URLSafeSerializer = (secretKey, salt = 'itsdangerjs', serializer = _json.default, signer = _signer.Signer) => new _URLSafeSerializer(secretKey, salt, {
  serializer,
  signer
});

exports.URLSafeSerializer = URLSafeSerializer;

const URLSafeTimedSerializer = (secretKey, salt = 'itsdangerjs', serializer = _json.default, signer = _timed.TimestampSigner) => new _URLSafeTimedSerializer(secretKey, salt, {
  serializer,
  signer
});

exports.URLSafeTimedSerializer = URLSafeTimedSerializer;
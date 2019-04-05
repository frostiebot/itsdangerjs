# itsdangerjs
Javascript port of the Python itsdangerous module with influence from the ReallyDangerous javascript module

## Features
- Timestamp Signer
- URL Safe Signer
- Timestamp URL Safe Signer

## Usage

### Signer
```javascript
const itsdanger = require('itsdangerjs');
const signer = itsdanger.Signer('my-secret')
console.log(signer.sign('test'))
// 'test.XxfCnMKrwrLCgGzDnlXCjcKgw4vCjh8ow7oAfMOALxxAwoHCrnrCtcOswojCuVYBwp0DX8KlcW7ClMO7wpUeTWTDu8OOwofDhMO3wpgaQzpSw4Ukw6vCv8OoXl7Dig7DksKp'
console.log(signer.unsign('test.XxfCnMKrwrLCgGzDnlXCjcKgw4vCjh8ow7oAfMOALxxAwoHCrnrCtcOswojCuVYBwp0DX8KlcW7ClMO7wpUeTWTDu8OOwofDhMO3wpgaQzpSw4Ukw6vCv8OoXl7Dig7DksKp'))
// 'test'
```
#### itsdanger.Signer(secretKey[, salt, sep, digestMethod, algorithm])
* `secretKey` {String} Secret to be used
* `salt` {String} (default is 'itsdangerjs.Signer')
* `sep` {String} (default is '.')
* `digestMethod` {String} Digest method for signing (default is 'sha512')
* `algorithm` {Function|Class} Algorithm to use for hashing (default is HMAC) - see signer.js for details

#### signer.sign(value)
* `value` {String} The value to be signed

Returns signed string

#### signer.unsign(signedValue)
* `signedValue` {String} Signed value

Returns original value if signature is correct

### TimestampSigner
```javascript
const itsdanger = require('itsdangerjs');
const signer = new itsdanger.TimestampSigner('my-secret');

console.log(signer.sign('test'));
// 'test.AWmhAxll.MGV2wprCk2FkDgfCpsK8w6AZwoAAHwtYwofCjMKrwqwQSAAWOMKYZsKPw5tjFgbCg8KrOcOJwotgY3grW34lecKiaDvCkMOYNxfDuS9CZi8Mw4ksKMKH'
console.log(signer.unsign('test.AWmhAxll.MGV2wprCk2FkDgfCpsK8w6AZwoAAHwtYwofCjMKrwqwQSAAWOMKYZsKPw5tjFgbCg8KrOcOJwotgY3grW34lecKiaDvCkMOYNxfDuS9CZi8Mw4ksKMKH'));
// 'test'
console.log(signer.getTimestamp('test.AWmhAxll.MGV2wprCk2FkDgfCpsK8w6AZwoAAHwtYwofCjMKrwqwQSAAWOMKYZsKPw5tjFgbCg8KrOcOJwotgY3grW34lecKiaDvCkMOYNxfDuS9CZi8Mw4ksKMKH'));
// 1553184596753
```

#### itsdanger.TimestampSigner(secretKey[, salt, sep, digestMethod, algorithm])
* `secretKey` {String} Secret to be used
* `salt` {String} (default is 'itsdangerjs.Signer')
* `sep` {String} (default is '.')
* `digestMethod` {String} Digest method for signing (default is 'sha512')
* `algorithm` {Function|Class} Algorithm to use for hashing (default is HMAC) - see signer.js for details

#### signer.sign(value)
* `value` {String} The value to be signed

Returns signed string with timestamp

#### signer.unsign(signedValue[, maxAge, returnTimestamp])
* `signedValue` {String} Signed value
* `maxAge` {Number} Max age time in milliseconds
* `returnTimestamp` {Boolean} Return the timestamp used at creation (default is false)

Returns original value if signature is correct and age is less than maxAge (if defined)

### URLSafeSerializer
```javascript
const itsdanger = require('itsdangerjs');
const serializer = new itsdanger.URLSafeSerializer('my-secret');

console.log(serializer.dumps('test'));
// 'dGVzdA.TsKHw5E3w4fDh8O1w7PCv8Oxw4pYUDfDpcKfw5vDqABsMMK1EsOsw6MFWcOUwrbClcKYPCl7D1cNeTRtw48mwrDDuzzCuwvDkzIJHcKlC8OgJsK_H8OOw4bCoMOawofDvTU'
console.log(serializer.loads('dGVzdA.TsKHw5E3w4fDh8O1w7PCv8Oxw4pYUDfDpcKfw5vDqABsMMK1EsOsw6MFWcOUwrbClcKYPCl7D1cNeTRtw48mwrDDuzzCuwvDkzIJHcKlC8OgJsK_H8OOw4bCoMOawofDvTU'));
// 'test'
```

#### itsdanger.URLSafeSerializer(secretKey[, salt, serializer, signer])
* `secretKey` {String} Secret to be used
* `salt` {String} (default is 'itsdangerjs')
* `serializer` {Function|Class} A function or class that exposes both `loads` and `dumps` methods(default is `itsdanger.json.Json`) - see json.js for details
* `signer` {Function|Class} A fuction or class that will be used to sign values (default is `itsdanger.Signer`) - see signer.js for details

#### serializer.dumps(obj[, salt])
* `obj` {String|Object} The value to be signed and serialized
* `salt` {String} (default is inherited from the constructor)

Returns signed and serialized object

#### serializer.loads(s[, salt])
* `s` {String} Signed and Serialized value to unsign and deserializer
* `salt` {String} (default is inherited from the constructor)

Returns original object if signature is correct

### URLSafeTimedSerializer
```javascript
const itsdanger = require('itsdangerjs');
const serializer = new itsdanger.URLSafeTimedSerializer('my-secret');

console.log(serializer.dumps('test'));
// 'dGVzdA.AWmhGTQv.w6MERcO6CDvCqcKBwr0eMMKGNF7Ci8OPwpVVwpPCisKdw7ZKacOZGcORH8OLw7xzMMOwwrJdLcOhTRpnw7PDv2DDtMOSwpVUCDdbH8OqwqfDozDDh8KXPTTCvGFlwop1'
console.log(serializer.loads('dGVzdA.AWmhGTQv.w6MERcO6CDvCqcKBwr0eMMKGNF7Ci8OPwpVVwpPCisKdw7ZKacOZGcORH8OLw7xzMMOwwrJdLcOhTRpnw7PDv2DDtMOSwpVUCDdbH8OqwqfDozDDh8KXPTTCvGFlwop1'));
// 'test'
console.log(serializer.loads('dGVzdA.AWmhGTQv.w6MERcO6CDvCqcKBwr0eMMKGNF7Ci8OPwpVVwpPCisKdw7ZKacOZGcORH8OLw7xzMMOwwrJdLcOhTRpnw7PDv2DDtMOSwpVUCDdbH8OqwqfDozDDh8KXPTTCvGFlwop1', null, true)
[ 'test', 2019-04-05T15:56:57.391Z ])
```

#### itsdanger.URLSafeTimedSerializer(secretKey[, salt, serializer, signer])
* `secretKey` {String} Secret to be used
* `salt` {String} (default is 'itsdangerjs')
* `serializer` {Function|Class} A function or class that exposes both `loads` and `dumps` methods(default is `itsdanger.json.Json`) - see json.js for details
* `signer` {Function|Class} A fuction or class that will be used to sign values (default is `itsdanger.TimestampSigner`) - see timed.js for details

#### serializer.dumps(obj[, salt])
* `obj` {String|Object} The value to be signed and serialized
* `salt` {String} (default is inherited from the constructor)

Returns signed and serialized object

#### serializer.loads(s[, maxAge, returnTimestamp, salt])
* `s` {String} Signed and Serialized value to unsign and deserializer
* `maxAge` {Number} Max age time in milliseconds
* `returnTimestamp` {Boolean} Return the timestamp used at creation (default is false)
* `salt` {String} (default is inherited from the constructor)

Returns original object if signature is correct


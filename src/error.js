/**
 * Base error to allow subclassing and proper stacktrace capture
 * @extends {Error}
 */
class BaseError extends Error {
  constructor(...args) {
    super(...args)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Raised if bad data of any sort was encountered.
 * @extends {BaseError}
 */
export class BadData extends BaseError {
  constructor(message) {
    super(message)
  }
}

/**
 * Raised if a signature does not match.
 * @extends {BadData}
 */
export class BadSignature extends BadData {
  constructor(message, payload = null) {
    super(message)

    /**
     * The payload that failed the signature test.
     * In some situations you might still want to inspect this, even if you know it was tampered with.
     */
    this.payload = payload
  }
}

/**
 * Raised if a time-based signature is invalid.
 * @extends {BadSignature}
 */
export class BadTimeSignature extends BadSignature {
  constructor(message, payload = null, dateSigned = null) {
    super(message, payload)

    /**
     * If the signature expired this exposes the date of when the signature was created.
     * This can be helpful in order to tell the user how long a link has been gone stale.
     */
    this.dateSigned = dateSigned
  }
}

/**
 * Raised if a signature timestamp is older than `maxAge`.
 * @extends {BadTimeSignature}
 */
export class SignatureExpired extends BadTimeSignature {}

/**
 * Raised if a payload is invalid.
 * This could happen if the payload is loaded despite an invalid signature, or if there is a mismatch between the serializer and deserializer.
 * The original error that occurred during loading is stored on as `originalError`.
 * @extends {BadData}
 */
export class BadPayload extends BadData {
  constructor(message, originalError = null) {
    super(message)

    /**
     * If available, the error that indicates why the payload was not valid.
     * This might be `null`.
     * @type {?Error}
     */
    this.originalError = originalError
  }
}

declare module "pkcs7" {

  /**
   * Returns a new Uint8Array that is padded with PKCS#7 padding.
   * @param plaintext {Uint8Array} the input bytes before encryption
   * @return {Uint8Array} the padded bytes
   * @see http://tools.ietf.org/html/rfc5652
   */
  export function pad(plaintext: Uint8Array): Uint8Array

  /**
    * Returns the subarray of a Uint8Array without PKCS#7 padding.
    * @param padded {Uint8Array} unencrypted bytes that have been padded
    * @return {Uint8Array} the unpadded bytes
    * @see http://tools.ietf.org/html/rfc5652
    */
  export function unpad(padded: Uint8Array): Uint8Array

  export const version = '1.0.2'
}

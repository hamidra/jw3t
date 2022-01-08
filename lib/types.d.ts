export interface Header {
  /**
   * Algorithm : specifies the signing schema that is used for signing the token.
   */
  alg: string;

  /**
   * type : specifies the token type. in this case always JW3T.
   */
  typ: string;

  /**
   * address type : specifies the address type and is used to extract the address from signature.
   * (e.g. "ss58" specifies the address to be a [substrate address](https://docs.substrate.io/v3/advanced/ss58/))
   */
  add: string;
}

export interface Payload {
  /**
   * Address Claim : The address of the account that has signed the token.
   */
  add: string;

  /**
   * Audience Claim: The recipients that the JW3T is intended for.
   * Similar to [RFC7519#section-4.1.3](https://tools.ietf.org/html/rfc7519#section-4.1.3).
   */
  aud?: string | string[];

  /**
   * Expiration Time Claim - Identifies the expiration time on or after which the JW3T is not accepted for processing.
   * Similar to [RFC7519#section-4.1.4](https://tools.ietf.org/html/rfc7519#section-4.1.4).
   */
  exp?: number;

  /**
   * Not Before Claim - Identifies the time before which the JW3T is not accepted for processing
   * Similar to :[RFC7519#section-4.1.5](https://tools.ietf.org/html/rfc7519#section-4.1.5).
   */
  nbf?: number;

  /**
   * JWT ID - A unique identifier or nonce to prevent the token replay. similar to [RFC7519#section-4.1.7](https://tools.ietf.org/html/rfc7519#section-4.1.7).
   */
  jti?: string;

  /**
   * Any other optional claim.
   */
  [claimName: string]: unknown;
}

export interface Signer {
  sign(data: string): Promise<Uint8Array>;
}

export interface SigVerifier {
  verify(
    alg: string,
    message: string,
    signature: Uint8Array,
    address: string
  ): Promise<boolean>;
}

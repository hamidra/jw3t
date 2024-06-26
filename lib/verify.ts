import { Base64 } from 'js-base64';
import { Payload, Header, SigVerifier } from './types.d';
import { JW3TContent } from './content';

let skew = 300; // seconds
export class JW3TVerifier {
  private _sigVerifier: SigVerifier;
  constructor(verifier: SigVerifier) {
    this._sigVerifier = verifier;
  }
  async verify(jw3t: string): Promise<{ header: Header; payload: Payload }> {
    let [b64_header, b64_payload, b64_signature, ...rest] =
      jw3t?.split('.') || [];
    if (rest.length !== 0) {
      throw new Error('invalid token. malformed');
    }
    if (
      !b64_header ||
      !b64_payload ||
      !b64_signature ||
      !Base64.isValid(b64_header) ||
      !Base64.isValid(b64_payload) ||
      !Base64.isValid(b64_signature)
    ) {
      throw new Error('invalid token. header, payload or signature is missing');
    }
    let header = JSON.parse(Base64.decode(b64_header)) as Header;
    let payload = JSON.parse(Base64.decode(b64_payload)) as Payload;
    let signature = Base64.toUint8Array(b64_signature);

    let { algorithm } = header || {};
    // validate nbf if exists
    let {
      address: address,
      not_before: notBefore,
      audience: audience,
      expires_at: expiration,
    } = payload;

    if (!expiration) {
      throw new Error('invalid token.  expiration claim is missing');
    }
    let nowEpoch = Math.floor(Date.now() / 1000);
    if (nowEpoch > expiration + skew) {
      throw new Error('invalid token.  token is expired');
    }

    if (notBefore && nowEpoch < notBefore - skew) {
      throw new Error('invalid token.  token is not valid before nbf time');
    }

    // validate address
    if (!address) {
      throw new Error('invalid token.  address claim is missing');
    }

    let content = JW3TContent.fromBase64Url(`${b64_header}.${b64_payload}`);
    let jsonStrContent = content.stringify();
    let sigIsValid = await this._sigVerifier.verify(
      algorithm,
      jsonStrContent,
      signature,
      address
    );
    if (!sigIsValid) {
      throw new Error('invalid token, signiture is not valid');
    }

    return { header, payload };
  }
}

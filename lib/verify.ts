import { Verifier } from './types.d';
import {
  signatureVerify,
  cryptoWaitReady,
  decodeAddress,
} from '@polkadot/util-crypto';
import { Base64 } from 'js-base64';
import { Header, Payload } from './types.d';

export class PolkaJsVerifier implements Verifier {
  async verify(jw3t: string): Promise<boolean> {
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
    let address = payload.add;
    if (!address) {
      throw new Error('invalid token.  address claim is missing');
    }
    let signature = Base64.toUint8Array(b64_signature);
    let publicKey = decodeAddress(address);
    await cryptoWaitReady();
    let { isValid } = signatureVerify(
      `${b64_header}.${b64_payload}`,
      signature,
      publicKey
    );
    if (!isValid) {
      return false;
    }
    return true;
  }
}

export class JW3TVerifier {
  _verifier: Verifier;
  constructor(verifier: Verifier) {
    this._verifier = verifier;
  }
  async verify(jw3t: string): Promise<boolean> {
    return this._verifier.verify(jw3t);
  }
}

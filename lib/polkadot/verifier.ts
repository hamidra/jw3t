import { Header, Payload, SigVerifier } from '../types.d';
import {
  signatureVerify,
  cryptoWaitReady,
  decodeAddress,
} from '@polkadot/util-crypto';
import { Base64 } from 'js-base64';

export class PolkaJsVerifier implements SigVerifier {
  async verify(
    message: string,
    signature: Uint8Array,
    address: string
  ): Promise<boolean> {
    let publicKey = decodeAddress(address);
    await cryptoWaitReady();
    let { isValid } = signatureVerify(message, signature, publicKey);
    if (!isValid) {
      return false;
    }
    return true;
  }
}

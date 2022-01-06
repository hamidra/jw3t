import { Header, Payload, SigVerifier } from '../types.d';
import {
  signatureVerify,
  cryptoWaitReady,
  decodeAddress,
} from '@polkadot/util-crypto';

export class PolkaJsVerifier implements SigVerifier {
  async verify(
    message: string,
    signature: Uint8Array,
    address: string
  ): Promise<boolean> {
    await cryptoWaitReady();
    let publicKey = decodeAddress(address);
    let { isValid } = signatureVerify(message, signature, publicKey);
    if (!isValid) {
      return false;
    }
    return true;
  }
}

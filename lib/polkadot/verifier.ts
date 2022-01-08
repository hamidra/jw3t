import { Header, Payload, SigVerifier } from '../types.d';
import {
  signatureVerify,
  cryptoWaitReady,
  decodeAddress,
} from '@polkadot/util-crypto';

export class PolkaJsVerifier implements SigVerifier {
  async verify(
    alg: string,
    message: string,
    signature: Uint8Array,
    address: string
  ): Promise<boolean> {
    await cryptoWaitReady();
    let publicKey = decodeAddress(address);
    let { isValid, crypto } = signatureVerify(message, signature, publicKey);
    if (!isValid) {
      return false;
    }
    if (crypto != alg) {
      throw new Error(
        `signing algorithm does not match. expected alg:${alg} != signed alg:${crypto}`
      );
    }
    return true;
  }
}

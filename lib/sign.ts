import { Base64Signer } from './types.d';
import { KeyringPair } from '@polkadot/keyring/types';
import { Signer as KeyringSigner } from '@polkadot/api/types';
import {
  signatureVerify,
  cryptoWaitReady,
  decodeAddress,
} from '@polkadot/util-crypto';
import { hexToU8a, stringToHex, stringToU8a } from '@polkadot/util';
import { Base64 } from 'js-base64';
import { JW3TContent } from './content';

type SigningAccount = {
  account: KeyringPair;
  signer?: KeyringSigner;
};

export class PolkaJsSigner implements Base64Signer {
  _signingAccount: SigningAccount;
  constructor(signingAccount: SigningAccount) {
    this._signingAccount = signingAccount;
  }
  async sign(data: string): Promise<string> {
    let sig: Uint8Array | undefined;
    if (!this._signingAccount || !this._signingAccount?.account) {
      throw new Error(
        'no signing account was provided to sign the data with keyring'
      );
    } else {
      let { account, signer } = this._signingAccount;
      if (signer && signer.signRaw) {
        let { signature } = await signer.signRaw({
          address: account.address,
          data: data,
          type: 'bytes',
        });
        sig = hexToU8a(signature);
      } else {
        sig = account.sign(data);
      }
    }
    if (!sig) {
      throw new Error('empty signiture is not valid.');
    }
    return Base64.fromUint8Array(sig, true);
  }
}

export class JW3TSigner {
  private _signer: Base64Signer;
  private _content: JW3TContent;
  constructor(signer: Base64Signer, content: JW3TContent) {
    this._signer = signer;
    this._content = content;
  }
  async getSignedToken(): Promise<string> {
    if (!this._signer) {
      throw new Error('no signer is set for signing the token');
    }
    if (!this._content) {
      throw new Error('no content is set to be signed.');
    }
    let base64Content = this._content.toBase64Url();
    let base64Sig = await this._signer.sign(base64Content);
    return `${base64Content}.${base64Sig}`;
  }
}

import { Signer } from '../types';
import { KeyringPair } from '@polkadot/keyring/types';
import { Signer as KeyringSigner } from '@polkadot/api/types';
import { hexToU8a } from '@polkadot/util';
import { Base64 } from 'js-base64';

type SigningAccount = {
  account: KeyringPair;
  signer?: KeyringSigner;
};

export class PolkaJsSigner implements Signer {
  private _signingAccount: SigningAccount;
  constructor(signingAccount: SigningAccount) {
    this._signingAccount = signingAccount;
  }

  async sign(data: string): Promise<Uint8Array> {
    let sig: Uint8Array;
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
    return sig;
  }
}

import { Signer } from './types.d';
import { JW3TContent } from './content';
import { Base64 } from 'js-base64';
export class JW3TSigner {
  private _signer: Signer;
  private _content: JW3TContent;
  constructor(signer: Signer, content: JW3TContent) {
    this._signer = signer;
    this._content = content;
  }
  async getSignature(): Promise<{ base64Content: string; base64Sig: string }> {
    if (!this._signer) {
      throw new Error('no signer is set for signing the token');
    }
    if (!this._content) {
      throw new Error('no content is set to be signed.');
    }
    let base64Content = this._content.toBase64Url();
    let sig = await this._signer.sign(base64Content);
    let base64Sig = Base64.fromUint8Array(sig, true);
    return { base64Content, base64Sig };
  }
}

import { Payload, Header } from './types.d';
import { Base64 } from 'js-base64';

class JW3TContent {
  header: Header;
  payload: Payload;

  constructor(header: Header, payload: Payload) {
    this.payload = payload;
    this.header = header;
  }

  static fromBase64Url(b64Str: string): JW3TContent {
    let [hb64, pb64] = b64Str.split('.');
    let header = JSON.parse(Base64.decode(hb64));
    let payload = JSON.parse(Base64.decode(pb64));
    let jw3t = new JW3TContent(header, payload);
    return jw3t;
  }

  stringify(): string {
    if (!this.header) {
      throw new Error('token header can not be empty.');
    }
    if (!this.payload) {
      throw new Error('token payload can not be empty.');
    }

    let headerStr = JSON.stringify(this.header);
    let payloadStr = JSON.stringify(this.payload);
    return `${headerStr}.${payloadStr}`;
  }

  toBase64Url(): string {
    if (!this.header) {
      throw new Error('token header can not be empty.');
    }
    if (!this.payload) {
      throw new Error('token payload can not be empty.');
    }

    let headerB64 = Base64.encodeURL(JSON.stringify(this.header));
    let payloadB64 = Base64.encodeURL(JSON.stringify(this.payload));
    return `${headerB64}.${payloadB64}`;
  }

  /**
   * set the value for "Not Before" claim
   * @param nbf the nbf "not before" value to set for the token. when number is passed it is considered as an epoch (sec) and set as the claim value.
   * When a Date is passed it is resolved to an epoch (sec) before being used as the claim value.
   * @returns
   */
  setNotBefore(nbf: number | Date): JW3TContent {
    if (typeof nbf === 'number') {
      this.payload = { ...this.payload, nbf };
    } else {
      let epoch = Math.floor(nbf.getTime() / 1000);
      this.payload = { ...this.payload, nbf: epoch };
    }
    return this;
  }

  /**
   * set the value for "Expiration Time" claim
   * @param exp the exp "Expiration Time" value to set for the token. when number is passed it is considered as an epoch (sec) and set as the claim value.
   * When a Date is passed it is resolved to an epoch (sec) before being used as the claim value.
   * @returns
   */
  setExpiration(exp: number | Date): JW3TContent {
    if (typeof exp === 'number') {
      this.payload = { ...this.payload, exp };
    } else {
      let epoch = Math.floor(exp.getTime() / 1000);
      this.payload = { ...this.payload, exp: epoch };
    }
    return this;
  }

  /**
   * set the value for the audience claim
   * @param aud audience of the token
   * @returns
   */
  setAudience(aud: string | string[]): JW3TContent {
    this.payload = { ...this.payload, aud };
    return this;
  }

  /**
   *
   */
  setAddress(add: string): JW3TContent {
    this.payload = { ...this.payload, add };
    return this;
  }
}

export { JW3TContent };

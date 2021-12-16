import { Payload, Header } from './types.d';
import { Base64 } from 'js-base64';
import { stringify } from 'querystring';

class JW3TContent {
  header: Header;
  payload: Payload;

  constructor(header: Header, payload: Payload) {
    this.payload = payload;
    this.header = header;
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

  static fromBase64Url(b64Str: string): JW3TContent {
    let [hb64, pb64] = b64Str.split('.');
    let header = JSON.parse(Base64.decode(hb64));
    let payload = JSON.parse(Base64.decode(pb64));
    let jw3t = new JW3TContent(header, payload);
    return jw3t;
  }
}

export { JW3TContent };

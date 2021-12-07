import {
  signatureVerify,
  cryptoWaitReady,
  decodeAddress,
} from '@polkadot/util-crypto';
import { hexToU8a, stringToHex, stringToU8a } from '@polkadot/util';
import { atob, btoa } from 'js-base64';

const u8aToBase64 = (bytes) => {
  var binary = '';
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
};
const base64ToU8 = (b64string) => {
  var data = atob(b64string);
  var arr: any[] = [];
  for (let i = 0; i < data.length; i++) {
    arr.push(data.charCodeAt(i));
  }
  return new Uint8Array(arr);
};
const signToken = async (jwt, signingAccount) => {
  if (!signingAccount || !signingAccount?.account) {
    throw new Error(
      'no signing account was provided to sign the authentication token.'
    );
  }
  let { account, signer } = signingAccount;
  let signature_base64 = '';
  if (signer) {
    let signature = await signer.signRaw({
      address: account.address,
      data: stringToHex(jwt),
      type: 'byte',
    });
    signature_base64 = signature?.signature
      ? u8aToBase64(hexToU8a(signature?.signature))
      : '';
  } else {
    let signature = account.sign(stringToU8a(jwt));
    signature_base64 = u8aToBase64(signature);
  }
  return `${jwt}.${signature_base64}`;
};

export const issue_w3token = async ({ nonce, signingAccount }) => {
  const header = JSON.stringify({
    alg: 'sr25519',
    typ: 'WEB3_JWT',
  });
  const payload = JSON.stringify({
    nonce,
    address: signingAccount?.account?.address,
  });
  let signedToken = await signToken(
    `${btoa(header)}.${btoa(payload)}`,
    signingAccount
  );
  return signedToken;
};

export const verify_w3token = async (w3token) => {
  try {
    let [b64_header, b64_payload, b64_signature, ...rest] =
      w3token?.split('.') || [];
    if (rest.length !== 0) {
      return { error: 'invalid token. malformed' };
    }
    if (!b64_header || !b64_payload || !b64_signature) {
      return {
        error: 'invalid token. header, payload or signature is missing',
      };
    }
    let header = JSON.parse(atob(b64_header));
    let payload = JSON.parse(atob(b64_payload));
    let address = payload?.address;
    if (!address) {
      return { error: 'invalid token.  address claim is missing' };
    }
    let signature = base64ToU8(b64_signature);
    let publicKey = decodeAddress(address);
    await cryptoWaitReady();
    let { isValid } = signatureVerify(
      `${b64_header}.${b64_payload}`,
      signature,
      publicKey
    );
    if (!isValid) {
      return { error: 'invalid token. bad signature' };
    }
    return { header, payload };
  } catch (error) {
    return { error };
  }
};

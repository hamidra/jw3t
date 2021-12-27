import { Header, Payload } from './types.d';
import { JW3TContent } from './content';
import { PolkaJsSigner, PolkaJsVerifier } from './polkadot';
import { JW3TSigner } from './sign';
import { JW3TVerifier } from './verify';
import { Keyring } from '@polkadot/keyring';
import { mnemonicGenerate } from '@polkadot/util-crypto';

test('test a valid jw3t using polkadot signer', async () => {
  let keyring = new Keyring({ type: 'ed25519' });
  let mnemonic = mnemonicGenerate();
  let account = keyring.createFromUri(mnemonic);
  let signingAccount = { account };
  let address = account.address;
  let header = <Header>{
    alg: 'ed25519',
    typ: 'JW3T',
    add: 'ss58',
  };
  let payload = <Payload>{
    add: address,
  };

  let exp = Math.floor(Date.now() / 1000) + 24 * 3600; // expire in 24 hours
  let content = new JW3TContent(header, payload)
    .setAudience('uri:test')
    .setExpiration(exp);
  let polkaJsSigner = new PolkaJsSigner(signingAccount);
  let jw3tSigner = new JW3TSigner(polkaJsSigner, content);
  let { base64Content, base64Sig } = await jw3tSigner.getSignature();
  let jw3t = `${base64Content}.${base64Sig}`;

  let polkaJsVerifier = new PolkaJsVerifier();
  let jw3tVerifier = new JW3TVerifier(polkaJsVerifier);
  let { header: verifiedHeader, payload: verifiedPayload } =
    await jw3tVerifier.verify(jw3t);
  expect(verifiedHeader).toEqual(header);
  expect(1).toBe(2);
});

test('token content base46URI encode/decode success', () => {
  let header = <Header>{
    alg: 'ed25519',
    typ: 'JW3T',
    add: 'ss58',
  };
  let payload = <Payload>{
    // Alice
    add: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    aud: 'test',
  };
  let content = new JW3TContent(header, payload);
  let b64 = content.toBase64Url();
  console.log(b64);
  let jw3t = JW3TContent.fromBase64Url(b64);
  console.log(jw3t.header);
  console.log(jw3t.payload);
});

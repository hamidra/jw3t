import { Header, Payload } from './types.d';
import { JW3TContent } from './content';
import { PolkaJsSigner, JW3TSigner } from './sign';
import { PolkaJsVerifier, JW3TVerifier } from './verify';
import { Keyring } from '@polkadot/keyring';
import { mnemonicGenerate } from '@polkadot/util-crypto';

test('test a valid jw3t', async () => {
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
    aud: 'test',
  };

  let content = new JW3TContent(header, payload);
  let polkaJsSigner = new PolkaJsSigner(signingAccount);
  let jw3tSigner = new JW3TSigner(polkaJsSigner, content);
  let { base64Content, base64Sig } = await jw3tSigner.getSignature();
  let jw3t = `${base64Content}.${base64Sig}`;
  console.log(jw3t);

  let polkaJsVerifier = new PolkaJsVerifier();
  let jw3tVerifier = new JW3TVerifier(polkaJsVerifier);
  let isValid = await jw3tVerifier.verify(jw3t);
  console.log(isValid);
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

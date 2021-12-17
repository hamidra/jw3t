import { Header, Payload } from './types.d';
import { JW3TContent } from './content';
import { PolkaJsSigner, JW3TSigner } from './sign';
/**  @polkadot/keyring */
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
  let jw3t = await jw3tSigner.getSignedToken();
  console.log(jw3t);
});

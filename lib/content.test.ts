import { JW3TContent } from './content';
import { Header, Payload } from './types.d';

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

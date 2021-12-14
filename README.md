This

# What is json web3 token

Json Web3 Token (jw3t) is a self-contained json token, formatted based on the Json Web Token standard [RFC 7519](https://tools.ietf.org/html/rfc7519) and adapted to work for the web3 authentications and authorization usecases.

# jw3t vs jwt, how they are different?

The main difference between Json Web3 Tokens and Json Web Tokens is in the issuance and verification procedures.
In a web3 world the identities are self-sovereign and each user owns the signing keys of their own accounts, hence the json web3 tokens are issued by the users themselves and are signed by the user's private key. This means that the issuer and the subject of a jw3t are the same which makes the fields redundant. Also another characteristic of web3 accounts is that the address of an account can be derived from the signature (using the public key). Considering these chracteristics we can replace the issuer and subject fields with an account address field.
So a in jw3t:

- The token includes an address claim in the payload.
- The token is signed by the private key of the claimed address.
- The token is verified to be valid by checking the signature is valid and the signature address matches the claimed address that is included in the payload.

# Why jw3t?

Do we need a token in a web3 world, where all messages can be signed by the owner accounts. Aren't we developing decentralized apps?! so who are these tokens going to be issued for? The advantage the tokens provide is to improve the user experience when there is a trusted middle layer between the user and decentralized network. This can happen when there are some hybrid scenarios that might need to provide some off-chain services and data as well as onchain transactions.
E.g in the case of NFTs there are minting platforms that provide an e2e UX for minting and managing NFTs which le the user upload the resources to IPFS and set the metadata files on the chain. In this scenario the platform needs to authneticate the users accounts to be able to let them manage their off-chain resources. jw3t can provide a self-contained and self-sovereign solution for the user to authenticate and authorize their off-chain resources.

# How jw3t tokens are issued:

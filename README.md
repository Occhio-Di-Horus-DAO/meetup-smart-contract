# Meetup on EVM Chain

This project contains a couple of smart contracts that can be deployed on EVM compatible blockchains. They are written in [Solidity](https://docs.soliditylang.org/en/v0.8.12/) using [Truffle Suite](https://trufflesuite.com/).

- If you want to run this project locally you must install and run [`ganache`](https://github.com/trufflesuite/ganache)

- If you want to run this project on `Polygon Mumbai Testnet` you need to rename `.secret.sample` file to `.secret` and write your wallet private key to it. (please create a dedicated account for these tests to avoid exposing your main key, check [Metamask](https://metamask.io/))

- If you want to play with the deployed contract use [0xC4D3e3D0C12B4a2E221d94fe82F93583C162B88F](https://mumbai.polygonscan.com/address/0xC4D3e3D0C12B4a2E221d94fe82F93583C162B88F)


## Install

`npm i`

## Compile contracts

`npm run compile`

## Deploy on local blockchain (es: Ganache)

`npm run release:local`

## Deploy on Polygon Testnet

`npm run release:test`
## Contracts

- [Meetup.sol](contracts/Meetup.sol)
- [PayOrganizers.sol](contracts/PayOrganizers.sol) (for more info refer to OpenZeppelin [PaymentSplitter](https://docs.openzeppelin.com/contracts/2.x/api/payment#PaymentSplitter))
## Contracts specs 
(check test folder for details)

- ✓ user can know organizers
- ✓ user can add a new topic passing a message and 0.5 MATIC
- ✓ user cannot add a new topic passing less or more that 0.5 MATIC 
- ✓ users cannot add more than 10 topics for a meetup
- ✓ user can like a topic passing exactly 0.1 MATIC
- ✓ user cannot like a non existing topic
- ✓ user cannot like a topic he proposed
- ✓ organizers can withdraw the MATIC balance accumulated, the balance is moved to PayOrganizers contract
- ✓ contract owner can withdraw the MATIC balance accumulated, the balance is moved to PayOrganizers contract
- ✓ user cannot withdraw the MATIC balance accumulated
- ✓ owner can kill the contract and get all the balance accumulated, this is done for safety reason
- ✓ contract should emit NewTopic event when a new topic is submitted
- ✓ contract should emit NewLike event when a new like is submitted



# Meetup on EVM Chain

## Idea

This repo contains the blockchain part of a Web3 application to organize Meetups and earn some economic contribution from participants.

A participant can contribute in two ways:

- add a new topic to be discussed during the meetup (cost 0.5 Matic)
- like a proposed topic (cost 0.1 Matic)

The total amount can be withdraw from the organization of the Meetup and splitted between the organizers in equal parts.

## Code

This project contains a couple of smart contracts that can be deployed on EVM compatible blockchains. They are written in [Solidity](https://docs.soliditylang.org/en/v0.8.12/) using [Truffle Suite](https://trufflesuite.com/).

- If you want to run this project locally you must install and run [`ganache`](https://github.com/trufflesuite/ganache)

- If you want to run this project on `Polygon Mumbai Testnet` you need to proper setup your `.env` file. (explained later)

- If you want to play with the Meetup deployed contract use [0xc68EafAf44bF73cc7469E1aFC0e3a4a687a55961](https://mumbai.polygonscan.com/address/0xc68EafAf44bF73cc7469E1aFC0e3a4a687a55961)


## Install

`npm i`

## Setup .env variables

- Rename `.env.sample` in `.env`
- Add the private key to your test account wallet (please create a dedicated account for these tests to avoid exposing your main key, check [Metamask](https://metamask.io/))


## Compile contracts

`npm run compile`

## Deploy on local blockchain (es: Ganache)

`npm run release:local`

## Deploy on Polygon Testnet

`npm run release:test`
## Contracts

- [Meetup.sol](contracts/Meetup.sol)
- [MeetupFactory.sol](contracts/MeetupFactory.sol)
- [Organization.sol](contracts/Organization.sol)
- [OrganizationFactory.sol](contracts/OrganizationFactory.sol)
## Contracts specs (Meetup.sol)
(check test folder for details)

- ✓ user can know organizers
- ✓ user can add a new topic passing a message and 0.5 MATIC
- ✓ user cannot add a new topic passing less or more that 0.5 MATIC 
- ✓ users cannot add more than 10 topics for a meetup
- ✓ user can like a topic passing exactly 0.1 MATIC
- ✓ user cannot like a non existing topic
- ✓ user cannot like a topic he proposed
- ✓ organizers can withdraw the MATIC balance accumulated, the balance is moved to Organization contract
- ✓ contract owner can withdraw the MATIC balance accumulated, the balance is moved to Organization contract
- ✓ user cannot withdraw the MATIC balance accumulated
- ✓ owner can kill the contract and get all the balance accumulated, this is done for safety reason
- ✓ contract should emit NewTopic event when a new topic is submitted
- ✓ contract should emit NewLike event when a new like is submitted



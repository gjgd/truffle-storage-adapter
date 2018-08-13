# Truffle Storage Adapter

This repo shows how to integrate decentralized storage services like IPFS with smart contract using the Truffle framework. 

## Installation

[Install IPFS](https://github.com/transmute-industries/transmute-tutorials/tree/master/ipfs) and run `ipfs daemon`

Install Truffle `npm -g install truffle`

Install dependencies `npm install`

## Running the tests

`npm run test`

## Storage adapter

The adapter is located [here](https://github.com/gjgd/truffle-storage-adapter/blob/master/test/IPFSStorageAdapter.js)

The public methods that can be used are:
- `saveFile` for uploading a file on IPFS and storing the hash on a smart contract
- `loadFile` for downloading the file from IPFS using the hash stored in the smart contract

##  Storage providers

Right now the adapter only supports IPFS, however other centralized or decentralized storage providers can be added using the same interface.

## TODO

Add `saveObject` and `loadObject` to store JSONs on IPFD

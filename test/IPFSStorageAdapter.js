const ipfsAPI = require('ipfs-api');
const bs58 = require('bs58');
const fs = require('fs');

module.exports = class IPFSStorageAdapter {
  constructor(config) {
    this.ipfs = new ipfsAPI(config);
  }

  /*
   * Methods for interacting between local filesystem
   * and IPFS
   */

  async getId() {
    return await this.ipfs.id();
  }

  async writeFile(path) {
    const buffer = fs.readFileSync(path);
    const ipfsFileData = await this.ipfs.add(buffer);
    return ipfsFileData[0];
  }

  async getFile(multiHash, path) {
    const ipfsBuffer = await this.ipfs.cat(multiHash);
    fs.writeFileSync(path);
  }

  /*
   * Convenience methods to convert from multihash
   * (IPFS format) to bytes32 (smart contract format)
   * from: https://github.com/transmute-industries/transmute/blob/master/packages/transmute-framework/src/decentralized-storage/ipfs/index.js
   */

  bytes32ToMultiHash(bytes32Hash) {
    return bs58.encode(new Buffer('1220' + bytes32Hash.slice(2), 'hex'));
  }

  multiHashToBytes32(multiHash) {
    return '0x' + new Buffer(bs58.decode(multiHash).slice(2)).toString('hex');
  }

  /*
   * High level methods for storing a file.
   * It will save the file to IPFS
   * and store the hash on the smart contract
   */

  async saveFile(storageContract, path) {
    const ipfsFileData = await writeFile(path);
    const multiHash = ipfsFileData.hash;
    const bytes32Hash = multiHashToBytes32(multiHash);
    await storageContract.setDataHash(bytes32Hash);
  }

  async loadFile(storageAdapter, path) {
    const bytes32Hash = await storageContract.dataHash.call();
    const multiHash = bytes32ToMultiHash(bytes32Hash);
    await getFile(multiHash, path);
  }
}

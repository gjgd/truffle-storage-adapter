const Storage = artifacts.require('./Storage.sol');
const ipfsAPI = require('ipfs-api');
const fs = require('fs');
const IPFSStorageAdapter = require('./IPFSStorageAdapter');

const nyanCatMultiHash = 'QmcX5MyEF5UyqLGQWppBb4JmxnruBFjBpRjUzhCKfCmhmk';
const nyanCatBytes32 = '0xd2af4cd2ed452b6cb4889252b2668840a1c0038f041139c1a175f74d0b570e13';
const nyanCatGifPath = './nyan.gif';
const nyanCatGifFromIPFSPath = nyanCatGifPath + '.copy';

const assertValidIPFSId = (id) => {
    assert.ok(id.id);
    assert.ok(id.publicKey);
    assert.ok(id.addresses);
    assert.ok(id.agentVersion);
    assert.ok(id.protocolVersion);
}

describe('IPFS', () => {
  const ipfs = new ipfsAPI();
  let nyanCatMultiHashFromIPFS;

  it('should connect to IPFS', async () => {
    const ipfsId = await ipfs.id()
    assertValidIPFSId(ipfsId);
  });

  it('should be able to add a file to IPFS', async () => {
    const buffer = fs.readFileSync(nyanCatGifPath);
    const res = await ipfs.add(buffer);
    nyanCatMultiHashFromIPFS = res[0].hash;
    assert.equal(nyanCatMultiHash, nyanCatMultiHashFromIPFS);
  });

  it('should be able to get a file from IPFS', async () => {
    const nyanCatFromIPFS = await ipfs.cat(nyanCatMultiHash);
    const originalNyanCat = fs.readFileSync(nyanCatGifPath);
    assert.deepEqual(originalNyanCat, nyanCatFromIPFS);
  });
});

describe('IPFSStorageAdapter', () => {
  let storageContract;
  let ipfsStorageAdapter;

  before(async () => {
    storageContract = await Storage.deployed();
    ipfsStorageAdapter= new IPFSStorageAdapter()
  });

  describe('getId', () => {
    it('should return a valid IPFS id', async () => {
      const ipfsId = await ipfsStorageAdapter.getId()
      assertValidIPFSId(ipfsId);
    });
  });

  describe('writeFile', () => {
    it('should return the multiHash of the file written to IPFS', async () => {
      const ipfsFileData = await ipfsStorageAdapter.writeFile(nyanCatGifPath);
      const multiHash = ipfsFileData.hash;
      assert.equal(nyanCatMultiHash, multiHash);
    });
  });

  describe('getFile', () => {
    it('should get the file and save it to the local file system', async () => {
      // If file exists, remove it
      if (fs.existsSync(nyanCatGifFromIPFSPath)) {
        fs.unlinkSync(nyanCatGifFromIPFSPath);
      }
      await ipfsStorageAdapter.getFile(nyanCatMultiHash, nyanCatGifFromIPFSPath);
      const originalFileBuffer = fs.readFileSync(nyanCatGifPath);
      const ipfsFileBuffer = fs.readFileSync(nyanCatGifFromIPFSPath);
      assert.deepEqual(originalFileBuffer, ipfsFileBuffer);
      fs.unlinkSync(nyanCatGifFromIPFSPath);
    });
  });

  describe('bytes32ToMultiHash', () => {
    it('should convert from bytes32 to multiHash format', async () => {
      const multiHash = ipfsStorageAdapter.bytes32ToMultiHash(nyanCatBytes32);
      assert.equal(nyanCatMultiHash, multiHash);
    });
  });

  describe('multiHashToBytes32', () => {
    it('should convert from multiHash to bytes32 format', async () => {
      const bytes32 = ipfsStorageAdapter.multiHashToBytes32(nyanCatMultiHash);
      assert.equal(nyanCatBytes32, bytes32);
    });
  });

  describe('saveFile', () => {
  });
  describe('loadFile', () => {
  });
});

const Storage = artifacts.require('./Storage.sol');
const ipfsAPI = require('ipfs-api');
const fs = require('fs');
const IPFSStorageAdapter = require('./IPFSStorageAdapter');

const nyanCatHash = 'QmcX5MyEF5UyqLGQWppBb4JmxnruBFjBpRjUzhCKfCmhmk';

const assertValidIPFSId = (id) => {
    assert.ok(id.id);
    assert.ok(id.publicKey);
    assert.ok(id.addresses);
    assert.ok(id.agentVersion);
    assert.ok(id.protocolVersion);
}

describe('IPFS', () => {
  const ipfs = new ipfsAPI();
  let nyanCatHashFromIPFS;

  it('should connect to IPFS', async () => {
    const ipfsId = await ipfs.id()
    assertValidIPFSId(ipfsId);
  });

  it('should be able to add a file to IPFS', async () => {
    const nyanCatGif = fs.readFileSync('./nyan.gif');
    const res = await ipfs.add(nyanCatGif);
    nyanCatHashFromIPFS = res[0].hash;
    assert.equal(nyanCatHash, nyanCatHashFromIPFS);
  });

  it('should be able to get a file from IPFS', async () => {
    const nyanCatFromIPFS = await ipfs.cat(nyanCatHash);
    const originalNyanCat = fs.readFileSync('./nyan.gif');
    assert.deepEqual(originalNyanCat, nyanCatFromIPFS);
  });
});

describe('IPFSStorageAdapter', () => {
  let storage;
  let ipfsStorageAdapter;

  before(async () => {
    storage = await Storage.deployed();
    ipfsStorageAdapter= new IPFSStorageAdapter()
  });

  it('should initialize IPFS', async () => {
    const ipfsId = await ipfsStorageAdapter.getId()
    assertValidIPFSId(ipfsId);
  });
});

const Storage = artifacts.require('./Storage.sol');
const ipfsAPI = require('ipfs-api');
const fs = require('fs');

describe('IPFS', () => {
  const ipfs = ipfsAPI();
  let nyanCatHash;

  it('should connect to IPFS', async () => {
    const ipfsId = await ipfs.id()
    assert.ok(ipfsId.id);
    assert.ok(ipfsId.publicKey);
    assert.ok(ipfsId.addresses);
    assert.ok(ipfsId.agentVersion);
    assert.ok(ipfsId.protocolVersion);
  });

  it('should be able to add a file to IPFS', async () => {
    const nyanCatGif = fs.readFileSync('./nyan.gif');
    const res = await ipfs.add(nyanCatGif);
    nyanCatHash = res[0].hash;
    assert.equal('QmcX5MyEF5UyqLGQWppBb4JmxnruBFjBpRjUzhCKfCmhmk', nyanCatHash);
  });

  it('should be able to get a file from IPFS', async () => {
    const nyanCatFromIPFS = await ipfs.cat(nyanCatHash);
    const originalNyanCat = fs.readFileSync('./nyan.gif');
    assert.deepEqual(originalNyanCat, nyanCatFromIPFS);
  });
});

contract('Storage', () => {

});


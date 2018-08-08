pragma solidity ^0.4.24;

contract Storage {
  bytes public dataHash;

  function setDataHash(bytes _dataHash) external {
    dataHash = _dataHash;
  }
}

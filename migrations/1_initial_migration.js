var Migrations = artifacts.require("./Migrations.sol");
const Storage = artifacts.require("./Storage.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Storage);
};

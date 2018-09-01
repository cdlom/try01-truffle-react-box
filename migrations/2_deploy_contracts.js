var SimpleStorage = artifacts.require("./DemoSupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};

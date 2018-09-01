var DemoSupplyChain = artifacts.require("./DemoSupplyChain.sol");

//var DemoSupplyChain = artifacts.require("./contracts/DemoSupplyChain.sol")

contract('DemoSupplyChain', function(accounts) {

  it("...should store the value 0x53656e736f722064652074656d70657261747572610000000000000000000000.", function() {
    return DemoSupplyChain.deployed().then(function(instance) {
      
     // assert.equal(1,1);
      return instance.getDeviceById(1);
    }).then(function(storedData) {
      assert.equal(storedData[0], '0x53656e736f722064652074656d70657261747572610000000000000000000000',
       "The value 0x53656e736f722064652074656d70657261747572610000000000000000000000 was not stored.");
      //console.log(storedData);
      //assert.equal(1,1);

    });
  });

});

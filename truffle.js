module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*",
      gas: 4700000
    },
    ganache: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(process.env.INFURA_ROPSTEN_MNEMONIC, "https://ropsten.infura.io/" + process.env.INFURA_KEY)
      },
      network_id: "3"
    },

  }
};

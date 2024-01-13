const config = require('./config');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('hardhat-deploy');
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({silent: true});

module.exports = {
  solidity: "0.8.7",
  namedAccounts: {
    deployer: {
      default: 0
    },
  },
  networks: {
    hardhat: {
      tags: ["test"],
    },
    goerli: {
      tags: ['goerli'],
      accounts: [process.env.TEST_DEPLOYER_KEY],
      url: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    },
    mainnet: {
      tags: ['mainnet'],
      url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`,
      chainId: 1,
      accounts:  [process.env.PRODUCTION_DEPLOYER_KEY],
      maxPriorityFeePerGas: 1000000000
    },
    tenderly: {
      url: ""
    }
  },
};

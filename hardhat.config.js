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

real_accounts = undefined;
if(process.env.DEPLOYER_KEY) {
  real_accounts = [process.env.DEPLOYER_KEY];
}

module.exports = {
  solidity: "0.8.7",
  namedAccounts: {
    deployer: {
      default: 0
    },
  },
  networks: {
    hardhat: {
      initialDate: config.UNLOCK_BEGIN,
      tags: ["test"],
    },
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`,
      chainId: 1,
      accounts: real_accounts,
      maxPriorityFeePerGas: 1000000000
    },
    tenderly: {
      url: ""
    }
  },
};

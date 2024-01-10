const config = require('../config');

module.exports = async ({getNamedAccounts, deployments, network}) => {
  const oskyToken = await ethers.getContract('OSKYToken');
  const timelockController = await ethers.getContract('TimelockController');

  // Transfer ownership of the token to the timelock controller
  await oskyToken.transferOwnership(timelockController.address);

  return true;
};
module.exports.dependencies = ['TimelockController'];
module.exports.tags = ['ownership'];
module.exports.id = 'ownership';

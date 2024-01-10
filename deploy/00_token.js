const config = require('../config');

module.exports = async ({getNamedAccounts, deployments, network}) => {
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();
  const totalSupply = ethers.BigNumber.from(10).pow(18).mul(config.TOTAL_SUPPLY);
  await deploy('OSKYToken', {
    from: deployer,
    args: [
      totalSupply
    ],
    log: true,
  });
  return true;
};
module.exports.tags = ['OSKYToken'];
module.exports.id = 'OSKYToken';

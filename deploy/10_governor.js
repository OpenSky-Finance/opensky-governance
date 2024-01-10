module.exports = async ({getNamedAccounts, deployments}) => {
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();
  const oskyToken = await ethers.getContract('OSKYToken');
  const timelockController = await ethers.getContract('TimelockController');
  await deploy('OSKYGovernor', {
    from: deployer,
    args: [oskyToken.address, timelockController.address],
    log: true,
  });
  const governor = await ethers.getContract('OSKYGovernor');
  await (await timelockController.grantRole(await timelockController.PROPOSER_ROLE(), governor.address)).wait();
  await (await timelockController.revokeRole(await timelockController.TIMELOCK_ADMIN_ROLE(), deployer)).wait();
  return true;
};
module.exports.tags = ['OSKYGovernor'];
module.exports.dependencies = ['OSKYToken', 'TimelockController'];
module.exports.id = 'OSKYGovernor';

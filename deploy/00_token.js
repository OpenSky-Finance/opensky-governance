const config = require('../config');

module.exports = async ({getNamedAccounts, deployments, network}) => {
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();
  const totalSupply = ethers.BigNumber.from(10).pow(18).mul(config.TOTAL_SUPPLY);

  let receiver
  const tags= network.config.tags
  if(tags.includes('test')){
    receiver = deployer
  } else if(tags.includes('goerli')){
    receiver= process.env.TEST_TOKEN_RECEIVER
  }else if(tags.includes('mainnet')){
    receiver= process.env.PRODUCTION_TOKEN_RECEIVER
  }
  console.log('deploy.OSKYToken', totalSupply.toString(), receiver)

  if(!receiver) throw new Error('receiver undefined')

  await deploy('OSKYToken', {
    from: deployer,
    args: [
      totalSupply, receiver
    ],
    log: true,
  });
  return true;
};
module.exports.tags = ['OSKYToken'];
module.exports.id = 'OSKYToken';

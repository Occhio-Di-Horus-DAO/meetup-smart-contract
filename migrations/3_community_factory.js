const Factory = artifacts.require("Factory");
const Community = artifacts.require("Community");

module.exports = async function (_deployer) {
  // Use deployer to state migration tasks.
  await _deployer.deploy(Community);
  await _deployer.deploy(Factory, Community.address);
};

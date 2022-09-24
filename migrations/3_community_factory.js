const CommunityFactory = artifacts.require("CommunityFactory");
const Community = artifacts.require("Community");

module.exports = async function (_deployer) {
  // Use deployer to state migration tasks.
  await _deployer.deploy(Community);
  await _deployer.deploy(CommunityFactory, Community.address);
};

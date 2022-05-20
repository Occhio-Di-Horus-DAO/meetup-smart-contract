const OrganizationFactory = artifacts.require("OrganizationFactory");

module.exports = async function (_deployer) {
  // Use deployer to state migration tasks.
  await _deployer.deploy(OrganizationFactory);
};

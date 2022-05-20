const Meetup = artifacts.require("Meetup");
const Organization = artifacts.require("Organization");

module.exports = async function (_deployer) {
  // Use deployer to state migration tasks.
  const organization = await Organization.deployed();
  await _deployer.deploy(Meetup, organization.address);
};

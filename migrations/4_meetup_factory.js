const MeetupFactory = artifacts.require("MeetupFactory");
const PayOrganizers = artifacts.require("PayOrganizers");

module.exports = async function (_deployer) {
  // Use deployer to state migration tasks.
  const payOrganizers = await PayOrganizers.deployed();
  await _deployer.deploy(MeetupFactory, payOrganizers.address);
};

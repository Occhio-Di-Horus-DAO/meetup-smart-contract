const MeetupFactory = artifacts.require("MeetupFactory");

module.exports = async function (_deployer) {
  // Use deployer to state migration tasks.
  await _deployer.deploy(MeetupFactory);
};

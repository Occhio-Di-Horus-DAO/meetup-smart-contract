const Meetup = artifacts.require("Meetup");

module.exports = async function (_deployer) {
  // Use deployer to state migration tasks.
   await _deployer.deploy(Meetup);
};

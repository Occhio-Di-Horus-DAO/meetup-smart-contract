const { expect } = require("chai");

const PayOrganizers = artifacts.require("PayOrganizers");

contract("PayOrganizers", function ([owner, organizer1, organizer2]) {
  let payOrganizers;
  beforeEach(async function () {
    // Deploy a new Box contract for each test
    payOrganizers = await PayOrganizers.new(
      [organizer1, organizer2],
      [50, 50],
      { from: owner }
    );
  });

  // Test case
  it("can get organizers", async function () {
    const organizers = await payOrganizers.getOrganizers();
    expect(organizers).to.eql([organizer1, organizer2]);
  });
});

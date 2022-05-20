const { expect } = require("chai");

const Organization = artifacts.require("Organization");

contract("Organization", function ([owner, organizer1, organizer2]) {
  let organization;
  beforeEach(async function () {
    // Deploy a new Box contract for each test
    organization = await Organization.new(
      "OcchioDiHorusDAO",
      [organizer1, organizer2],
      [50, 50],
      {
        from: owner,
      }
    );
  });

  // Test case
  it("should have organizers", async function () {
    const organizers = await organization.getOrganizers();
    expect(organizers).to.eql([organizer1, organizer2]);
  });

  it("should have a name", async function () {
    const name = await organization.getName();
    expect(name).to.eql("OcchioDiHorusDAO");
  });
});

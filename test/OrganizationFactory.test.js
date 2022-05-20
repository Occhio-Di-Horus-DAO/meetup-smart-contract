const { expect } = require("chai");
const { expectEvent } = require("@openzeppelin/test-helpers");

const Organization = artifacts.require("Organization");
const OrganizationFactory = artifacts.require("OrganizationFactory");

contract("OrganizationFactory", ([organizer1, organizer2, organizer3]) => {
  it("should create a new Organization passing a name, a list of organizers and a share percentage (es: [50,50])", async () => {
    const organizationFactory = await OrganizationFactory.new();
    await organizationFactory.createOrganization(
      "OcchioDiHorusDAO",
      [organizer1, organizer2],
      [50, 50]
    );

    const organizationAddress = await organizationFactory.organizations(0);
    expect(organizationAddress).to.exist;
    const organization = await Organization.at(organizationAddress);
    expect(await organization.getOrganizers()).deep.to.equal([
      organizer1,
      organizer2,
    ]);
    expect(await organization.getName()).to.equal("OcchioDiHorusDAO");
  });

  it("should emit a NewOrganization event every time a new organization is created by the factory", async () => {
    const organizationFactory = await OrganizationFactory.new();
    const receipt = await organizationFactory.createOrganization(
      "OcchioDiHorusDAO",
      [organizer1, organizer2],
      [50, 50]
    );
    const receipt2 = await organizationFactory.createOrganization(
      "TheDAO",
      [organizer2, organizer3],
      [50, 50]
    );

    expectEvent(receipt, "NewOrganization", {
      newOrganization: receipt.logs[0].args[0], // @TODO maybe there's a better way to retrieve Event params
    });
    expectEvent(receipt2, "NewOrganization", {
      newOrganization: receipt2.logs[0].args[0], // @TODO maybe there's a better way to retrieve Event params
    });
  });
});

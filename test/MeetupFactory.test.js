const { expect } = require("chai");
const { expectEvent } = require("@openzeppelin/test-helpers");

const Meetup = artifacts.require("Meetup");
const Organization = artifacts.require("Organization");
const MeetupFactory = artifacts.require("MeetupFactory");

contract("MeetupFactory", ([owner, organizer1, organizer2]) => {
  let organization;

  beforeEach(async () => {
    organization = await Organization.new(
      "OcchioDiHorusDAO",
      [organizer1, organizer2],
      [50, 50],
      {
        from: owner,
      }
    );
  });

  it("should create a new Meetup passing the organizers payment account", async () => {
    const meetupFactory = await MeetupFactory.new();
    await meetupFactory.createMeetup(organization.address);

    const meetupAddress = await meetupFactory.meetups(0);
    expect(meetupAddress).to.exist;
    const meetup = await Meetup.at(meetupAddress);
    expect(await meetup.organization()).to.equal(organization.address);
  });

  it("should emit a NewMeetup event every time a new meetup is created by the factory", async () => {
    const meetupFactory = await MeetupFactory.new();
    const receipt = await meetupFactory.createMeetup(organization.address);
    const receipt2 = await meetupFactory.createMeetup(organization.address);

    expectEvent(receipt, "NewMeetup", {
      newMeetup: receipt.logs[0].args[0], // @TODO maybe there's a better way to retrieve Event params
    });
    expectEvent(receipt2, "NewMeetup", {
      newMeetup: receipt2.logs[0].args[0], // @TODO maybe there's a better way to retrieve Event params
    });
  });
});

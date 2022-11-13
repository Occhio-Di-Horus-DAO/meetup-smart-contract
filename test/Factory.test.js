const { expect } = require("chai");
const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");

const Community = artifacts.require("Community");
const Meetup = artifacts.require("Meetup");
const Factory = artifacts.require("Factory");

contract("Factory", ([owner, communityFounder, user]) => {
  describe("community", () => {
    it("as OWNER I can change Community contract address", async () => {
      const factory = await Factory.new(Community.address, Meetup.address);
      expect(await factory.communityContractAddress()).to.equal(
        Community.address
      );
      await factory.setCommunityContractAddress(
        "0x2A093aB0ec181034Ed0f46ff449E81fCCC3AdDC6",
        {
          from: owner,
        }
      );
      expect(await factory.communityContractAddress()).to.equal(
        "0x2A093aB0ec181034Ed0f46ff449E81fCCC3AdDC6"
      );
      await expectRevert(
        factory.setCommunityContractAddress(
          "0x2A093aB0ec181034Ed0f46ff449E81fCCC3AdDC6",
          {
            from: user,
          }
        ),
        "Ownable: caller is not the owner."
      );
    });
    it("as OWNER I can change Community creation cost", async () => {
      const factory = await Factory.new(Community.address, Meetup.address);
      let cost = await factory.communityCreationCost();
      expect(cost.toString()).to.equal(web3.utils.toWei("3", "ether"));

      await factory.setCommunityCreationCost(web3.utils.toWei("6", "ether"), {
        from: owner,
      });

      cost = await factory.communityCreationCost();
      expect(cost.toString()).to.equal(web3.utils.toWei("6", "ether"));

      await expectRevert(
        factory.setCommunityCreationCost(web3.utils.toWei("1", "ether"), {
          from: user,
        }),
        "Ownable: caller is not the owner."
      );
    });
    it("as USER I can create a Community by passing 3 Matic", async () => {
      const factory = await Factory.new(Community.address, Meetup.address);
      const cost = await factory.communityCreationCost();
      const receipt = await factory.createCommunity("La Tela di Carlotta", {
        value: cost,
        from: communityFounder,
      });
      const newCommunityAddress = await factory.communities(0);
      const newCommunity = await Community.at(newCommunityAddress);
      expect(await newCommunity.name()).to.equal("La Tela di Carlotta");
      expectEvent(receipt, "NewCommunity", {
        newCommunity: newCommunity.address,
      });
    });
    it("as USER I cannot create a Community by passing less than 3 Matic", async () => {
      const factory = await Factory.new(Community.address, Meetup.address);
      await expectRevert(
        factory.createCommunity("La Tela di Carlotta", {
          value: web3.utils.toWei("2", "ether"),
          from: communityFounder,
        }),
        "Wrong amount of money!"
      );
    });
    it("as USER I can check if an address belongs to a Community contract created by Factory", async () => {
      const factory = await Factory.new(Community.address, Meetup.address);
      const cost = await factory.communityCreationCost();
      await factory.createCommunity("La Tela di Carlotta", {
        value: cost,
        from: communityFounder,
      });
      await factory.createCommunity("Non aprite quella Podcast", {
        value: cost,
        from: communityFounder,
      });
      expect(
        await factory.existsCommunity(
          "0x1D16e6a490F5ff99d36473f908dAb35a9854e50C"
        )
      ).to.be.false;

      const community0 = await factory.communities(0);
      const community1 = await factory.communities(1);
      expect(await factory.existsCommunity(community0)).to.be.true;
      expect(await factory.existsCommunity(community1)).to.be.true;
    });
  });

  describe("meetup", () => {
    it("as OWNER I can change Meetup contract address", async () => {
      const factory = await Factory.new(Community.address, Meetup.address);
      expect(await factory.meetupContractAddress()).to.equal(Meetup.address);
      await factory.setMeetupContractAddress(
        "0x2A093aB0ec181034Ed0f46ff449E81fCCC3AdDC6",
        {
          from: owner,
        }
      );
      expect(await factory.meetupContractAddress()).to.equal(
        "0x2A093aB0ec181034Ed0f46ff449E81fCCC3AdDC6"
      );
      await expectRevert(
        factory.setMeetupContractAddress(
          "0x2A093aB0ec181034Ed0f46ff449E81fCCC3AdDC6",
          {
            from: user,
          }
        ),
        "Ownable: caller is not the owner."
      );
    });
    it("as OWNER I can change Meetup creation cost", async () => {
      const factory = await Factory.new(Community.address, Meetup.address);
      let cost = await factory.meetupCreationCost();
      expect(cost.toString()).to.equal(web3.utils.toWei("2", "ether"));

      await factory.setMeetupCreationCost(web3.utils.toWei("6", "ether"), {
        from: owner,
      });

      cost = await factory.meetupCreationCost();
      expect(cost.toString()).to.equal(web3.utils.toWei("6", "ether"));

      await expectRevert(
        factory.setMeetupCreationCost(web3.utils.toWei("1", "ether"), {
          from: user,
        }),
        "Ownable: caller is not the owner."
      );
    });
    it("as USER I can create a Meetup by passing 2 Matic", async () => {
      const factory = await Factory.new(Community.address, Meetup.address);
      await factory.createCommunity("Mia Community", {
        value: web3.utils.toWei("3", "ether"),
        from: communityFounder,
      });
      const communityAddress = await factory.communities(0);
      const community = await Community.at(communityAddress);
      await community.addOrganizer(user, {
        from: communityFounder,
      });

      const receipt = await factory.createMeetup(
        "Meetup",
        communityAddress,
        0,
        [user],
        {
          value: web3.utils.toWei("2", "ether"),
          from: communityFounder,
        }
      );
      expectEvent(receipt, "NewMeetup");
    });

    it("as USER I cannot create a Meetup by passing less than 2 Matic", async () => {
      const factory = await Factory.new(Community.address, Meetup.address);
      await factory.createCommunity("Mia Community", {
        value: web3.utils.toWei("3", "ether"),
        from: communityFounder,
      });
      const communityAddress = await factory.communities(0);

      await expectRevert(
        factory.createMeetup("Meetup", communityAddress, 0, [], {
          value: web3.utils.toWei("1", "ether"),
          from: communityFounder,
        }),
        "Wrong amount of money!"
      );
    });
    it("as USER I cannot create a Meetup by passing a community that doesn't exist", async () => {
      const factory = await Factory.new(Community.address, Meetup.address);
      const randomCommunity = await Community.new();
      await randomCommunity.initialize(
        "Unofficial community",
        communityFounder
      );

      await expectRevert(
        factory.createMeetup("Meetup", randomCommunity.address, 0, [], {
          value: web3.utils.toWei("2", "ether"),
          from: communityFounder,
        }),
        "The Community does not exist!"
      );
    });
    it("as USER I cannot create a Meetup if i'm not an organizer of the community passed as param", async () => {
      const factory = await Factory.new(Community.address, Meetup.address);
      await factory.createCommunity("Mia Community", {
        value: web3.utils.toWei("3", "ether"),
        from: communityFounder,
      });
      const communityAddress = await factory.communities(0);

      await expectRevert(
        factory.createMeetup("Meetup", communityAddress, 0, [], {
          value: web3.utils.toWei("2", "ether"),
          from: user,
        }),
        "Not a Meetup Organizer!"
      );
    });
    it("as USER I cannot create a Meetup if additional organizers aren't organizers of the community passed as param", async () => {
      const factory = await Factory.new(Community.address, Meetup.address);
      await factory.createCommunity("Mia Community", {
        value: web3.utils.toWei("3", "ether"),
        from: communityFounder,
      });
      const communityAddress = await factory.communities(0);

      await expectRevert(
        factory.createMeetup("Meetup", communityAddress, 0, [user], {
          value: web3.utils.toWei("2", "ether"),
          from: communityFounder,
        }),
        "Not in a  Meetup Organizers' list!"
      );
    });
  });

  it("as OWNER I can withdraw the contract balance", async () => {
    const factory = await Factory.new(Community.address, Meetup.address);
    const cost = await factory.communityCreationCost();
    await factory.createCommunity("La Tela di Carlotta", {
      value: cost,
      from: communityFounder,
    });
    let balance = await web3.eth.getBalance(factory.address);
    expect(balance).to.equal(cost.toString());
    await factory.withdraw(owner, {
      from: owner,
    });
    balance = await web3.eth.getBalance(factory.address);
    expect(balance).to.equal("0");
  });
});

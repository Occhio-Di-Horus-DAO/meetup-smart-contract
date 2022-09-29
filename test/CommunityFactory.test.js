const { expect } = require("chai");
const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");

const Community = artifacts.require("Community");
const CommunityFactory = artifacts.require("CommunityFactory");

contract("CommunityFactory", ([owner, communityFounder, user]) => {
  it("as owner I can change Community contract address", async () => {
    const communityFactory = await CommunityFactory.new(Community.address);
    expect(await communityFactory.communityContractAddress()).to.equal(
      Community.address
    );
    await communityFactory.setCommunityContractAddress(
      "0x2A093aB0ec181034Ed0f46ff449E81fCCC3AdDC6",
      {
        from: owner,
      }
    );
    expect(await communityFactory.communityContractAddress()).to.equal(
      "0x2A093aB0ec181034Ed0f46ff449E81fCCC3AdDC6"
    );
    await expectRevert(
      communityFactory.setCommunityContractAddress(
        "0x2A093aB0ec181034Ed0f46ff449E81fCCC3AdDC6",
        {
          from: user,
        }
      ),
      "Ownable: caller is not the owner."
    );
  });
  it("as owner I can change Community creation cost", async () => {
    const communityFactory = await CommunityFactory.new(Community.address);
    let cost = await communityFactory.communityCreationCost();
    expect(cost.toString()).to.equal(web3.utils.toWei("3", "ether"));

    await communityFactory.setCommunityCreationCost(
      web3.utils.toWei("6", "ether"),
      {
        from: owner,
      }
    );

    cost = await communityFactory.communityCreationCost();
    expect(cost.toString()).to.equal(web3.utils.toWei("6", "ether"));

    await expectRevert(
      communityFactory.setCommunityCreationCost(
        web3.utils.toWei("1", "ether"),
        {
          from: user,
        }
      ),
      "Ownable: caller is not the owner."
    );
  });
  it("as owner I can withdraw the contract balance", async () => {
    const communityFactory = await CommunityFactory.new(Community.address);
    const cost = await communityFactory.communityCreationCost();
    await communityFactory.createCommunity("La Tela di Carlotta", {
      value: cost,
      from: communityFounder,
    });
    let balance = await web3.eth.getBalance(communityFactory.address);
    expect(balance).to.equal(cost.toString());
    await communityFactory.withdraw(owner, {
      from: owner,
    });
    balance = await web3.eth.getBalance(communityFactory.address);
    expect(balance).to.equal("0");
  });
  it("as user I can create a Community by passing 3 Matic", async () => {
    const communityFactory = await CommunityFactory.new(Community.address);
    const cost = await communityFactory.communityCreationCost();
    const receipt = await communityFactory.createCommunity(
      "La Tela di Carlotta",
      {
        value: cost,
        from: communityFounder,
      }
    );
    const newCommunityAddress = await communityFactory.communities(0);
    const newCommunity = await Community.at(newCommunityAddress);
    expect(await newCommunity.name()).to.equal("La Tela di Carlotta");
    expectEvent(receipt, "NewCommunity", {
      newCommunity: newCommunity.address,
    });
  });
  it("as user I cannot create a Community by passing less than 3 Matic", async () => {
    const communityFactory = await CommunityFactory.new(Community.address);
    expectRevert(
      communityFactory.createCommunity("La Tela di Carlotta", {
        value: web3.utils.toWei("2", "ether"),
        from: communityFounder,
      }),
      "Wrong amount of money!"
    );
  });
  it("as user I can check if an address belongs to a Community contract created by CommunityFactory", async () => {
    const communityFactory = await CommunityFactory.new(Community.address);
    const cost = await communityFactory.communityCreationCost();
    await communityFactory.createCommunity("La Tela di Carlotta", {
      value: cost,
      from: communityFounder,
    });
    await communityFactory.createCommunity("Non aprite quella Podcast", {
      value: cost,
      from: communityFounder,
    });
    expect(
      await communityFactory.exists(
        "0x1D16e6a490F5ff99d36473f908dAb35a9854e50C"
      )
    ).to.be.false;

    const community0 = await communityFactory.communities(0);
    const community1 = await communityFactory.communities(1);
    expect(await communityFactory.exists(community0)).to.be.true;
    expect(await communityFactory.exists(community1)).to.be.true;
  });
});

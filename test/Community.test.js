const { expect } = require("chai");
const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");


const Community = artifacts.require("Community");
contract("Community", ([owner, communityFounder, organizer, user]) => {
    it("as owner I can call initialize function", async () => {
        const community = await Community.new();
        await community.initialize("Mia community", communityFounder);
        expect(await community.name()).to.equal("Mia community");
    });
});


const { expect } = require("chai");

const Community = artifacts.require("Community");
contract(
  "Community",
  ([communityFounderAccount, organizerAccount, userAccount]) => {
    it("should accept a community founder account, a list of community organizers and a community name when initialized", async () => {
      const community = await Community.new();
      await community.initialize("Mia community", communityFounderAccount, [
        organizerAccount,
      ]);
      expect(await community.name()).to.equal("Mia community");
      expect(await community.founder()).to.equal(communityFounderAccount);
    });
    it("should assign the role COMMUNITY_FOUNDER to the community founder account passed to initialize", async () => {
      const community = await Community.new();
      const COMMUNITY_FOUNDER_ROLE = await community.COMMUNITY_FOUNDER();
      await community.initialize("Mia community", communityFounderAccount, []);
      expect(
        await community.hasRole(COMMUNITY_FOUNDER_ROLE, communityFounderAccount)
      ).to.be.true;
    });
    it("should assign the role MEETUP_ORGANIZER to the community founder account passed to initialize", async () => {
      const community = await Community.new();
      const MEETUP_ORGANIZER_ROLE = await community.MEETUP_ORGANIZER();
      await community.initialize("Mia community", communityFounderAccount, []);
      expect(
        await community.hasRole(MEETUP_ORGANIZER_ROLE, communityFounderAccount)
      ).to.be.true;
    });
    it("should assign the role MEETUP_ORGANIZER to the meetup organizers accounts passed to initialize", async () => {
      const community = await Community.new();
      const MEETUP_ORGANIZER_ROLE = await community.MEETUP_ORGANIZER();
      await community.initialize("Mia community", communityFounderAccount, [
        organizerAccount,
      ]);
      expect(await community.hasRole(MEETUP_ORGANIZER_ROLE, organizerAccount))
        .to.be.true;
    });
    it("as COMMUNITY_FOUNDER i can add new MEETUP_ORGANIZERs", async () => {
      const community = await Community.new();
      const MEETUP_ORGANIZER_ROLE = await community.MEETUP_ORGANIZER();
      await community.initialize("Mia community", communityFounderAccount, []);
      expect(await community.hasRole(MEETUP_ORGANIZER_ROLE, organizerAccount))
        .to.be.false;
      await community.addOrganizer(organizerAccount, {
        from: communityFounderAccount,
      });
      expect(await community.hasRole(MEETUP_ORGANIZER_ROLE, organizerAccount))
        .to.be.true;
    });
    it("as COMMUNITY_FOUNDER i can remove MEETUP_ORGANIZERs", async () => {
      const community = await Community.new();
      const MEETUP_ORGANIZER_ROLE = await community.MEETUP_ORGANIZER();
      await community.initialize("Mia community", communityFounderAccount, []);
      await community.addOrganizer(organizerAccount, {
        from: communityFounderAccount,
      });
      expect(await community.hasRole(MEETUP_ORGANIZER_ROLE, organizerAccount))
        .to.be.true;
      await community.removeOrganizer(organizerAccount, {
        from: communityFounderAccount,
      });
      expect(await community.hasRole(MEETUP_ORGANIZER_ROLE, organizerAccount))
        .to.be.false;
    });
    it("as COMMUNITY_FOUNDER i can tranfer my role to another account", async () => {
      const community = await Community.new();
      const COMMUNITY_FOUNDER_ROLE = await community.COMMUNITY_FOUNDER();
      await community.initialize("Mia community", communityFounderAccount, []);
      expect(
        await community.hasRole(COMMUNITY_FOUNDER_ROLE, communityFounderAccount)
      ).to.be.true;
      expect(await community.hasRole(COMMUNITY_FOUNDER_ROLE, userAccount)).to.be
        .false;
      await community.transferFounder(userAccount, {
        from: communityFounderAccount,
      });
      expect(await community.hasRole(COMMUNITY_FOUNDER_ROLE, userAccount)).to.be
        .true;
      expect(
        await community.hasRole(COMMUNITY_FOUNDER_ROLE, communityFounderAccount)
      ).to.be.false;
    });
  }
);

// const { expect } = require("chai");
// const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
// const { web3 } = require("@openzeppelin/test-helpers/src/setup");

// const Meetup = artifacts.require("Meetup");
// const Organization = artifacts.require("Organization");

// contract("Meetup", ([owner, organizer1, organizer2, user1, user2]) => {
//   /* let organization, meetup;

//   beforeEach(async () => {
//     organization = await Organization.new(
//       "OcchioDiHorusDAO",
//       [organizer1, organizer2],
//       [50, 50],
//       { from: owner }
//     );
//     meetup = await Meetup.new(organization.address, { from: owner });
//   });

//   it("user can know organizers", async () => {
//     const organizationContractAddress = await meetup.organization({
//       from: user1,
//     });
//     const organization = await Organization.at(organizationContractAddress);
//     const organizers = await organization.getOrganizers();
//     expect(organizers[0]).to.equal(organizer1);
//     expect(organizers[1]).to.equal(organizer2);
//   });

//   it("user can know how many topics have been added until now", async () => {
//     for (let i = 0; i < 10; i++) {
//       await meetup.addTopic(`topic ${i}`, {
//         from: i % 2 ? user1 : user2, // it's user indipendent
//         value: web3.utils.toWei("0.5", "ether"),
//       });
//     }

//     const numberOfTopics = await meetup.getTopicsCount();
//     expect(Number(numberOfTopics)).to.equal(10);
//   });

//   it("user can add a new topic passing a message and 0.5 MATIC", async () => {
//     const msg =
//       "I want to discuss the difference between Ethereum and Bitcoin.";
//     await meetup.addTopic(msg, {
//       from: user1,
//       value: web3.utils.toWei("0.5", "ether"),
//     });
//     const topic = await meetup.topics(0);
//     expect(topic.message).to.equal(msg);
//     expect(Number(topic.likes)).to.equal(0);
//     expect(topic.user).to.equal(user1);

//     await meetup.addTopic("another topic", {
//       from: user2,
//       value: web3.utils.toWei("0.5", "ether"),
//     });
//     const topic2 = await meetup.topics(1);
//     expect(topic2.message).to.equal("another topic");
//     expect(Number(topic.likes)).to.equal(0);
//     expect(topic2.user).to.equal(user2);

//     const balance = await web3.eth.getBalance(meetup.address);
//     expect(balance).to.equal(web3.utils.toWei("1", "ether"));
//   });

//   it("user cannot add a new topic passing less or more that 0.5 MATIC", async () => {
//     await expectRevert(
//       meetup.addTopic("I'm poor", {
//         from: user1,
//         value: web3.utils.toWei("0.49", "ether"),
//       }),
//       "Wrong amount of money!"
//     );
//     await expectRevert(
//       meetup.addTopic("I'm rich", {
//         from: user2,
//         value: web3.utils.toWei("1000", "ether"),
//       }),
//       "Wrong amount of money!"
//     );
//     const balance = await web3.eth.getBalance(meetup.address);
//     expect(Number(balance)).to.equal(0);
//   });

//   it("users cannot add more than 10 topics for a meetup", async () => {
//     for (let i = 0; i < 10; i++) {
//       await meetup.addTopic(`topic ${i}`, {
//         from: i % 2 ? user1 : user2, // it's user indipendent
//         value: web3.utils.toWei("0.5", "ether"),
//       });
//     }
//     expect((await meetup.topics(9)).message).to.equal("topic 9");
//     await expectRevert(
//       meetup.addTopic("The 11th topic", {
//         from: user1,
//         value: web3.utils.toWei("0.5", "ether"),
//       }),
//       "Max 10 topics allowed"
//     );
//     const balance = await web3.eth.getBalance(meetup.address);
//     expect(balance).to.equal(web3.utils.toWei("5", "ether"));
//   });

//   it("user can like a topic passing exactly 0.1 MATIC", async () => {
//     await meetup.addTopic("Topic 1", {
//       from: user1,
//       value: web3.utils.toWei("0.5", "ether"),
//     });
//     await meetup.like(0, {
//       from: user2,
//       value: web3.utils.toWei("0.1", "ether"),
//     });
//     const topic = await meetup.topics(0);
//     expect(Number(topic.likes)).to.equal(1);
//     const balance = await web3.eth.getBalance(meetup.address);
//     expect(balance).to.equal(web3.utils.toWei("0.6", "ether"));
//   });

//   it("user cannot like a non existing topic", async () => {
//     await expectRevert.unspecified(
//       meetup.like(0, {
//         from: user2,
//         value: web3.utils.toWei("0.1", "ether"),
//       })
//     );
//   });

//   it("user cannot like a topic he proposed", async () => {
//     await meetup.addTopic("Topic 1", {
//       from: user1,
//       value: web3.utils.toWei("0.5", "ether"),
//     });
//     await expectRevert(
//       meetup.like(0, {
//         from: user1, // same user that add that topic
//         value: web3.utils.toWei("0.1", "ether"),
//       }),
//       "Operation not permitted!"
//     );
//   });

//   it("organizers can withdraw the MATIC balance accumulated, the balance is moved to Organization contract", async () => {
//     await meetup.addTopic("Topic 1", {
//       from: user1,
//       value: web3.utils.toWei("0.5", "ether"),
//     });
//     await meetup.addTopic("Topic 2", {
//       from: user2,
//       value: web3.utils.toWei("0.5", "ether"),
//     });
//     const meetupBalance = await web3.eth.getBalance(meetup.address);

//     await meetup.withdraw({
//       from: organizer1,
//     });

//     const organizationContractAddress = await meetup.organization();
//     const organizersBalance = await web3.eth.getBalance(
//       organizationContractAddress
//     );
//     expect(organizersBalance).to.equal(meetupBalance);
//     expect(await web3.eth.getBalance(meetup.address)).to.equal("0");
//   });

//   it("contract owner can withdraw the MATIC balance accumulated, the balance is moved to Organization contract", async () => {
//     await meetup.addTopic("Topic 1", {
//       from: user1,
//       value: web3.utils.toWei("0.5", "ether"),
//     });
//     await meetup.addTopic("Topic 2", {
//       from: user2,
//       value: web3.utils.toWei("0.5", "ether"),
//     });
//     const meetupBalance = await web3.eth.getBalance(meetup.address);

//     await meetup.withdraw({
//       from: owner,
//     });

//     const organizationContractAddress = await meetup.organization();
//     const organizationBalance = await web3.eth.getBalance(
//       organizationContractAddress
//     );
//     expect(organizationBalance).to.equal(meetupBalance);
//     expect(await web3.eth.getBalance(meetup.address)).to.equal("0");
//   });

//   it("user cannot withdraw the MATIC balance accumulated", async () => {
//     await meetup.addTopic("Topic 1", {
//       from: user1,
//       value: web3.utils.toWei("0.5", "ether"),
//     });

//     await expectRevert.unspecified(
//       meetup.withdraw({
//         from: user1,
//       })
//     );
//   });

//   it("should emit NewTopic event when a new topic is submitted", async () => {
//     const receipt = await meetup.addTopic("Topic 1", {
//       from: user1,
//       value: web3.utils.toWei("0.5", "ether"),
//     });
//     expectEvent(receipt, "NewTopic", {
//       user: user1,
//       message: "Topic 1",
//     });
//   });
//   it("should emit NewLike event when a new like is submitted", async () => {
//     await meetup.addTopic("Topic 1", {
//       from: user1,
//       value: web3.utils.toWei("0.5", "ether"),
//     });

//     const receipt = await meetup.like(0, {
//       from: user2,
//       value: web3.utils.toWei("0.1", "ether"),
//     });

//     expectEvent(receipt, "NewLike", {
//       topicIndex: "0",
//       likes: "1",
//     });
//   }); */
// });

// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Organization.sol";
import "./Meetup.sol";

contract MeetupFactory is Ownable {
  Meetup[] public meetups;

  event NewMeetup(Meetup newMeetup);

  function createMeetup(Organization _organization) external onlyOwner {
    Meetup meetup = new Meetup(_organization);
    meetups.push(meetup);
    emit NewMeetup(meetup);
  }
}

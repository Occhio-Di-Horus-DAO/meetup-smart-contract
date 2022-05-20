// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./Organization.sol";
import "./Meetup.sol";

contract MeetupFactory {
  Meetup[] public meetups;

  event NewMeetup(Meetup newMeetup);

  function createMeetup(Organization _organization) external {
    Meetup meetup = new Meetup(_organization);
    meetups.push(meetup);
    emit NewMeetup(meetup);
  }
}

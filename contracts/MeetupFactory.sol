// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./PayOrganizers.sol";
import "./Meetup.sol";

contract MeetupFactory {
  Meetup[] public meetups;

  event NewMeetup(Meetup newMeetup);

  function createMeetup(PayOrganizers _payOrganizers) external {
    Meetup meetup = new Meetup(_payOrganizers);
    meetups.push(meetup);
    emit NewMeetup(meetup);
  }
}

//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Community is Initializable, AccessControl  {
 


  bytes32 public constant COMMUNITY_FOUNDER = keccak256("COMMUNITY_FOUNDER");
  bytes32 public constant MEETUP_ORGANIZER = keccak256("MEETUP_ORGANIZER");

  string public name;
  address public founder;

  function initialize(string memory _name, address _founder) external initializer {
    name = _name;
    founder = _founder;

  _setupRole(COMMUNITY_FOUNDER, _founder);
  _setupRole(MEETUP_ORGANIZER, _founder);
  }


  function addOrganizer(address _account) external onlyRole(COMMUNITY_FOUNDER) {
    _grantRole(MEETUP_ORGANIZER, _account);
  }

  function removeOrganizer(address _account) external onlyRole(COMMUNITY_FOUNDER) {
    _revokeRole(MEETUP_ORGANIZER, _account);
  }


 function transferFounder(address _account) external onlyRole(COMMUNITY_FOUNDER) {
   renounceRole(COMMUNITY_FOUNDER, msg.sender);
   _grantRole(MEETUP_ORGANIZER, msg.sender);
   _grantRole(COMMUNITY_FOUNDER, _account);
   
  }
}



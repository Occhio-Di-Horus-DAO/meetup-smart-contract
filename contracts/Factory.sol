// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

import "./Community.sol";
import "./Meetup.sol";

contract Factory is Ownable {
  uint256 public communityCreationCost = 3 ether;
  address public communityContractAddress;
  address[] public communities;
  address public meetupContractAddress;///
  //address[] public meetupOrganizers; //considerare di aggiungere questa parte in Community.sol, e fare ''.push'' dopo ogni organizer added, cosi da avere un array di Organizers///
  //address[] public meetups;
  uint256 public meetupCreationCost = 2 ether;

  event NewCommunity(address newCommunity);
  event NewMeetup(address newMeetup);
  
  

  constructor(address _communityContractAddress, address _meetupContractAddress) {
    communityContractAddress = _communityContractAddress;
    meetupContractAddress = _meetupContractAddress;
  }
  

  function setCommunityContractAddress(address _communityContractAddress) external onlyOwner {
    communityContractAddress = _communityContractAddress;
  }

  function setCommunityCreationCost(uint256 _price) external onlyOwner {
    communityCreationCost = _price;
  }

  function createCommunity(string calldata _name) external payable {
    require(msg.value == communityCreationCost, "Wrong amount of money!");
    address newCommunity = Clones.clone(communityContractAddress);
    Community(newCommunity).initialize(_name, msg.sender);
    communities.push(newCommunity);
    emit NewCommunity(newCommunity);
  }

  function existsCommunity(address _communityAddress) public view returns(bool) {
    bool addressExists = false;
    // loop in reverse order because this function is primary used for recent created communities
    for(uint i = communities.length; i > 0; i--) {
      if(communities[i - 1] == _communityAddress) {
        addressExists = true;
        break;
      }
    }
    return addressExists;
  }

  function withdraw(address _receiver) external onlyOwner {
    uint256 amount = address(this).balance;
    (bool success, ) = _receiver.call{value: amount}("");
    require(success, "Withdraw failed!");
  }

              
  //////////// QUI INIZIA LA SFIDA DI SUSHIPAPI DETTO SOLIDITYNOOB/////////////////

  function setMeetupCreationCost(uint256 _price) external onlyOwner {
    meetupCreationCost = _price;
  }

  function setMeetupContractAddress(address _meetupContractAddress) external onlyOwner {
    meetupContractAddress = _meetupContractAddress;
  }



  function createMeetup(string calldata _meetupName, Community _community, uint256 _meetupStartDate, address[] memory _meetupOrganizers) external payable  {
    require(msg.value == meetupCreationCost, "Wrong amount of money : cannot create Meetup");
    require(existsCommunity(address(_community)),"The Community does not exist!");
    require(_community.isOrganizer(msg.sender),"Not a Meetup Organizer!");
    for(uint i = 0; i < _meetupOrganizers.length; i ++) {
      require(_community.isOrganizer(_meetupOrganizers[i]),"Not in a  Meetup Organizers' list!");
      }
    address newMeetup = Clones.clone(meetupContractAddress);
    Meetup(newMeetup).initialize();
    //meetups.push(newMeetup);
    emit NewMeetup(newMeetup);

   
    
    
  }
}
// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

import "./Community.sol";

contract Factory is Ownable {
  uint256 public communityCreationCost = 3 ether;
  address public communityContractAddress;
  address[] public communities;

  event NewCommunity(address newCommunity);

  constructor(address _communityContractAddress) {
    communityContractAddress = _communityContractAddress;
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

  function existsCommunity(address _communityAddress) external view returns(bool) {
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
}

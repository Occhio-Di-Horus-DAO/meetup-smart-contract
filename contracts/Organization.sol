// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract Organization is PaymentSplitter {

  string name;
  address[] organizers;

  constructor(string memory _name, address[] memory _organizers, uint256[] memory _shares) PaymentSplitter(_organizers, _shares) payable {
    name = _name;
    organizers = _organizers;
  }

  function getOrganizers() public view returns (address[] memory) {
    return organizers;
  }

  function getName() public view returns (string memory) {
    return name;
  }
}

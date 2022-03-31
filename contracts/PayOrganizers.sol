// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract PayOrganizers is PaymentSplitter {

  address[] organizers;

  constructor(address[] memory _organizers, uint256[] memory _shares) PaymentSplitter(_organizers, _shares) payable {
    organizers = _organizers;
  }

  function getOrganizers() public view returns (address[] memory) {
    return organizers;
  }
}

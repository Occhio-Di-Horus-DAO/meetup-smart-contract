// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Community is Initializable {
  string public name;
  address public founder;

  function initialize(string memory _name, address _founder) external initializer {
    name = _name;
    founder = _founder;
  }
}
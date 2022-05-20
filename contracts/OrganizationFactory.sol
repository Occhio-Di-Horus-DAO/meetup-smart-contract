// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "./Organization.sol";

contract OrganizationFactory {
  Organization[] public organizations;

  event NewOrganization(Organization newOrganization);

  function createOrganization(string memory _name, address[] memory _organizers, uint256[] memory _shares) external {
    Organization organization = new Organization(_name, _organizers, _shares);
    organizations.push(organization);
    emit NewOrganization(organization);
  }
}

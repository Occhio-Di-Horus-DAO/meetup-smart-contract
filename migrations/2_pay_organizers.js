const PayOrganizers = artifacts.require("PayOrganizers");

module.exports = function (_deployer, _network, _accounts) {
  if (_network === "development") {
    _deployer.deploy(PayOrganizers, [_accounts[1], _accounts[2]], [50, 50]);
  } else {
    _deployer.deploy(
      PayOrganizers,
      [
        "0x76E7bCce82776338fE033AeA55a937f3a3F3022C",
        "0xd4d0A848fB4Cc2e22F888400CF7004f79a75ACA8",
      ],
      [50, 50]
    );
  }
};

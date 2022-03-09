// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "./PayOrganizers.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";

// import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract Meetup is AccessControl {
    
    struct Topic {
        address user;
        uint256 likes;
        string message;
    }

    uint256 private constant LIKE_COST = 0.1 ether;
    uint256 private constant ADD_TOPIC_COST = 0.5 ether;

    bytes32 private constant ORGANIZER_ROLE = keccak256("ORGANIZER_ROLE");

    address payable private owner;
    PayOrganizers public payOrganizers;

    Topic[] public topics;

    event NewTopic(address user, string message);
    event NewLike(uint8 topicIndex, uint256 likes);

    modifier cost(uint256 price) {
        require(msg.value == price, "Wrong amount of money!");
        _;
    }

    constructor(PayOrganizers _payOrganizers) {
        owner = payable(msg.sender);
        payOrganizers = _payOrganizers;
        address[] memory organizers = _payOrganizers.getOrganizers();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        for (uint256 i = 0; i < organizers.length; i++) {
            _setupRole(ORGANIZER_ROLE, organizers[i]);
        }
    }

    function addTopic(string calldata topic)
        external
        payable
        cost(ADD_TOPIC_COST)
    {
        // +1 because the new topic is not yet added to the list
        require(topics.length + 1 <= 10, "Max 10 topics allowed");
        topics.push(Topic({user: msg.sender, likes: 0, message: topic}));
        emit NewTopic(msg.sender, topic);
    }

    function like(uint8 index) external payable cost(LIKE_COST) {
        require(index >= 0 && index < topics.length);
        Topic storage t = topics[index];
        require(msg.sender != t.user, "Operation not permitted!"); // the user that creates the topic cannot like it
        t.likes++;
        emit NewLike(index, t.likes);
    }

    function withdraw() external returns (bool) {
        require(
            hasRole(ORGANIZER_ROLE, msg.sender) ||
                hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Operation not permitted!"
        );

        uint256 amount = address(this).balance;
        (bool success, ) = address(payOrganizers).call{value: amount}("");
        require(success);
        return success;
    }

    function kill() external onlyRole(DEFAULT_ADMIN_ROLE) {
        selfdestruct(owner);
    }
}

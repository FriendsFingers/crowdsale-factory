// SPDX-License-Identifier: MIT

pragma solidity ^0.6.10;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Roles is AccessControl {

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR");

    modifier onlyOperator() {
        require(hasRole(OPERATOR_ROLE, _msgSender()), "Roles: caller does not have the OPERATOR role");
        _;
    }

    constructor () public {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(OPERATOR_ROLE, _msgSender());
    }
}

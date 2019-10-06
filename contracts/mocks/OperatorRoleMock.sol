pragma solidity ^0.5.12;

import "../access/roles/OperatorRole.sol";

contract OperatorRoleMock is OperatorRole {
    function removeOperator(address account) public {
        _removeOperator(account);
    }

    function onlyOperatorMock() public view onlyOperator {} // solhint-disable-line  no-empty-blocks
}

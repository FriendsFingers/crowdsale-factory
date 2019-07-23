pragma solidity ^0.5.10;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "eth-token-recover/contracts/TokenRecover.sol";
import "../access/roles/OperatorRole.sol";

/**
 * @title Contributions
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Utility contract where to save any information about Crowdsale contributions
 */
contract Contributions is OperatorRole, TokenRecover {
    using SafeMath for uint256;

    struct Contributor {
        uint256 weiAmount;
        uint256 tokenAmount;
        bool exists;
    }

    // the number of sold tokens
    uint256 private _totalSoldTokens;

    // the number of wei raised
    uint256 private _totalWeiRaised;

    // list of addresses who contributed in crowdsales
    address[] private _addresses;

    // map of contributors
    mapping(address => Contributor) private _contributors;

    constructor() public {} // solhint-disable-line no-empty-blocks

    /**
     * @return the number of sold tokens
     */
    function totalSoldTokens() public view returns (uint256) {
        return _totalSoldTokens;
    }

    /**
     * @return the number of wei raised
     */
    function totalWeiRaised() public view returns (uint256) {
        return _totalWeiRaised;
    }

    /**
     * @return address of a contributor by list index
     */
    function getContributorAddress(uint256 index) public view returns (address) {
        return _addresses[index];
    }

    /**
     * @dev return the contributions length
     * @return uint representing contributors number
     */
    function getContributorsLength() public view returns (uint) {
        return _addresses.length;
    }

    /**
     * @dev get wei contribution for the given address
     * @param account Address has contributed
     * @return uint256
     */
    function weiContribution(address account) public view returns (uint256) {
        return _contributors[account].weiAmount;
    }

    /**
     * @dev get token balance for the given address
     * @param account Address has contributed
     * @return uint256
     */
    function tokenBalance(address account) public view returns (uint256) {
        return _contributors[account].tokenAmount;
    }

    /**
     * @dev check if a contributor exists
     * @param account The address to check
     * @return bool
     */
    function contributorExists(address account) public view returns (bool) {
        return _contributors[account].exists;
    }

    /**
     * @dev add contribution into the contributions array
     * @param account Address being contributing
     * @param weiAmount Amount of wei contributed
     * @param tokenAmount Amount of token received
     */
    function addBalance(address account, uint256 weiAmount, uint256 tokenAmount) public onlyOperator {
        if (!_contributors[account].exists) {
            _addresses.push(account);
            _contributors[account].exists = true;
        }

        _contributors[account].weiAmount = _contributors[account].weiAmount.add(weiAmount);
        _contributors[account].tokenAmount = _contributors[account].tokenAmount.add(tokenAmount);

        _totalWeiRaised = _totalWeiRaised.add(weiAmount);
        _totalSoldTokens = _totalSoldTokens.add(tokenAmount);
    }

    /**
     * @dev remove the `operator` role from address
     * @param account Address you want to remove role
     */
    function removeOperator(address account) public onlyOwner {
        _removeOperator(account);
    }
}

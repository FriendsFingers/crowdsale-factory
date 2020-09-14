// SPDX-License-Identifier: MIT

pragma solidity ^0.7.1;

import "eth-token-recover/contracts/TokenRecover.sol";
import "./FriendlyCrowdsale.sol";

contract CrowdsaleFactory is Roles, TokenRecover {
    using EnumerableSet for EnumerableSet.AddressSet;
    using Address for address;

    // address where fee are collected
    address payable private _feeWallet;

    // per mille rate fee
    uint256 private _feePerMille;

    // List of crowdsales
    EnumerableSet.AddressSet private _crowdsales;

    event CrowdsaleCreated(address crowdsale);

    /**
     * @param feeWallet Address of the fee wallet
     * @param feePerMille The per mille rate fee
     */
    constructor(address payable feeWallet, uint256 feePerMille) {
        require(feeWallet != address(0), "CrowdsaleFactory: feeWallet is the zero address");

        _feeWallet = feeWallet;
        _feePerMille = feePerMille;
    }

    /**
     * @return address where fee are collected.
     */
    function feeWallet() external view returns (address) {
        return _feeWallet;
    }

    /**
     * @return the per mille rate fee.
     */
    function feePerMille() external view returns (uint256) {
        return _feePerMille;
    }

    function createCrowdsale(
        uint256 openingTime,
        uint256 closingTime,
        uint256 cap,
        uint256 goal,
        uint256 rate,
        address payable wallet,
        IERC20 token
    )
        external
    {
        FriendlyCrowdsale crowdsale = new FriendlyCrowdsale(
            openingTime,
            closingTime,
            cap,
            goal,
            rate,
            wallet,
            token,
            _feeWallet,
            _feePerMille
        );

        _crowdsales.add(address(crowdsale));

        crowdsale.grantRole(OPERATOR_ROLE, owner());

        emit CrowdsaleCreated(address(crowdsale));
    }

    /**
     * @dev Return the crowdsales length.
     * @return uint representing crowdsales number
     */
    function crowdsalesNumber() public view returns (uint) {
        return _crowdsales.length();
    }

    /**
     * @dev Check if a crowdsale exists.
     * @param crowdsale The address to check
     * @return bool
     */
    function crowdsaleExists(address crowdsale) public view returns (bool) {
        return _crowdsales.contains(crowdsale);
    }

    /**
     * @dev Return the crowdsale address by index.
     * @param index A progressive index of crowdsale addresses
     * @return address of an crowdsale by list index
     */
    function getCrowdsaleAddress(uint index) public view returns (address) {
        return _crowdsales.at(index);
    }
}

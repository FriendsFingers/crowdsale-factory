pragma solidity ^0.5.13;

import "eth-token-recover/contracts/TokenRecover.sol";
import "./FriendlyCrowdsale.sol";

contract CrowdsaleFactory is TokenRecover {

    // address where fee are collected
    address payable private _feeWallet;

    // per mille rate fee
    uint256 public _feePerMille;

    /**
     * @param feeWallet Address of the fee wallet
     * @param feePerMille The per mille rate fee
     */
    constructor(
        address payable feeWallet,
        uint256 feePerMille
    )
    public
    {
        require(feeWallet != address(0), "CrowdsaleFactory: feeWallet is the zero address");

        _feeWallet = feeWallet;
        _feePerMille = feePerMille;
    }

    /**
     * @return address where fee are collected.
     */
    function feeWallet() public view returns (address) {
        return _feeWallet;
    }

    /**
     * @return the per mille rate fee.
     */
    function feePerMille() public view returns (uint256) {
        return _feePerMille;
    }
}

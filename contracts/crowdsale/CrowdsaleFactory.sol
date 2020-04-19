pragma solidity ^0.6.6;

import "eth-token-recover/contracts/TokenRecover.sol";
import "./FriendlyCrowdsale.sol";

contract CrowdsaleFactory is Roles, TokenRecover {

    // address where fee are collected
    address payable private _feeWallet;

    // per mille rate fee
    uint256 private _feePerMille;

    event CrowdsaleCreated(address crowdsale);

    /**
     * @param feeWallet Address of the fee wallet
     * @param feePerMille The per mille rate fee
     */
    constructor(address payable feeWallet, uint256 feePerMille) public {
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

        emit CrowdsaleCreated(address(crowdsale));
    }
}

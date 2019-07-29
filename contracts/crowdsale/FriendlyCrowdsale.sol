pragma solidity ^0.5.10;

import "openzeppelin-solidity/contracts/crowdsale/distribution/FinalizableCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/PausableCrowdsale.sol";
import "../utils/Contributions.sol";

/**
 * @title FriendlyCrowdsale
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev FriendlyCrowdsale is a base contract for managing a token crowdsale,
 * allowing investors to purchase tokens with ether.
 */
contract FriendlyCrowdsale is FinalizableCrowdsale, CappedCrowdsale, PausableCrowdsale {

    // minimum amount of funds to be raised in weis
    uint256 private _goal;

    // reference to Contributions contract
    Contributions private _contributions;

    /**
     * @param openingTime Crowdsale opening time
     * @param closingTime Crowdsale closing time
     * @param cap Max amount of wei to be contributed
     * @param goal Funding goal
     * @param rate Number of token units a buyer gets per wei
     * @param wallet Address where collected funds will be forwarded to
     * @param token Address of the token being sold
     * @param contributions Address of the contributions contract
     */
    constructor(
        uint256 openingTime,
        uint256 closingTime,
        uint256 cap,
        uint256 goal,
        uint256 rate,
        address payable wallet,
        IERC20 token,
        address contributions
    )
        public
        Crowdsale(rate, wallet, token)
        TimedCrowdsale(openingTime, closingTime)
        CappedCrowdsale(cap)
    {
        require(goal > 0, "FriendlyCrowdsale: goal is 0");
        require(goal <= cap, "FriendlyCrowdsale: goal is not less or equal cap");

        require(contributions != address(0), "FriendlyCrowdsale: contributions is the zero address");

        _goal = goal;
        _contributions = Contributions(contributions);
    }

    /**
     * @return minimum amount of funds to be raised in wei.
     */
    function goal() public view returns (uint256) {
        return _goal;
    }

    /**
     * @return the crowdsale contributions contract address
     */
    function contributions() public view returns (Contributions) {
        return _contributions;
    }

    /**
     * @return false if the ico is not started, true if the ico is started and running, true if the ico is completed
     */
    function started() public view returns (bool) {
        return block.timestamp >= openingTime(); // solhint-disable-line not-rely-on-time
    }

    /**
     * @return false if the ico is not started, false if the ico is started and running, true if the ico is completed
     */
    function ended() public view returns (bool) {
        return hasClosed() || capReached();
    }

    /**
     * @dev Checks whether funding goal was reached.
     * @return Whether funding goal was reached
     */
    function goalReached() public view returns (bool) {
        return weiRaised() >= _goal;
    }

    /**
     * @dev Investors can claim refunds here if crowdsale is unsuccessful.
     * @param refundee Whose refund will be claimed.
     */
    function claimRefund(address payable refundee) public {
        require(finalized(), "FriendlyCrowdsale: not finalized");
        require(!goalReached(), "FriendlyCrowdsale: goal not reached");

        // TODO
        // _escrow.withdraw(refundee);
    }

    /**
     * @dev Escrow finalization task, called when finalize() is called.
     */
    function _finalization() internal {
        if (goalReached()) {
            // TODO
            // _escrow.close();
            // _escrow.beneficiaryWithdraw();
        } else {
            // TODO
            // _escrow.enableRefunds();
        }

        super._finalization();
    }

    /**
     * @dev Overrides Crowdsale fund forwarding, sending funds to escrow.
     */
    function _forwardFunds() internal {
        // TODO
        // does nothing
        // _escrow.deposit.value(msg.value)(msg.sender);
    }
}

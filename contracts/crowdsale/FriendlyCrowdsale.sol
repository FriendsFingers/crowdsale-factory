pragma solidity ^0.5.10;

import "openzeppelin-solidity/contracts/crowdsale/distribution/FinalizableCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/PausableCrowdsale.sol";

/**
 * @title FriendlyCrowdsale
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev FriendlyCrowdsale is a base contract for managing a token crowdsale,
 * allowing investors to purchase tokens with ether.
 */
contract FriendlyCrowdsale is FinalizableCrowdsale, CappedCrowdsale, PausableCrowdsale {
    enum State { Active, Refunding, Closed }

    event RefundsClosed();
    event RefundsEnabled();
    event Withdrawn(address indexed refundee, uint256 weiAmount);

    State private _state;

    // list of addresses who contributed in crowdsales
    address[] private _investors;

    // map of contributors
    mapping(address => uint256) private _deposits;

    // minimum amount of funds to be raised in weis
    uint256 private _goal;

    /**
     * @param openingTime Crowdsale opening time
     * @param closingTime Crowdsale closing time
     * @param cap Max amount of wei to be contributed
     * @param goal Funding goal
     * @param rate Number of token units a buyer gets per wei
     * @param wallet Address where collected funds will be forwarded to
     * @param token Address of the token being sold
     */
    constructor(
        uint256 openingTime,
        uint256 closingTime,
        uint256 cap,
        uint256 goal,
        uint256 rate,
        address payable wallet,
        IERC20 token
    )
        public
        Crowdsale(rate, wallet, token)
        TimedCrowdsale(openingTime, closingTime)
        CappedCrowdsale(cap)
    {
        require(goal > 0, "FriendlyCrowdsale: goal is 0");
        require(goal <= cap, "FriendlyCrowdsale: goal is not less or equal cap");

        _goal = goal;
        _state = State.Active;
    }

    /**
     * @return minimum amount of funds to be raised in wei.
     */
    function goal() public view returns (uint256) {
        return _goal;
    }

    /**
     * @return The current state of the escrow.
     */
    function state() public view returns (State) {
        return _state;
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
     * @dev Return the investors length.
     * @return uint representing investors number
     */
    function investorsNumber() public view returns (uint) {
        return _investors.length;
    }

    /**
     * @dev Check if a investor exists.
     * @param account The address to check
     * @return bool
     */
    function investorExists(address account) public view returns (bool) {
        return weiContribution(account) > 0;
    }

    /**
     * @dev Return the investors address by index.
     * @param index A progressive index of investor addresses
     * @return address of an investor by list index
     */
    function getInvestorAddress(uint index) public view returns (address) {
        return _investors[index];
    }

    /**
     * @dev get wei contribution for the given address
     * @param account Address has contributed
     * @return uint256
     */
    function weiContribution(address account) public view returns (uint256) {
        return _deposits[account];
    }

    /**
     * @dev Investors can claim refunds here if crowdsale is unsuccessful.
     * @param refundee Whose refund will be claimed.
     */
    function claimRefund(address payable refundee) public {
        require(finalized(), "FriendlyCrowdsale: not finalized");
        require(!goalReached(), "FriendlyCrowdsale: goal reached");
        require(_state == State.Refunding, "FriendlyCrowdsale: not Refunding");
        require(investorExists(refundee), "FriendlyCrowdsale: no deposit");

        uint256 payment = _deposits[refundee];

        _deposits[refundee] = 0;

        refundee.transfer(payment);

        emit Withdrawn(refundee, payment);
    }

    /**
     * @dev Escrow finalization task, called when finalize() is called.
     */
    function _finalization() internal {
        if (goalReached()) {
            _close();
            wallet().transfer(address(this).balance);
        } else {
            _enableRefunds();
        }
    }

    /**
     * @dev Overrides Crowdsale fund forwarding, keep funds here.
     */
    function _forwardFunds() internal {
        address account = msg.sender;

        if (!investorExists(account)) {
            _investors.push(account);
        }

        _deposits[account] = _deposits[account].add(msg.value);
    }

    /**
     * @dev Allows for the wallet to withdraw their funds, rejecting further deposits.
     */
    function _close() internal {
        require(_state == State.Active, "FriendlyCrowdsale: can only close while active");
        _state = State.Closed;

        // TODO add fee percent

        emit RefundsClosed();
    }

    /**
     * @dev Allows for refunds to take place, rejecting further deposits.
     */
    function _enableRefunds() internal {
        require(_state == State.Active, "FriendlyCrowdsale: can only enable refunds while active");
        _state = State.Refunding;
        emit RefundsEnabled();
    }
}

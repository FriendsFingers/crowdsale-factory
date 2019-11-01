pragma solidity ^0.5.12;

import "@openzeppelin/contracts/crowdsale/distribution/FinalizableCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "../access/roles/OperatorRole.sol";

/**
 * @title FriendlyCrowdsale
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev FriendlyCrowdsale is a base contract for managing a token crowdsale,
 * allowing investors to purchase tokens with ether.
 */
contract FriendlyCrowdsale is FinalizableCrowdsale, CappedCrowdsale, OperatorRole {
    enum State { Review, Active, Refunding, Closed, Expired }

    struct Escrow {
        bool exists;
        uint256 deposit;
    }

    event Enabled();
    event RefundsClosed();
    event RefundsEnabled();
    event Expired();
    event Withdrawn(address indexed refundee, uint256 weiAmount);

    State private _state;

    // address where fee are collected
    address payable private _feeWallet;

    // per mille rate fee
    uint256 public _feePerMille;

    // list of addresses who contributed in crowdsales
    address[] private _investors;

    // map of investors
    mapping(address => Escrow) private _escrowList;

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
     * @param feeWallet Address of the fee wallet
     * @param feePerMille The per mille rate fee
     */
    constructor(
        uint256 openingTime,
        uint256 closingTime,
        uint256 cap,
        uint256 goal,
        uint256 rate,
        address payable wallet,
        IERC20 token,
        address payable feeWallet,
        uint256 feePerMille
    )
        public
        Crowdsale(rate, wallet, token)
        TimedCrowdsale(openingTime, closingTime)
        CappedCrowdsale(cap)
    {
        require(goal > 0, "FriendlyCrowdsale: goal is 0");
        require(goal <= cap, "FriendlyCrowdsale: goal is not less or equal cap");
        require(feeWallet != address(0), "FriendlyCrowdsale: feeWallet is the zero address");

        _goal = goal;
        _feeWallet = feeWallet;
        _feePerMille = feePerMille;

        _state = State.Review;
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
        return _escrowList[account].exists;
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
        return _escrowList[account].deposit;
    }

    /**
     * @dev Enable the crowdsale
     */
    function enable() public onlyOperator {
        require(_state == State.Review, "FriendlyCrowdsale: not reviewing");
        _state = State.Active;

        emit Enabled();
    }

    /**
     * @dev Investors can claim refunds here if crowdsale is unsuccessful.
     * @param refundee Whose refund will be claimed.
     */
    function claimRefund(address payable refundee) public {
        require(finalized(), "FriendlyCrowdsale: not finalized");
        require(_state == State.Refunding, "FriendlyCrowdsale: not refunding");
        require(weiContribution(refundee) > 0, "FriendlyCrowdsale: no deposit");

        uint256 payment = _escrowList[refundee].deposit;

        _escrowList[refundee].deposit = 0;

        refundee.transfer(payment);

        emit Withdrawn(refundee, payment);
    }

    /**
     * @dev Set crowdsale expired and withdraw funds.
     */
    function setExpiredAndWithdraw() public onlyOperator {
        // solhint-disable-next-line not-rely-on-time
        require(block.timestamp >= closingTime() + 365 days, "FriendlyCrowdsale: not expired");
        _state = State.Expired;

        _feeWallet.transfer(address(this).balance);

        emit Expired();
    }

    /**
     * @dev Validation of an incoming purchase.
     * Adds the validation that the crowdsale must be active.
     * @param _beneficiary Address performing the token purchase
     * @param _weiAmount Value in wei involved in the purchase
     */
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal view {
        require(_state == State.Active, "FriendlyCrowdsale: not active");

        return super._preValidatePurchase(_beneficiary, _weiAmount);
    }

    /**
     * @param beneficiary Address receiving the tokens
     * @param weiAmount Value in wei involved in the purchase
     */
    function _updatePurchasingState(address beneficiary, uint256 weiAmount) internal {
        if (!investorExists(beneficiary)) {
            _investors.push(beneficiary);
            _escrowList[beneficiary].exists = true;
        }

        _escrowList[beneficiary].deposit = _escrowList[beneficiary].deposit.add(weiAmount);
    }

    /**
     * @dev Escrow finalization task, called when finalize() is called.
     */
    function _finalization() internal {
        if (goalReached()) {
            _close();
        } else {
            _enableRefunds();
        }

        _recoverRemainingTokens();
    }

    /**
     * @dev Overrides Crowdsale fund forwarding, keep funds here.
     */
    function _forwardFunds() internal {
        // solhint-disable-previous-line no-empty-blocks

        // does nothing, keep funds on this contract
    }

    /**
     * @dev Allows for the wallet to withdraw their funds.
     */
    function _close() internal {
        _state = State.Closed;

        _feeWallet.transfer(address(this).balance.mul(_feePerMille).div(1000));

        wallet().transfer(address(this).balance);

        emit RefundsClosed();
    }

    /**
     * @dev Allows for refunds to take place.
     */
    function _enableRefunds() internal {
        _state = State.Refunding;
        emit RefundsEnabled();
    }

    /**
     * @dev Recover remaining tokens to wallet.
     */
    function _recoverRemainingTokens() internal {
        if (token().balanceOf(address(this)) > 0) {
            token().transfer(wallet(), token().balanceOf(address(this)));
        }
    }
}

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.8;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../access/Roles.sol";

/**
 * @title FriendlyCrowdsale
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev FriendlyCrowdsale is a base contract for managing a token crowdsale,
 * allowing investors to purchase tokens with ether.
 */
contract FriendlyCrowdsale is Context, ReentrancyGuard, Roles {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.AddressSet;
    using Address for address;

    // The token being sold
    IERC20 private _token;

    // Address where funds are collected
    address payable private _wallet;

    // How many token units a buyer gets per wei.
    // The rate is the conversion between wei and the smallest and indivisible token unit.
    // So, if you are using a rate of 1 with a ERC20Detailed token with 3 decimals called TOK
    // 1 wei will give you 1 unit, or 0.001 TOK.
    uint256 private _rate;

    // Amount of wei raised
    uint256 private _weiRaised;

    // Max amount of wei to be contributed
    uint256 private _cap;

    // Crowdsale opening time
    uint256 private _openingTime;

    // Crowdsale closing time
    uint256 private _closingTime;

    // Minimum amount of funds to be raised in weis
    uint256 private _goal;

    // If the Crowdsale is finalized or not
    bool private _finalized;

    // Address where fee are collected
    address payable private _feeWallet;

    // Per mille rate fee
    uint256 private _feePerMille;

    // List of addresses who contributed in crowdsales
    EnumerableSet.AddressSet private _investors;

    // Map of investors deposit
    mapping(address => uint256) private _deposits;

    // Crowdsale status list
    enum State { Review, Active, Refunding, Closed, Expired, Rejected }

    // Crowdsale current state
    State private _state;

    /**
     * Event for token purchase logging
     * @param purchaser who paid for the tokens
     * @param beneficiary who got the tokens
     * @param value weis paid for purchase
     * @param amount amount of tokens purchased
     */
    event TokensPurchased(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    event CrowdsaleFinalized();

    event Enabled();
    event Rejected();
    event RefundsClosed();
    event RefundsEnabled();
    event Expired();
    event Withdrawn(address indexed refundee, uint256 weiAmount);

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
    ) public {
        require(rate > 0, "Crowdsale: rate is 0");
        require(wallet != address(0), "Crowdsale: wallet is the zero address");
        require(address(token) != address(0), "Crowdsale: token is the zero address");

        require(cap > 0, "CappedCrowdsale: cap is 0");

        // solhint-disable-next-line not-rely-on-time
        require(openingTime >= block.timestamp, "TimedCrowdsale: opening time is before current time");
        // solhint-disable-next-line max-line-length
        require(closingTime > openingTime, "TimedCrowdsale: opening time is not before closing time");

        require(goal > 0, "FriendlyCrowdsale: goal is 0");
        require(goal <= cap, "FriendlyCrowdsale: goal is not less or equal cap");
        require(feeWallet != address(0), "FriendlyCrowdsale: feeWallet is the zero address");

        _rate = rate;
        _wallet = wallet;
        _token = token;

        _cap = cap;

        _openingTime = openingTime;
        _closingTime = closingTime;

        _goal = goal;
        _finalized = false;

        _feeWallet = feeWallet;
        _feePerMille = feePerMille;

        _state = State.Review;
    }

    /**
     * @dev fallback function ***DO NOT OVERRIDE***
     * Note that other contracts will transfer funds with a base gas stipend
     * of 2300, which is not enough to call buyTokens. Consider calling
     * buyTokens directly when purchasing tokens from a contract.
     */
    receive() external payable {
        buyTokens(_msgSender());
    }

    /**
     * @return the token being sold.
     */
    function token() external view returns (IERC20) {
        return _token;
    }

    /**
     * @return the address where funds are collected.
     */
    function wallet() external view returns (address payable) {
        return _wallet;
    }

    /**
     * @return the number of token units a buyer gets per wei.
     */
    function rate() external view returns (uint256) {
        return _rate;
    }

    /**
     * @return the amount of wei raised.
     */
    function weiRaised() external view returns (uint256) {
        return _weiRaised;
    }

    /**
     * @return the cap of the crowdsale.
     */
    function cap() external view returns (uint256) {
        return _cap;
    }

    /**
     * @return the crowdsale opening time.
     */
    function openingTime() external view returns (uint256) {
        return _openingTime;
    }

    /**
     * @return the crowdsale closing time.
     */
    function closingTime() external view returns (uint256) {
        return _closingTime;
    }

    /**
     * @return true if the crowdsale is finalized, false otherwise.
     */
    function finalized() external view returns (bool) {
        return _finalized;
    }

    /**
     * @return address where fee are collected.
     */
    function feeWallet() external view returns (address payable) {
        return _feeWallet;
    }

    /**
     * @return the per mille rate fee.
     */
    function feePerMille() external view returns (uint256) {
        return _feePerMille;
    }

    /**
     * @return minimum amount of funds to be raised in wei.
     */
    function goal() external view returns (uint256) {
        return _goal;
    }

    /**
     * @return The current state of the escrow.
     */
    function state() external view returns (State) {
        return _state;
    }

    /**
     * @dev Checks whether the cap has been reached.
     * @return Whether the cap was reached
     */
    function capReached() public view returns (bool) {
        return _weiRaised >= _cap;
    }

    /**
     * @dev Checks whether the period in which the crowdsale is open has already elapsed.
     * @return Whether crowdsale period has elapsed
     */
    function hasClosed() public view returns (bool) {
        // solhint-disable-next-line not-rely-on-time
        return block.timestamp > _closingTime;
    }

    /**
     * @return false if the ico is not started, true if the ico is started and running, true if the ico is completed
     */
    function started() public view returns (bool) {
        return block.timestamp >= _openingTime; // solhint-disable-line not-rely-on-time
    }

    /**
     * @return false if the ico is not started, false if the ico is started and running, true if the ico is completed
     */
    function ended() public view returns (bool) {
        return hasClosed() || capReached();
    }

    /**
     * @return true if the crowdsale is open, false otherwise.
     */
    function isOpen() public view returns (bool) {
        return started() && !hasClosed();
    }

    /**
     * @dev Checks whether funding goal was reached.
     * @return Whether funding goal was reached
     */
    function goalReached() public view returns (bool) {
        return _weiRaised >= _goal;
    }

    /**
     * @dev Return the investors length.
     * @return uint representing investors number
     */
    function investorsNumber() public view returns (uint) {
        return _investors.length();
    }

    /**
     * @dev Check if a investor exists.
     * @param account The address to check
     * @return bool
     */
    function investorExists(address account) public view returns (bool) {
        return _investors.contains(account);
    }

    /**
     * @dev Return the investors address by index.
     * @param index A progressive index of investor addresses
     * @return address of an investor by list index
     */
    function getInvestorAddress(uint index) public view returns (address) {
        return _investors.at(index);
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
     * @dev low level token purchase ***DO NOT OVERRIDE***
     * This function has a non-reentrancy guard, so it shouldn't be called by
     * another `nonReentrant` function.
     * @param beneficiary Recipient of the token purchase
     */
    function buyTokens(address beneficiary) public nonReentrant payable {
        uint256 weiAmount = msg.value;
        _preValidatePurchase(beneficiary, weiAmount);

        // calculate token amount to be created
        uint256 tokens = _getTokenAmount(weiAmount);

        // update state
        _weiRaised = _weiRaised.add(weiAmount);

        _processPurchase(beneficiary, tokens);
        emit TokensPurchased(_msgSender(), beneficiary, weiAmount, tokens);

        _updatePurchasingState(beneficiary, weiAmount);

        _forwardFunds();
        _postValidatePurchase(beneficiary, weiAmount);
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
     * @dev Reject the crowdsale
     */
    function reject() public onlyOperator {
        require(_state == State.Review, "FriendlyCrowdsale: not reviewing");
        _state = State.Rejected;

        _recoverRemainingTokens();

        emit Rejected();
    }

    /**
     * @dev Must be called after crowdsale ends, to do some extra finalization
     * work. Calls the contract's finalization function.
     */
    function finalize() public {
        require(!_finalized, "FinalizableCrowdsale: already finalized");
        require(hasClosed(), "FinalizableCrowdsale: not closed");

        _finalized = true;

        _finalization();
        emit CrowdsaleFinalized();
    }

    /**
     * @dev Investors can claim refunds here if crowdsale is unsuccessful.
     * @param refundee Whose refund will be claimed.
     */
    function claimRefund(address payable refundee) public {
        require(_finalized, "FriendlyCrowdsale: not finalized");
        require(_state == State.Refunding, "FriendlyCrowdsale: not refunding");
        require(weiContribution(refundee) > 0, "FriendlyCrowdsale: no deposit");

        uint256 payment = _deposits[refundee];

        _deposits[refundee] = 0;

        refundee.transfer(payment);

        emit Withdrawn(refundee, payment);
    }

    /**
     * @dev Set crowdsale expired and withdraw funds.
     */
    function setExpiredAndWithdraw() public onlyOperator {
        // solhint-disable-next-line not-rely-on-time
        require(block.timestamp >= _closingTime + 365 days, "FriendlyCrowdsale: not expired");
        _state = State.Expired;

        _feeWallet.transfer(address(this).balance);

        emit Expired();
    }

    /**
     * @dev Validation of an incoming purchase.
     * Adds the validation that the crowdsale must be active.
     * @param beneficiary Address performing the token purchase
     * @param weiAmount Value in wei involved in the purchase
     */
    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view {
        require(beneficiary != address(0), "Crowdsale: beneficiary is the zero address");
        require(weiAmount != 0, "Crowdsale: weiAmount is 0");
        require(_weiRaised.add(weiAmount) <= _cap, "CappedCrowdsale: cap exceeded");
        require(isOpen(), "TimedCrowdsale: not open");

        require(_state == State.Active, "FriendlyCrowdsale: not active");
    }

    /**
     * @dev Validation of an executed purchase. Observe state and use revert statements to undo rollback when valid
     * conditions are not met.
     * @param beneficiary Address performing the token purchase
     * @param weiAmount Value in wei involved in the purchase
     */
    function _postValidatePurchase(address beneficiary, uint256 weiAmount) internal view {
        // solhint-disable-previous-line no-empty-blocks
    }

    /**
     * @dev Source of tokens. Override this method to modify the way in which the crowdsale ultimately gets and sends
     * its tokens.
     * @param beneficiary Address performing the token purchase
     * @param tokenAmount Number of tokens to be emitted
     */
    function _deliverTokens(address beneficiary, uint256 tokenAmount) internal {
        _token.safeTransfer(beneficiary, tokenAmount);
    }

    /**
     * @dev Executed when a purchase has been validated and is ready to be executed. Doesn't necessarily emit/send
     * tokens.
     * @param beneficiary Address receiving the tokens
     * @param tokenAmount Number of tokens to be purchased
     */
    function _processPurchase(address beneficiary, uint256 tokenAmount) internal {
        _deliverTokens(beneficiary, tokenAmount);
    }

    /**
     * @param beneficiary Address receiving the tokens
     * @param weiAmount Value in wei involved in the purchase
     */
    function _updatePurchasingState(address beneficiary, uint256 weiAmount) internal {
        if (!investorExists(beneficiary)) {
            _investors.add(beneficiary);
        }

        _deposits[beneficiary] = _deposits[beneficiary].add(weiAmount);
    }

    /**
     * @dev Override to extend the way in which ether is converted to tokens.
     * @param weiAmount Value in wei to be converted into tokens
     * @return Number of tokens that can be purchased with the specified _weiAmount
     */
    function _getTokenAmount(uint256 weiAmount) internal view returns (uint256) {
        return weiAmount.mul(_rate);
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

        _wallet.transfer(address(this).balance);

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
        if (_token.balanceOf(address(this)) > 0) {
            _token.safeTransfer(_wallet, _token.balanceOf(address(this)));
        }
    }
}

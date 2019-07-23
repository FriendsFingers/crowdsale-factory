pragma solidity ^0.5.10;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
import "dao-smartcontracts/contracts/dao/DAO.sol";
import "../utils/Contributions.sol";

/**
 * @title FriendlyCrowdsale
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev FriendlyCrowdsale is a base contract for managing a token crowdsale,
 * allowing investors to purchase tokens with ether.
 */
contract FriendlyCrowdsale is ReentrancyGuard, TokenRecover {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // How many token units a buyer gets per wei.
    // The rate is the conversion between wei and the smallest and indivisible token unit.
    uint256 private _rate;

    // Address where funds are collected
    address payable private _wallet;

    // The token being sold
    IERC20 private _token;

    // the DAO smart contract
    DAO private _dao;

    // reference to Contributions contract
    Contributions private _contributions;

    /**
     * Event for token purchase logging
     * @param beneficiary who got the tokens
     * @param value weis paid for purchase
     * @param amount amount of tokens purchased
     */
    event TokensPurchased(address indexed beneficiary, uint256 value, uint256 amount);

    /**
     * @param rate Number of token units a buyer gets per wei
     * @param wallet Address where collected funds will be forwarded to
     * @param token Address of the token being sold
     * @param contributions Address of the contributions contract
     * @param dao DAO the decentralized organization address
     */
    constructor(
        uint256 rate,
        address payable wallet,
        address token,
        address contributions,
        address payable dao
    )
        public
    {
        require(rate > 0, "FriendlyCrowdsale: rate is 0");
        require(wallet != address(0), "FriendlyCrowdsale: wallet is the zero address");
        require(token != address(0), "FriendlyCrowdsale: token is the zero address");
        require(contributions != address(0), "FriendlyCrowdsale: contributions is the zero address");
        require(dao != address(0), "FriendlyCrowdsale: dao is the zero address");

        _rate = rate;
        _wallet = wallet;
        _token = IERC20(token);
        _contributions = Contributions(contributions);
        _dao = DAO(dao);
    }

    /**
     * @dev fallback function
     * Note that other contracts will transfer funds with a base gas stipend
     * of 2300, which is not enough to call buyTokens. Consider calling
     * buyTokens directly when purchasing tokens from a contract.
     */
    function () external payable {
        buyTokens();
    }

    /**
     * @dev low level token purchase
     * This function has a non-reentrancy guard, so it shouldn't be called by
     * another `nonReentrant` function.
     */
    function buyTokens() public nonReentrant payable {
        address beneficiary = msg.sender;
        uint256 weiAmount = msg.value;

        require(weiAmount != 0, "FriendlyCrowdsale: weiAmount is 0");

        // calculate token amount to be sent
        uint256 tokenAmount = _getTokenAmount(beneficiary, weiAmount);

        _token.safeTransfer(beneficiary, tokenAmount);

        emit TokensPurchased(beneficiary, weiAmount, tokenAmount);

        _contributions.addBalance(beneficiary, weiAmount, tokenAmount);

        _wallet.transfer(weiAmount);
    }

    /**
     * @dev Function to update rate
     * @param newRate The rate is the conversion between wei and the smallest and indivisible token unit
     */
    function setRate(uint256 newRate) public onlyOwner {
        require(newRate > 0, "FriendlyCrowdsale: rate is 0");
        _rate = newRate;
    }

    /**
     * @return the number of token units a buyer gets per wei.
     */
    function rate() public view returns (uint256) {
        return _rate;
    }

    /**
     * @return the address where funds are collected.
     */
    function wallet() public view returns (address payable) {
        return _wallet;
    }

    /**
     * @return the token being sold.
     */
    function token() public view returns (IERC20) {
        return _token;
    }

    /**
     * @return the crowdsale contributions contract address
     */
    function contributions() public view returns (Contributions) {
        return _contributions;
    }

    /**
     * @return the crowdsale dao contract address
     */
    function dao() public view returns (DAO) {
        return _dao;
    }

    /**
     * @dev Get expected token number for beneficiary.
     * @param beneficiary Address receiving the tokens
     * @param weiAmount Value in wei to be converted into tokens
     * @return Number of tokens that can be purchased with the specified _weiAmount
     */
    function expectedTokenAmount(address beneficiary, uint256 weiAmount) public view returns (uint256) {
        return _getTokenAmount(beneficiary, weiAmount);
    }

    /**
     * @dev The way in which ether is converted to tokens.
     * @param beneficiary Address receiving the tokens
     * @param weiAmount Value in wei to be converted into tokens
     * @return Number of tokens that can be purchased with the specified _weiAmount
     */
    function _getTokenAmount(address beneficiary, uint256 weiAmount) internal view returns (uint256) {
        uint256 tokenAmount = weiAmount.mul(_rate);

        if (_dao.isMember(beneficiary)) {
            tokenAmount = tokenAmount.mul(2);

            if (_dao.stakedTokensOf(beneficiary) > 0) {
                tokenAmount = tokenAmount.mul(2);
            }

            if (_dao.usedTokensOf(beneficiary) > 0) {
                tokenAmount = tokenAmount.mul(2);
            }
        }

        return tokenAmount;
    }
}

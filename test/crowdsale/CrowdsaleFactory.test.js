const { BN, constants, ether, expectRevert, time } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { shouldBehaveLikeCrowdsaleFactory } = require('./behaviours/CrowdsaleFactory.behaviour');

const CrowdsaleFactory = artifacts.require('CrowdsaleFactory');
const ERC20Mock = artifacts.require('ERC20Mock');

contract('CrowdsaleFactory', function ([owner, wallet, investor, purchaser, feeWallet, other]) {
  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await time.advanceBlock();
  });

  beforeEach(async function () {
    this.feePerMille = new BN(50); // 50 per mille, 5%

    this.openingTime = (await time.latest()).add(time.duration.weeks(1));
    this.closingTime = this.openingTime.add(time.duration.weeks(1));
    this.afterClosingTime = this.closingTime.add(time.duration.seconds(1));

    this.cap = ether('3');

    this.goal = ether('2');

    this.rate = new BN(1000);

    this.feePerMille = new BN(50); // 50 per mille, 5%

    this.maxTokenSupply = this.cap.mul(this.rate);

    this.token = await ERC20Mock.new(owner, this.maxTokenSupply, { from: owner });
  });

  context('like a CrowdsaleFactory', function () {
    it('requires a non-null feeWallet', async function () {
      await expectRevert(
        CrowdsaleFactory.new(
          ZERO_ADDRESS,
          this.feePerMille,
        ),
        'CrowdsaleFactory: feeWallet is the zero address',
      );
    });

    context('once deployed', function () {
      beforeEach(async function () {
        this.factory = await CrowdsaleFactory.new(
          feeWallet,
          this.feePerMille,
          { from: owner },
        );
      });

      it('feeWallet should be right set', async function () {
        (await this.factory.feeWallet()).should.be.equal(feeWallet);
      });

      it('feePerMille should be right set', async function () {
        (await this.factory.feePerMille()).should.be.bignumber.equal(this.feePerMille);
      });

      context('test CrowdsaleFactory behavior', function () {
        shouldBehaveLikeCrowdsaleFactory([owner, wallet, investor, purchaser, feeWallet, other]);
      });
    });
  });
});

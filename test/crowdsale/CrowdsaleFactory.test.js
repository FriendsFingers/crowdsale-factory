const { BN, constants, expectRevert, time } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { shouldBehaveLikeCrowdsaleFactory } = require('./behaviours/CrowdsaleFactory.behaviour');

const CrowdsaleFactory = artifacts.require('CrowdsaleFactory');

contract('CrowdsaleFactory', function ([owner, wallet, investor, purchaser, feeWallet, other]) {
  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await time.advanceBlock();
  });

  beforeEach(async function () {
    this.feePerMille = new BN(50); // 50 per mille, 5%
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

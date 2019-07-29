const { balance, BN, time } = require('openzeppelin-test-helpers');

const { expect } = require('chai');

const { shouldBehaveLikePausableCrowdsale } = require('./PausableCrowdsale.behavior');
const { shouldBehaveLikeCappedCrowdsale } = require('./CappedCrowdsale.behavior');
const { shouldBehaveLikeTimedCrowdsale } = require('./TimedCrowdsale.behavior');
const { shouldBehaveLikeFinalizableCrowdsale } = require('./FinalizableCrowdsale.behavior');
const { shouldBehaveLikeCrowdsale } = require('./Crowdsale.behavior');

function shouldBehaveLikeFriendlyCrowdsale ([owner, wallet, investor, purchaser, other]) {
  context('should behave like PausableCrowdsale', function () {
    beforeEach(async function () {
      await time.increaseTo(this.openingTime);
    });

    shouldBehaveLikePausableCrowdsale([owner, other]);
  });

  context('should behave like CappedCrowdsale', function () {
    beforeEach(async function () {
      await time.increaseTo(this.openingTime);
    });

    shouldBehaveLikeCappedCrowdsale();
  });

  context('should behave like TimedCrowdsale', function () {
    shouldBehaveLikeTimedCrowdsale([investor, purchaser]);
  });

  context('should behave like FinalizableCrowdsale', function () {
    shouldBehaveLikeFinalizableCrowdsale([other]);
  });

  context('should behave like Crowdsale', function () {
    beforeEach(async function () {
      await time.increaseTo(this.openingTime);
    });

    shouldBehaveLikeCrowdsale([investor, wallet, purchaser]);
  });

  context('should behave like FriendlyCrowdsale', function () {
    const value = new BN(1);

    context('once started', function () {
      beforeEach(async function () {
        await time.increaseTo(this.openingTime);
      });

      describe('high-level purchase', function () {
        it('should keep funds in crowdsale', async function () {
          const balanceTracker = await balance.tracker(this.crowdsale.address);
          await this.crowdsale.sendTransaction({ value, from: investor });
          expect(await balanceTracker.delta()).to.be.bignumber.equal(value);
        });
      });

      describe('low-level purchase', function () {
        it('should keep funds in crowdsale', async function () {
          const balanceTracker = await balance.tracker(this.crowdsale.address);
          await this.crowdsale.buyTokens(investor, { value, from: purchaser });
          expect(await balanceTracker.delta()).to.be.bignumber.equal(value);
        });
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeFriendlyCrowdsale,
};

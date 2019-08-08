const { balance, BN, expectEvent, expectRevert, time } = require('openzeppelin-test-helpers');

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

    beforeEach(async function () {
      this.preWalletBalance = await balance.current(wallet);
    });

    it('investor does not exist', async function () {
      expect(await this.crowdsale.investorExists(investor)).to.be.equal(false);
    });

    context('before opening time', function () {
      it('state should be active', async function () {
        expect(await this.crowdsale.state()).to.be.bignumber.equal(this.escrowState.active);
      });

      it('started should be false', async function () {
        expect(await this.crowdsale.started()).to.be.equal(false);
      });

      it('ended should be false', async function () {
        expect(await this.crowdsale.ended()).to.be.equal(false);
      });

      it('goalReached should be false', async function () {
        expect(await this.crowdsale.goalReached()).to.be.equal(false);
      });

      it('denies refunds', async function () {
        await expectRevert(this.crowdsale.claimRefund(investor),
          'FriendlyCrowdsale: not finalized'
        );
      });
    });

    context('after opening time', function () {
      beforeEach(async function () {
        await time.increaseTo(this.openingTime);
      });

      it('started should be true', async function () {
        expect(await this.crowdsale.started()).to.be.equal(true);
      });

      it('ended should be false', async function () {
        expect(await this.crowdsale.ended()).to.be.equal(false);
      });

      describe('high-level purchase', function () {
        it('should keep funds in crowdsale', async function () {
          const balanceTracker = await balance.tracker(this.crowdsale.address);
          await this.crowdsale.sendTransaction({ value, from: investor });
          expect(await balanceTracker.delta()).to.be.bignumber.equal(value);
        });

        it('should increase investors number', async function () {
          const investorsNumber = await this.crowdsale.investorsNumber();

          await this.crowdsale.sendTransaction({ value, from: purchaser });
          await this.crowdsale.sendTransaction({ value, from: investor });

          expect(await this.crowdsale.investorsNumber()).to.be.bignumber.equal(investorsNumber.addn(2));
        });

        it('should get investors address by index', async function () {
          await this.crowdsale.sendTransaction({ value, from: purchaser });
          await this.crowdsale.sendTransaction({ value, from: investor });

          expect(await this.crowdsale.getInvestorAddress(0)).to.be.equal(purchaser);
          expect(await this.crowdsale.getInvestorAddress(1)).to.be.equal(investor);
        });

        it('should increase wei contributions', async function () {
          await this.crowdsale.sendTransaction({ value, from: purchaser });
          await this.crowdsale.sendTransaction({ value, from: investor });

          expect(await this.crowdsale.weiContribution(purchaser)).to.be.bignumber.equal(value);
          expect(await this.crowdsale.weiContribution(investor)).to.be.bignumber.equal(value);
        });

        it('should increase escrow deposit', async function () {
          const balanceTracker = await balance.tracker(this.crowdsale.address);
          await this.crowdsale.sendTransaction({ value, from: investor });
          expect(await balanceTracker.delta()).to.be.bignumber.equal(await this.crowdsale.weiContribution(investor));
        });

        it('investor exists', async function () {
          await this.crowdsale.sendTransaction({ value, from: investor });
          expect(await this.crowdsale.investorExists(investor)).to.be.equal(true);
        });
      });

      describe('low-level purchase', function () {
        it('should keep funds in crowdsale', async function () {
          const balanceTracker = await balance.tracker(this.crowdsale.address);
          await this.crowdsale.buyTokens(investor, { value, from: purchaser });
          expect(await balanceTracker.delta()).to.be.bignumber.equal(value);
        });

        it('should increase investors number', async function () {
          const investorsNumber = await this.crowdsale.investorsNumber();

          await this.crowdsale.buyTokens(purchaser, { value, from: purchaser });
          await this.crowdsale.buyTokens(investor, { value, from: purchaser });

          expect(await this.crowdsale.investorsNumber()).to.be.bignumber.equal(investorsNumber.addn(2));
        });

        it('should get investors address by index', async function () {
          await this.crowdsale.buyTokens(purchaser, { value, from: purchaser });
          await this.crowdsale.buyTokens(investor, { value, from: purchaser });

          expect(await this.crowdsale.getInvestorAddress(0)).to.be.equal(purchaser);
          expect(await this.crowdsale.getInvestorAddress(1)).to.be.equal(investor);
        });

        it('should increase wei contributions', async function () {
          await this.crowdsale.buyTokens(purchaser, { value, from: purchaser });
          await this.crowdsale.buyTokens(investor, { value, from: purchaser });

          expect(await this.crowdsale.weiContribution(purchaser)).to.be.bignumber.equal(value);
          expect(await this.crowdsale.weiContribution(investor)).to.be.bignumber.equal(value);
        });

        it('should increase escrow deposit', async function () {
          const balanceTracker = await balance.tracker(this.crowdsale.address);
          await this.crowdsale.buyTokens(investor, { value, from: purchaser });
          expect(await balanceTracker.delta()).to.be.bignumber.equal(await this.crowdsale.weiContribution(investor));
        });

        it('investor exists', async function () {
          await this.crowdsale.buyTokens(investor, { value, from: purchaser });
          expect(await this.crowdsale.investorExists(investor)).to.be.equal(true);
        });
      });

      it('denies refunds', async function () {
        await expectRevert(this.crowdsale.claimRefund(investor),
          'FriendlyCrowdsale: not finalized'
        );
      });

      context('with unreached goal', function () {
        beforeEach(async function () {
          await this.crowdsale.sendTransaction({ value: this.lessThanGoal, from: investor });
        });

        it('ended should be false', async function () {
          expect(await this.crowdsale.ended()).to.be.equal(false);
        });

        it('goalReached should be false', async function () {
          expect(await this.crowdsale.goalReached()).to.be.equal(false);
        });

        context('finalizing', function () {
          it('emits a RefundsEnabled event', async function () {
            await time.increaseTo(this.afterClosingTime);
            const { logs } = await this.crowdsale.finalize({ from: other });
            expectEvent.inLogs(logs, 'RefundsEnabled');
          });
        });

        context('after closing time and finalization', function () {
          beforeEach(async function () {
            await time.increaseTo(this.afterClosingTime);
            await this.crowdsale.finalize({ from: other });
          });

          it('state should be refunding', async function () {
            expect(await this.crowdsale.state()).to.be.bignumber.equal(this.escrowState.refunding);
          });

          it('goalReached should be false', async function () {
            expect(await this.crowdsale.goalReached()).to.be.equal(false);
          });

          it('refunds', async function () {
            const balanceTracker = await balance.tracker(investor);
            await this.crowdsale.claimRefund(investor, { gasPrice: 0 });
            expect(await balanceTracker.delta()).to.be.bignumber.equal(this.lessThanGoal);
          });

          it('denies refunds twice', async function () {
            await this.crowdsale.claimRefund(investor, { gasPrice: 0 });
            await expectRevert(this.crowdsale.claimRefund(investor),
              'FriendlyCrowdsale: no deposit'
            );
          });

          it('denies refunds if not investor', async function () {
            await expectRevert(this.crowdsale.claimRefund(purchaser),
              'FriendlyCrowdsale: no deposit'
            );
          });
        });
      });

      context('with reached goal', function () {
        beforeEach(async function () {
          await this.crowdsale.sendTransaction({ value: this.goal, from: investor });
        });

        it('ended should be false', async function () {
          expect(await this.crowdsale.ended()).to.be.equal(false);
        });

        it('goalReached should be true', async function () {
          expect(await this.crowdsale.goalReached()).to.be.equal(true);
        });

        context('finalizing', function () {
          it('emits a RefundsClosed event', async function () {
            await time.increaseTo(this.afterClosingTime);
            const { logs } = await this.crowdsale.finalize({ from: other });
            expectEvent.inLogs(logs, 'RefundsClosed');
          });
        });

        context('after closing time and finalization', function () {
          beforeEach(async function () {
            await time.increaseTo(this.afterClosingTime);
            await this.crowdsale.finalize({ from: other });
          });

          it('state should be closed', async function () {
            expect(await this.crowdsale.state()).to.be.bignumber.equal(this.escrowState.closed);
          });

          it('ended should be true', async function () {
            expect(await this.crowdsale.ended()).to.be.equal(true);
          });

          it('goalReached should be true', async function () {
            expect(await this.crowdsale.goalReached()).to.be.equal(true);
          });

          it('denies refunds', async function () {
            await expectRevert(this.crowdsale.claimRefund(investor),
              'FriendlyCrowdsale: not refunding'
            );
          });

          it('forwards funds to wallet', async function () {
            const postWalletBalance = await balance.current(wallet);
            expect(postWalletBalance.sub(this.preWalletBalance)).to.be.bignumber.equal(this.goal);
          });
        });
      });
    });

    context('after closing time', function () {
      beforeEach(async function () {
        await time.increaseTo(this.afterClosingTime);
      });

      it('ended should be true', async function () {
        expect(await this.crowdsale.ended()).to.be.equal(true);
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeFriendlyCrowdsale,
};

const { BN, balance, expectEvent, expectRevert } = require('openzeppelin-test-helpers');

function shouldBehaveLikeFriendlyCrowdsale (investor, wallet, rate, bonus) {
  context(`rate has a bonus of ${bonus}x`, function () {
    const value = new BN(100);
    const expectedTokenAmount = rate.mul(value).mul(bonus);

    it('expected amount should return the right value', async function () {
      (await this.crowdsale.expectedTokenAmount(investor, value)).should.be.bignumber.equal(expectedTokenAmount);
    });

    describe('accepting payments', function () {
      describe('bare payments', function () {
        it('should accept payments', async function () {
          await this.crowdsale.send(value, { from: investor });
        });

        it('reverts on zero-valued payments', async function () {
          await expectRevert(
            this.crowdsale.send(0, { from: investor }), 'FriendlyCrowdsale: weiAmount is 0'
          );
        });
      });

      describe('buyTokens', function () {
        it('should accept payments', async function () {
          await this.crowdsale.buyTokens({ value: value, from: investor });
        });

        it('reverts on zero-valued payments', async function () {
          await expectRevert(
            this.crowdsale.buyTokens({ value: 0, from: investor }), 'FriendlyCrowdsale: weiAmount is 0'
          );
        });
      });
    });

    describe('high-level purchase', function () {
      it('should log purchase', async function () {
        const { logs } = await this.crowdsale.sendTransaction({ value: value, from: investor });
        expectEvent.inLogs(logs, 'TokensPurchased', {
          beneficiary: investor,
          value: value,
          amount: expectedTokenAmount,
        });
      });

      it('should assign tokens to sender', async function () {
        await this.crowdsale.sendTransaction({ value: value, from: investor });
        (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);
      });

      it('should forward funds to wallet', async function () {
        const balanceTracker = await balance.tracker(wallet);
        await this.crowdsale.sendTransaction({ value, from: investor });
        (await balanceTracker.delta()).should.be.bignumber.equal(value);
      });
    });

    describe('low-level purchase', function () {
      it('should log purchase', async function () {
        const { logs } = await this.crowdsale.buyTokens({ value: value, from: investor });
        expectEvent.inLogs(logs, 'TokensPurchased', {
          beneficiary: investor,
          value: value,
          amount: expectedTokenAmount,
        });
      });

      it('should assign tokens to beneficiary', async function () {
        await this.crowdsale.buyTokens({ value, from: investor });
        (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);
      });

      it('should forward funds to wallet', async function () {
        const balanceTracker = await balance.tracker(wallet);
        await this.crowdsale.buyTokens({ value, from: investor });
        (await balanceTracker.delta()).should.be.bignumber.equal(value);
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeFriendlyCrowdsale,
};

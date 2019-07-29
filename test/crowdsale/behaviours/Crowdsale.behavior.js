const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers');
const { ZERO_ADDRESS } = constants;

const { expect } = require('chai');

function shouldBehaveLikeCrowdsale ([investor, wallet, purchaser]) {
  const value = new BN(1);

  beforeEach(async function () {
    this.expectedTokenAmount = value.mul(await this.crowdsale.rate());
  });

  describe('accepting payments', function () {
    describe('bare payments', function () {
      it('should accept payments', async function () {
        await this.crowdsale.send(value, { from: purchaser });
      });

      it('reverts on zero-valued payments', async function () {
        await expectRevert(
          this.crowdsale.send(0, { from: purchaser }), 'Crowdsale: weiAmount is 0'
        );
      });
    });

    describe('buyTokens', function () {
      it('should accept payments', async function () {
        await this.crowdsale.buyTokens(investor, { value: value, from: purchaser });
      });

      it('reverts on zero-valued payments', async function () {
        await expectRevert(
          this.crowdsale.buyTokens(investor, { value: 0, from: purchaser }), 'Crowdsale: weiAmount is 0'
        );
      });

      it('requires a non-null beneficiary', async function () {
        await expectRevert(
          this.crowdsale.buyTokens(ZERO_ADDRESS, { value: value, from: purchaser }),
          'Crowdsale: beneficiary is the zero address'
        );
      });
    });
  });

  describe('high-level purchase', function () {
    it('should log purchase', async function () {
      const { logs } = await this.crowdsale.sendTransaction({ value: value, from: investor });
      expectEvent.inLogs(logs, 'TokensPurchased', {
        purchaser: investor,
        beneficiary: investor,
        value: value,
        amount: this.expectedTokenAmount,
      });
    });

    it('should assign tokens to sender', async function () {
      await this.crowdsale.sendTransaction({ value: value, from: investor });
      expect(await this.token.balanceOf(investor)).to.be.bignumber.equal(this.expectedTokenAmount);
    });
  });

  describe('low-level purchase', function () {
    it('should log purchase', async function () {
      const { logs } = await this.crowdsale.buyTokens(investor, { value: value, from: purchaser });
      expectEvent.inLogs(logs, 'TokensPurchased', {
        purchaser: purchaser,
        beneficiary: investor,
        value: value,
        amount: this.expectedTokenAmount,
      });
    });

    it('should assign tokens to beneficiary', async function () {
      await this.crowdsale.buyTokens(investor, { value, from: purchaser });
      expect(await this.token.balanceOf(investor)).to.be.bignumber.equal(this.expectedTokenAmount);
    });
  });
}

module.exports = {
  shouldBehaveLikeCrowdsale,
};

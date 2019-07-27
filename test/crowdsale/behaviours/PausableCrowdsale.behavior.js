const { BN, expectRevert } = require('openzeppelin-test-helpers');

function shouldBehaveLikePausableCrowdsale ([pauser, other]) {
  const value = new BN(1);

  it('purchases work', async function () {
    await this.crowdsale.sendTransaction({ from: other, value });
    await this.crowdsale.buyTokens(other, { from: other, value });
  });

  context('after pause', function () {
    beforeEach(async function () {
      await this.crowdsale.pause({ from: pauser });
    });

    it('purchases do not work', async function () {
      await expectRevert(this.crowdsale.sendTransaction({ from: other, value }), 'Pausable: paused');
      await expectRevert(this.crowdsale.buyTokens(other, { from: other, value }), 'Pausable: paused');
    });

    context('after unpause', function () {
      beforeEach(async function () {
        await this.crowdsale.unpause({ from: pauser });
      });

      it('purchases work', async function () {
        await this.crowdsale.sendTransaction({ from: other, value });
        await this.crowdsale.buyTokens(other, { from: other, value });
      });
    });
  });
}

module.exports = {
  shouldBehaveLikePausableCrowdsale,
};

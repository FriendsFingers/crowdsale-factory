const { BN, expectRevert, time } = require('openzeppelin-test-helpers');

function shouldBehaveLikeTimedCrowdsale ([investor, purchaser]) {
  const value = new BN(1);

  it('should be ended only after end', async function () {
    expect(await this.crowdsale.hasClosed()).to.equal(false);
    await time.increaseTo(this.afterClosingTime);
    expect(await this.crowdsale.isOpen()).to.equal(false);
    expect(await this.crowdsale.hasClosed()).to.equal(true);
  });

  describe('accepting payments', function () {
    it('should reject payments before start', async function () {
      expect(await this.crowdsale.isOpen()).to.equal(false);
      await expectRevert(this.crowdsale.send(value), 'TimedCrowdsale: not open');
      await expectRevert(this.crowdsale.buyTokens(investor, { from: purchaser, value: value }),
        'TimedCrowdsale: not open'
      );
    });

    it('should accept payments after start', async function () {
      await time.increaseTo(this.openingTime);
      expect(await this.crowdsale.isOpen()).to.equal(true);
      await this.crowdsale.send(value);
      await this.crowdsale.buyTokens(investor, { value: value, from: purchaser });
    });

    it('should reject payments after end', async function () {
      await time.increaseTo(this.afterClosingTime);
      await expectRevert(this.crowdsale.send(value), 'TimedCrowdsale: not open');
      await expectRevert(this.crowdsale.buyTokens(investor, { value: value, from: purchaser }),
        'TimedCrowdsale: not open'
      );
    });
  });
}

module.exports = {
  shouldBehaveLikeTimedCrowdsale,
};

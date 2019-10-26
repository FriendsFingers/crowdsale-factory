const { expectRevert } = require('@openzeppelin/test-helpers');

function shouldBehaveLikeCappedCrowdsale () {
  describe('accepting payments', function () {
    it('should accept payments within cap', async function () {
      await this.crowdsale.send(this.cap.sub(this.lessThanCap));
      await this.crowdsale.send(this.lessThanCap);
    });

    it('should reject payments outside cap', async function () {
      await this.crowdsale.send(this.cap);
      await expectRevert(this.crowdsale.send(1), 'CappedCrowdsale: cap exceeded');
    });

    it('should reject payments that exceed cap', async function () {
      await expectRevert(this.crowdsale.send(this.cap.addn(1)), 'CappedCrowdsale: cap exceeded');
    });
  });

  describe('ending', function () {
    it('should not reach cap if sent under cap', async function () {
      await this.crowdsale.send(this.lessThanCap);
      expect(await this.crowdsale.capReached()).to.equal(false);
    });

    it('should not reach cap if sent just under cap', async function () {
      await this.crowdsale.send(this.cap.subn(1));
      expect(await this.crowdsale.capReached()).to.equal(false);
    });

    it('should reach cap if cap sent', async function () {
      await this.crowdsale.send(this.cap);
      expect(await this.crowdsale.capReached()).to.equal(true);
    });
  });
}

module.exports = {
  shouldBehaveLikeCappedCrowdsale,
};

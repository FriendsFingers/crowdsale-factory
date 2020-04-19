const { expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');

function shouldBehaveLikeFinalizableCrowdsale ([other]) {
  it('cannot be finalized before ending', async function () {
    await expectRevert(this.crowdsale.finalize({ from: other }),
      'FinalizableCrowdsale: not closed',
    );
  });

  it('can be finalized by anyone after ending', async function () {
    await time.increaseTo(this.afterClosingTime);
    await this.crowdsale.finalize({ from: other });
  });

  it('cannot be finalized twice', async function () {
    await time.increaseTo(this.afterClosingTime);
    await this.crowdsale.finalize({ from: other });
    await expectRevert(this.crowdsale.finalize({ from: other }),
      'FinalizableCrowdsale: already finalized',
    );
  });

  it('logs finalized', async function () {
    await time.increaseTo(this.afterClosingTime);
    const { logs } = await this.crowdsale.finalize({ from: other });
    expectEvent.inLogs(logs, 'CrowdsaleFinalized');
  });

  describe('once finalized', function () {
    it('finalized should be true', async function () {
      await time.increaseTo(this.afterClosingTime);
      await this.crowdsale.finalize({ from: other });
      (await this.crowdsale.finalized()).should.be.equal(true);
    });
  });
}

module.exports = {
  shouldBehaveLikeFinalizableCrowdsale,
};

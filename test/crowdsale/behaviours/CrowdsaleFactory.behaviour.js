const { expectEvent } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeTokenRecover } = require('eth-token-recover/test/TokenRecover.behaviour');

const FriendlyCrowdsale = artifacts.require('FriendlyCrowdsale');

function shouldBehaveLikeCrowdsaleFactory ([owner, wallet, investor, purchaser, feeWallet, other]) {
  context('creating a crowdsale', function () {
    beforeEach(async function () {
      this.trx = await this.factory.createCrowdsale(
        this.openingTime,
        this.closingTime,
        this.cap,
        this.goal,
        this.rate,
        wallet,
        this.token.address,
        { from: owner },
      );

      const event = this.trx.logs.find(e => e.event === 'CrowdsaleCreated');

      this.crowdsale = await FriendlyCrowdsale.at(event.args.crowdsale);
    });

    it('emits a CrowdsaleCreated event', async function () {
      expectEvent.inLogs(this.trx.logs, 'CrowdsaleCreated');
    });

    describe('once deployed', function () {
      it('openingTime should be right set', async function () {
        (await this.crowdsale.openingTime()).should.be.bignumber.equal(this.openingTime);
      });

      it('closingTime should be right set', async function () {
        (await this.crowdsale.closingTime()).should.be.bignumber.equal(this.closingTime);
      });

      it('cap should be right set', async function () {
        (await this.crowdsale.cap()).should.be.bignumber.equal(this.cap);
      });

      it('goal should be right set', async function () {
        (await this.crowdsale.goal()).should.be.bignumber.equal(this.goal);
      });

      it('rate should be right set', async function () {
        (await this.crowdsale.rate()).should.be.bignumber.equal(this.rate);
      });

      it('wallet should be right set', async function () {
        (await this.crowdsale.wallet()).should.be.equal(wallet);
      });

      it('token should be right set', async function () {
        (await this.crowdsale.token()).should.be.equal(this.token.address);
      });

      it('feeWallet should be right set', async function () {
        (await this.crowdsale.feeWallet()).should.be.equal(feeWallet);
      });

      it('feePerMille should be right set', async function () {
        (await this.crowdsale.feePerMille()).should.be.bignumber.equal(this.feePerMille);
      });
    });
  });

  context('like a TokenRecover', function () {
    beforeEach(async function () {
      this.instance = this.factory;
    });

    shouldBehaveLikeTokenRecover([owner, other]);
  });
}

module.exports = {
  shouldBehaveLikeCrowdsaleFactory,
};

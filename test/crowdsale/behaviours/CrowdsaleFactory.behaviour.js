const { shouldBehaveLikeTokenRecover } = require('eth-token-recover/test/TokenRecover.behaviour');

function shouldBehaveLikeCrowdsaleFactory ([owner, wallet, investor, purchaser, feeWallet, other]) {
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

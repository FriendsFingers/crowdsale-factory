const { time } = require('openzeppelin-test-helpers');

const { shouldBehaveLikePausableCrowdsale } = require('./PausableCrowdsale.behavior');
const { shouldBehaveLikeCappedCrowdsale } = require('./CappedCrowdsale.behavior');
const { shouldBehaveLikeTimedCrowdsale } = require('./TimedCrowdsale.behavior');

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
}

module.exports = {
  shouldBehaveLikeFriendlyCrowdsale,
};

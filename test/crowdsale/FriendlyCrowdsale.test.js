const { BN, constants, ether, expectRevert, time } = require('openzeppelin-test-helpers');
const { ZERO_ADDRESS } = constants;

const { shouldBehaveLikeFriendlyCrowdsale } = require('./behaviours/FriendlyCrowdsale.behaviour');

const FriendlyCrowdsale = artifacts.require('FriendlyCrowdsale');
const ERC20Mock = artifacts.require('ERC20Mock');

contract('FriendlyCrowdsale', function ([owner, wallet, investor, purchaser, other]) {
  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await time.advanceBlock();
  });

  beforeEach(async function () {
    this.openingTime = (await time.latest()).add(time.duration.weeks(1));
    this.closingTime = this.openingTime.add(time.duration.weeks(1));
    this.afterClosingTime = this.closingTime.add(time.duration.seconds(1));

    this.cap = ether('3');
    this.lessThanCap = ether('2');

    this.goal = ether('2');
    this.lessThanGoal = ether('1');

    this.rate = new BN(1000);

    this.maxTokenSupply = this.cap.mul(this.rate);

    this.escrowState = {
      active: new BN(0),
      refunding: new BN(1),
      closed: new BN(2),
    };

    this.token = await ERC20Mock.new(owner, this.maxTokenSupply, { from: owner });
  });

  context('like a FriendlyCrowdsale', function () {
    it('requires a non-null rate', async function () {
      await expectRevert(
        FriendlyCrowdsale.new(
          this.openingTime,
          this.closingTime,
          this.cap,
          this.goal,
          0,
          wallet,
          this.token.address
        ),
        'Crowdsale: rate is 0'
      );
    });

    it('requires a non-null wallet', async function () {
      await expectRevert(
        FriendlyCrowdsale.new(
          this.openingTime,
          this.closingTime,
          this.cap,
          this.goal,
          this.rate,
          ZERO_ADDRESS,
          this.token.address
        ),
        'Crowdsale: wallet is the zero address'
      );
    });

    it('requires a non-null token', async function () {
      await expectRevert(
        FriendlyCrowdsale.new(
          this.openingTime,
          this.closingTime,
          this.cap,
          this.goal,
          this.rate,
          wallet,
          ZERO_ADDRESS
        ),
        'Crowdsale: token is the zero address'
      );
    });

    it('requires opening time is not in the past', async function () {
      await expectRevert(
        FriendlyCrowdsale.new(
          (await time.latest()).sub(time.duration.days(1)),
          this.closingTime,
          this.cap,
          this.goal,
          this.rate,
          wallet,
          this.token.address
        ),
        'TimedCrowdsale: opening time is before current time'
      );
    });

    it('requires closing time is not before the opening time', async function () {
      await expectRevert(
        FriendlyCrowdsale.new(
          this.openingTime,
          this.openingTime.sub(time.duration.seconds(1)),
          this.cap,
          this.goal,
          this.rate,
          wallet,
          this.token.address
        ),
        'TimedCrowdsale: opening time is not before closing time'
      );
    });

    it('requires closing time is not equals the opening time', async function () {
      await expectRevert(
        FriendlyCrowdsale.new(
          this.openingTime,
          this.openingTime,
          this.cap,
          this.goal,
          this.rate,
          wallet,
          this.token.address
        ),
        'TimedCrowdsale: opening time is not before closing time'
      );
    });

    it('requires a non-null cap', async function () {
      await expectRevert(
        FriendlyCrowdsale.new(
          this.openingTime,
          this.closingTime,
          0,
          this.goal,
          this.rate,
          wallet,
          this.token.address
        ),
        'CappedCrowdsale: cap is 0'
      );
    });

    it('requires a non-null goal', async function () {
      await expectRevert(
        FriendlyCrowdsale.new(
          this.openingTime,
          this.closingTime,
          this.cap,
          0,
          this.rate,
          wallet,
          this.token.address
        ),
        'FriendlyCrowdsale: goal is 0'
      );
    });

    it('requires goal is not greater than cap', async function () {
      await expectRevert(
        FriendlyCrowdsale.new(
          this.openingTime,
          this.closingTime,
          this.cap,
          this.cap.addn(1),
          this.rate,
          wallet,
          this.token.address
        ),
        'FriendlyCrowdsale: goal is not less or equal cap'
      );
    });

    context('once deployed', function () {
      beforeEach(async function () {
        this.crowdsale = await FriendlyCrowdsale.new(
          this.openingTime,
          this.closingTime,
          this.cap,
          this.goal,
          this.rate,
          wallet,
          this.token.address,
          { from: owner }
        );

        await this.token.transfer(this.crowdsale.address, this.maxTokenSupply, { from: owner });
      });

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

      context('test FriendlyCrowdale behavior', function () {
        shouldBehaveLikeFriendlyCrowdsale([owner, wallet, investor, purchaser, other]);
      });
    });
  });
});

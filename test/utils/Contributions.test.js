const { BN, ether, expectRevert } = require('openzeppelin-test-helpers');

const { shouldBehaveLikeTokenRecover } = require('eth-token-recover/test/TokenRecover.behaviour');

const { shouldBehaveLikeRemoveRole } = require('../access/roles/RemoveRole.behavior');

const Contributions = artifacts.require('Contributions');

contract('Contributions', function (
  [_, owner, operator, futureOperator, anotherFutureOperator, thirdParty, anotherThirdParty]
) {
  const tokenToAdd = new BN(100);
  const ethToAdd = ether('1');

  beforeEach(async function () {
    this.contributions = await Contributions.new({ from: owner });
    await this.contributions.addOperator(operator, { from: owner });
  });

  describe('if operator is calling', function () {
    it('should success to add amounts to the address balances', async function () {
      let tokenBalance = await this.contributions.tokenBalance(thirdParty);
      tokenBalance.should.be.bignumber.equal(new BN(0));
      let weiContribution = await this.contributions.weiContribution(thirdParty);
      weiContribution.should.be.bignumber.equal(new BN(0));

      await this.contributions.addBalance(thirdParty, ethToAdd, tokenToAdd, { from: operator });

      tokenBalance = await this.contributions.tokenBalance(thirdParty);
      tokenBalance.should.be.bignumber.equal(tokenToAdd);
      weiContribution = await this.contributions.weiContribution(thirdParty);
      weiContribution.should.be.bignumber.equal(ethToAdd);

      await this.contributions.addBalance(
        thirdParty,
        ethToAdd.muln(3),
        tokenToAdd.muln(3),
        { from: operator }
      );

      tokenBalance = await this.contributions.tokenBalance(thirdParty);
      tokenBalance.should.be.bignumber.equal(tokenToAdd.muln(4));
      weiContribution = await this.contributions.weiContribution(thirdParty);
      weiContribution.should.be.bignumber.equal(ethToAdd.muln(4));
    });

    it('should increase total sold tokens and total wei raised', async function () {
      let totalSoldTokens = await this.contributions.totalSoldTokens();
      let totalWeiRaised = await this.contributions.totalWeiRaised();
      totalSoldTokens.should.be.bignumber.equal(new BN(0));
      totalWeiRaised.should.be.bignumber.equal(new BN(0));

      await this.contributions.addBalance(thirdParty, ethToAdd, tokenToAdd, { from: operator });
      await this.contributions.addBalance(
        thirdParty,
        ethToAdd.muln(3),
        tokenToAdd.muln(3),
        { from: operator }
      );

      totalSoldTokens = await this.contributions.totalSoldTokens();
      totalWeiRaised = await this.contributions.totalWeiRaised();
      totalSoldTokens.should.be.bignumber.equal(tokenToAdd.muln(4));
      totalWeiRaised.should.be.bignumber.equal(ethToAdd.muln(4));
    });

    it('should increase array length when different address are passed', async function () {
      let contributorsLength = await this.contributions.getContributorsLength();
      assert.equal(contributorsLength, 0);

      await this.contributions.addBalance(thirdParty, ethToAdd, tokenToAdd, { from: operator });

      contributorsLength = await this.contributions.getContributorsLength();
      assert.equal(contributorsLength, 1);

      await this.contributions.addBalance(anotherThirdParty, ethToAdd, tokenToAdd, { from: operator });

      contributorsLength = await this.contributions.getContributorsLength();
      assert.equal(contributorsLength, 2);
    });

    it('should not increase array length when same address is passed', async function () {
      let contributorsLength = await this.contributions.getContributorsLength();
      assert.equal(contributorsLength, 0);

      await this.contributions.addBalance(thirdParty, ethToAdd, tokenToAdd, { from: operator });

      contributorsLength = await this.contributions.getContributorsLength();
      assert.equal(contributorsLength, 1);

      await this.contributions.addBalance(thirdParty, ethToAdd, tokenToAdd, { from: operator });

      contributorsLength = await this.contributions.getContributorsLength();
      assert.equal(contributorsLength, 1);
    });

    it('should cycle addresses and have the right value set', async function () {
      let contributorsLength = (await this.contributions.getContributorsLength()).valueOf();
      contributorsLength.should.be.bignumber.equal(new BN(0));

      (await this.contributions.contributorExists(owner)).should.be.equal(false);
      (await this.contributions.contributorExists(thirdParty)).should.be.equal(false);
      (await this.contributions.contributorExists(anotherThirdParty)).should.be.equal(false);

      await this.contributions.addBalance(
        owner,
        ethToAdd.muln(3),
        tokenToAdd.muln(3),
        { from: operator }
      );
      await this.contributions.addBalance(
        thirdParty,
        ethToAdd.muln(4),
        tokenToAdd.muln(4),
        { from: operator }
      );
      await this.contributions.addBalance(anotherThirdParty, ethToAdd, tokenToAdd, { from: operator });
      await this.contributions.addBalance(anotherThirdParty, ethToAdd, tokenToAdd, { from: operator });

      (await this.contributions.contributorExists(owner)).should.be.equal(true);
      (await this.contributions.contributorExists(thirdParty)).should.be.equal(true);
      (await this.contributions.contributorExists(anotherThirdParty)).should.be.equal(true);

      const tokenBalances = [];
      tokenBalances[owner] = await this.contributions.tokenBalance(owner);
      tokenBalances[thirdParty] = await this.contributions.tokenBalance(thirdParty);
      tokenBalances[anotherThirdParty] = await this.contributions.tokenBalance(anotherThirdParty);

      const weiContributions = [];
      weiContributions[owner] = await this.contributions.weiContribution(owner);
      weiContributions[thirdParty] = await this.contributions.weiContribution(thirdParty);
      weiContributions[anotherThirdParty] = await this.contributions.weiContribution(anotherThirdParty);

      contributorsLength = (await this.contributions.getContributorsLength()).valueOf();
      for (let i = 0; i < contributorsLength; i++) {
        const address = await this.contributions.getContributorAddress(i);
        const tokenBalance = await this.contributions.tokenBalance(address);
        const weiContribution = await this.contributions.weiContribution(address);

        tokenBalance.should.be.bignumber.equal(tokenBalances[address]);
        weiContribution.should.be.bignumber.equal(weiContributions[address]);
      }
    });
  });

  describe('if third party is calling', function () {
    it('reverts and fail to add amounts to the address balances', async function () {
      let tokenBalance = await this.contributions.tokenBalance(thirdParty);
      let weiContribution = await this.contributions.weiContribution(thirdParty);
      assert.equal(tokenBalance, 0);
      assert.equal(weiContribution, 0);

      await expectRevert.unspecified(
        this.contributions.addBalance(thirdParty, ethToAdd, tokenToAdd, { from: thirdParty })
      );

      (await this.contributions.contributorExists(thirdParty)).should.be.equal(false);

      tokenBalance = await this.contributions.tokenBalance(thirdParty);
      weiContribution = await this.contributions.weiContribution(thirdParty);

      assert.equal(tokenBalance, 0);
      assert.equal(weiContribution, 0);
    });
  });

  context('testing remove roles', function () {
    beforeEach(async function () {
      this.contract = this.contributions;
    });

    describe('operator', function () {
      shouldBehaveLikeRemoveRole(owner, operator, [thirdParty], 'operator');
    });
  });

  context('like a TokenRecover', function () {
    beforeEach(async function () {
      this.instance = this.contributions;
    });

    shouldBehaveLikeTokenRecover([owner, thirdParty]);
  });
});

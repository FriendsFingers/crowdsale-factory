const { BN, constants, expectRevert, time } = require('openzeppelin-test-helpers');
const { ZERO_ADDRESS } = constants;

const { shouldBehaveLikeTokenRecover } = require('eth-token-recover/test/TokenRecover.behaviour');
const { shouldBehaveLikeFriendlyCrowdsale } = require('./behaviours/FriendlyCrowdsale.behaviour');

const FriendlyCrowdsale = artifacts.require('FriendlyCrowdsale');
const ERC1363Mock = artifacts.require('ERC1363Mock');
const Contributions = artifacts.require('Contributions');
const DAO = artifacts.require('DAO');

contract('FriendlyCrowdsale', function ([owner, wallet, member, operator, dappMock, thirdParty]) {
  const initialTokenSupply = new BN(1000000000);

  const rate = new BN(1000);

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await time.advanceBlock();
  });

  beforeEach(async function () {
    this.token = await ERC1363Mock.new(owner, initialTokenSupply, { from: owner });
    this.dao = await DAO.new(this.token.address, { from: owner });
    this.contributions = await Contributions.new({ from: owner });
  });

  context('like a FriendlyCrowdsale', function () {
    it('requires a non-null rate', async function () {
      await expectRevert(
        FriendlyCrowdsale.new(
          0,
          wallet,
          this.token.address,
          this.contributions.address,
          this.dao.address
        ),
        'FriendlyCrowdsale: rate is 0'
      );
    });

    it('requires a non-null wallet', async function () {
      await expectRevert(
        FriendlyCrowdsale.new(
          rate,
          ZERO_ADDRESS,
          this.token.address,
          this.contributions.address,
          this.dao.address
        ),
        'FriendlyCrowdsale: wallet is the zero address'
      );
    });

    it('requires a non-null token', async function () {
      await expectRevert(
        FriendlyCrowdsale.new(
          rate,
          wallet,
          ZERO_ADDRESS,
          this.contributions.address,
          this.dao.address
        ),
        'FriendlyCrowdsale: token is the zero address'
      );
    });

    it('requires a non-null contributions', async function () {
      await expectRevert(
        FriendlyCrowdsale.new(
          rate,
          wallet,
          this.token.address,
          ZERO_ADDRESS,
          this.dao.address
        ),
        'FriendlyCrowdsale: contributions is the zero address'
      );
    });

    it('requires a non-null dao', async function () {
      await expectRevert(
        FriendlyCrowdsale.new(
          rate,
          wallet,
          this.token.address,
          this.contributions.address,
          ZERO_ADDRESS
        ),
        'FriendlyCrowdsale: dao is the zero address'
      );
    });

    context('once deployed', function () {
      beforeEach(async function () {
        this.crowdsale = await FriendlyCrowdsale.new(
          rate,
          wallet,
          this.token.address,
          this.contributions.address,
          this.dao.address,
          { from: owner }
        );

        await this.contributions.addOperator(this.crowdsale.address, { from: owner });

        await this.token.transfer(this.crowdsale.address, initialTokenSupply, { from: owner });
      });

      it('rate should be right set', async function () {
        (await this.crowdsale.rate()).should.be.bignumber.equal(rate);
      });

      it('wallet should be right set', async function () {
        (await this.crowdsale.wallet()).should.be.equal(wallet);
      });

      it('token should be right set', async function () {
        (await this.crowdsale.token()).should.be.equal(this.token.address);
      });

      it('contributions should be right set', async function () {
        (await this.crowdsale.contributions()).should.be.equal(this.contributions.address);
      });

      it('dao should be right set', async function () {
        (await this.crowdsale.dao()).should.be.equal(this.dao.address);
      });

      describe('set new rate', function () {
        const newRate = new BN(2000);

        describe('if owner is calling', function () {
          describe('if set a valid rate', function () {
            it('should success', async function () {
              await this.crowdsale.setRate(newRate, { from: owner });
              (await this.crowdsale.rate()).should.be.bignumber.equal(newRate);
            });
          });

          describe('if set an invalid rate', function () {
            it('reverts', async function () {
              await expectRevert(
                this.crowdsale.setRate(0, { from: owner }),
                'FriendlyCrowdsale: rate is 0'
              );
            });
          });
        });

        describe('if third party is calling', function () {
          it('reverts', async function () {
            await expectRevert(
              this.crowdsale.setRate(newRate, { from: thirdParty }),
              'Ownable: caller is not the owner'
            );
          });
        });
      });

      context('testing crowdsale behaviors', function () {
        const tokenAmount = new BN(100);

        context('if not a member wants to purchase', function () {
          const bonus = new BN(1);
          shouldBehaveLikeFriendlyCrowdsale(thirdParty, wallet, rate, bonus);
        });

        context('if a member without staked tokens wants to purchase', function () {
          beforeEach(async function () {
            await this.dao.join({ from: member });
          });

          const bonus = new BN(2);
          shouldBehaveLikeFriendlyCrowdsale(member, wallet, rate, bonus);
        });

        context('if a member with staked tokens wants to purchase', function () {
          beforeEach(async function () {
            await this.token.mintMock(member, tokenAmount);

            await this.dao.join({ from: member });
            await this.token.transferAndCall(this.dao.address, tokenAmount, { from: member });
          });

          const bonus = new BN(4);
          shouldBehaveLikeFriendlyCrowdsale(member, wallet, rate, bonus);
        });

        context('if a member with used tokens wants to purchase', function () {
          beforeEach(async function () {
            await this.dao.addOperator(operator, { from: owner });
            await this.dao.addDapp(dappMock, { from: operator });

            await this.token.mintMock(member, tokenAmount);

            await this.dao.join({ from: member });
            await this.token.transferAndCall(this.dao.address, tokenAmount, { from: member });
            await this.dao.use(member, tokenAmount, { from: dappMock });
          });

          const bonus = new BN(4);
          shouldBehaveLikeFriendlyCrowdsale(member, wallet, rate, bonus);
        });

        context('if a member with staked and used tokens wants to purchase', function () {
          beforeEach(async function () {
            await this.dao.addOperator(operator, { from: owner });
            await this.dao.addDapp(dappMock, { from: operator });

            await this.token.mintMock(member, tokenAmount);

            await this.dao.join({ from: member });
            await this.token.transferAndCall(this.dao.address, tokenAmount, { from: member });
            await this.dao.use(member, tokenAmount.divn(2), { from: dappMock });
          });

          const bonus = new BN(8);
          shouldBehaveLikeFriendlyCrowdsale(member, wallet, rate, bonus);
        });
      });

      context('like a TokenRecover', function () {
        beforeEach(async function () {
          this.instance = this.crowdsale;
        });

        shouldBehaveLikeTokenRecover([owner, thirdParty]);
      });
    });
  });
});

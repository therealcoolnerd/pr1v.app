import { expect } from 'chai';
import pkg from 'hardhat';
const { ethers } = pkg;

describe('GiftLinkFactory', function () {
  let owner, alice, bob, gift;
  const fee = ethers.utils.parseEther('0.01');

  beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();
    const Gift = await ethers.getContractFactory('GiftLinkFactory');
    gift = await Gift.deploy(fee, owner.address);
    await gift.deployed();
  });

  it('creates and claims an ETH gift', async () => {
    const secret = ethers.utils.formatBytes32String('sup');
    const expiry = (await ethers.provider.getBlock('latest')).timestamp + 3600;
    const secretHash = ethers.utils.keccak256(secret);

    // create
    await gift.connect(alice).createGift(
      ethers.constants.AddressZero,
      ethers.utils.parseEther('1'),
      secretHash,
      expiry,
      { value: ethers.utils.parseEther('1').add(fee) }
    );

    // claim
    await expect(() =>
      gift.claim(secret, bob.address)
    ).to.changeEtherBalance(bob, ethers.utils.parseEther('1'));
  });
});
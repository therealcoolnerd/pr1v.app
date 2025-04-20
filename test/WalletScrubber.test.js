import { expect } from 'chai';
import pkg from 'hardhat';
const { ethers } = pkg;

describe('WalletScrubber', function () {
  let owner, feeRecipient, user, token, scrubber;
  const fee = ethers.utils.parseEther('0.01');
  const DEAD = '0x000000000000000000000000000000000000dEaD';

  beforeEach(async () => {
    [owner, feeRecipient, user] = await ethers.getSigners();

    const Mock = await ethers.getContractFactory('MockERC20');
    token = await Mock.deploy('Mock', 'MOCK');
    await token.deployed();

    const Scrubber = await ethers.getContractFactory('WalletScrubber');
    scrubber = await Scrubber.deploy(fee, feeRecipient.address);
    await scrubber.deployed();

    // fund scrubber with tokens
    await token.mint(scrubber.address, ethers.utils.parseEther('100'));
    await scrubber.setBurnAddress(DEAD);
  });

  it('burns entire token balance to burn address', async () => {
    const preDead = await token.balanceOf(DEAD);
    const preBal = await token.balanceOf(scrubber.address);

    await scrubber.connect(user).scrub(token.address, { value: fee });

    const postDead = await token.balanceOf(DEAD);
    const postBal = await token.balanceOf(scrubber.address);
    expect(postDead.sub(preDead)).to.equal(preBal);
    expect(postBal).to.equal(0);
  });
});
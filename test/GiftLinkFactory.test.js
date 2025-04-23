const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GiftLinkFactory (Sepolia Ready)", function () {
  let GiftLinkFactory, factory, owner, addr1, token, fee, feeRecipient;
  const secret = ethers.utils.formatBytes32String("super_secret");

  beforeEach(async function () {
    [owner, addr1, feeRecipient] = await ethers.getSigners();
    fee = ethers.utils.parseEther("0.01");

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy("Mock Token", "MOCK");
    await token.deployed();

    GiftLinkFactory = await ethers.getContractFactory("GiftLinkFactory");
    factory = await GiftLinkFactory.deploy(fee, feeRecipient.address);
    await factory.deployed();
  });

  it("should create ETH gift link", async () => {
    const hash = ethers.utils.keccak256(secret);
    const amount = ethers.utils.parseEther("0.5");
    const expiry = Math.floor(Date.now() / 1000) + 86400;

    await factory.createGiftLink(
      ethers.constants.AddressZero,
      amount,
      hash,
      expiry,
      { value: fee.add(amount) }
    );

    const gift = await factory.giftLinks(hash);
    expect(gift.amount).to.equal(amount);
    expect(gift.token).to.equal(ethers.constants.AddressZero);
    expect(gift.claimed).to.equal(false);
  });

  it("should create token gift link", async () => {
    const hash = ethers.utils.keccak256(secret);
    const amount = ethers.utils.parseUnits("100", 18);
    const expiry = Math.floor(Date.now() / 1000) + 86400;

    await token.approve(factory.address, amount);
    await factory.createGiftLink(
      token.address,
      amount,
      hash,
      expiry,
      { value: fee }
    );

    const gift = await factory.giftLinks(hash);
    expect(gift.amount).to.equal(amount);
    expect(gift.token).to.equal(token.address);
  });

  it("should allow recipient to claim ETH gift", async () => {
    const hash = ethers.utils.keccak256(secret);
    const amount = ethers.utils.parseEther("0.5");
    const expiry = Math.floor(Date.now() / 1000) + 86400;

    await factory.createGiftLink(
      ethers.constants.AddressZero,
      amount,
      hash,
      expiry,
      { value: fee.add(amount) }
    );

    const before = await ethers.provider.getBalance(addr1.address);
    await factory.connect(owner).claimGift(secret, addr1.address);
    const after = await ethers.provider.getBalance(addr1.address);
    expect(after).to.be.above(before);
  });

  it("should allow cancellation of expired gift", async () => {
    const hash = ethers.utils.keccak256(secret);
    const amount = ethers.utils.parseEther("0.5");
    const expiry = Math.floor(Date.now() / 1000);

    await factory.createGiftLink(
      ethers.constants.AddressZero,
      amount,
      hash,
      expiry,
      { value: fee.add(amount) }
    );

    await factory.cancelGift(hash);
    const gift = await factory.giftLinks(hash);
    expect(gift.claimed).to.be.true;
  });
});
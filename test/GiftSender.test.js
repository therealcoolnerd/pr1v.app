const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GiftSender", function () {
  it("Should deploy and update fee", async function () {
    const [owner] = await ethers.getSigners();
    const GiftSender = await ethers.getContractFactory("GiftSender");
    const giftSender = await GiftSender.deploy(ethers.utils.parseEther("0.01"));
    await giftSender.deployed();

    expect(await giftSender.flatFee()).to.equal(ethers.utils.parseEther("0.01"));
    await giftSender.updateFee(ethers.utils.parseEther("0.02"));
    expect(await giftSender.flatFee()).to.equal(ethers.utils.parseEther("0.02"));
  });
});
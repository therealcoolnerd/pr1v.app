const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Pr1v.app Smart Contract Tests", function () {
  let walletScrubberTest;
  let zkSendTest;
  let giftLinkFactoryTest;
  let verifierTest;
  let owner;
  let addr1;
  let addr2;

  before(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy test contracts
    const WalletScrubberTest = await ethers.getContractFactory("WalletScrubberTest");
    walletScrubberTest = await WalletScrubberTest.deploy();
    await walletScrubberTest.deployed();

    const ZkSendTest = await ethers.getContractFactory("ZkSendTest");
    zkSendTest = await ZkSendTest.deploy();
    await zkSendTest.deployed();

    const GiftLinkFactoryTest = await ethers.getContractFactory("GiftLinkFactoryTest");
    giftLinkFactoryTest = await GiftLinkFactoryTest.deploy();
    await giftLinkFactoryTest.deployed();

    const VerifierTest = await ethers.getContractFactory("VerifierTest");
    verifierTest = await VerifierTest.deploy();
    await verifierTest.deployed();
  });

  describe("WalletScrubber Tests", function () {
    it("Should burn tokens successfully", async function () {
      await walletScrubberTest.testBurnToken();
    });

    it("Should generate migration plan successfully", async function () {
      await walletScrubberTest.testMigrationPlan();
    });

    it("Should run all WalletScrubber tests", async function () {
      await walletScrubberTest.runTests();
    });
  });

  describe("ZkSend Tests", function () {
    it("Should deposit ETH successfully", async function () {
      await zkSendTest.testEthDeposit();
    });

    it("Should deposit tokens successfully", async function () {
      await zkSendTest.testTokenDeposit();
    });

    it("Should withdraw funds successfully", async function () {
      await zkSendTest.testWithdraw();
    });

    it("Should run all ZkSend tests", async function () {
      await zkSendTest.runTests();
    });
  });

  describe("GiftLinkFactory Tests", function () {
    it("Should create ETH gift link successfully", async function () {
      await giftLinkFactoryTest.testCreateEthGiftLink();
    });

    it("Should create token gift link successfully", async function () {
      await giftLinkFactoryTest.testCreateTokenGiftLink();
    });

    it("Should claim gift successfully", async function () {
      await giftLinkFactoryTest.testClaimGift();
    });

    it("Should cancel gift successfully", async function () {
      await giftLinkFactoryTest.testCancelGift();
    });

    it("Should run all GiftLinkFactory tests", async function () {
      await giftLinkFactoryTest.runTests();
    });
  });

  describe("Verifier Tests", function () {
    it("Should verify proof successfully", async function () {
      await verifierTest.testVerifyProof();
    });

    it("Should verify batch proof successfully", async function () {
      await verifierTest.testVerifyBatchProof();
    });

    it("Should run all Verifier tests", async function () {
      await verifierTest.runTests();
    });
  });
});

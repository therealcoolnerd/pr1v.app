const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Set fee and fee recipient
  const fee = ethers.utils.parseEther("0.01"); // 0.01 ETH fee
  const feeRecipient = "0x52b1b0673b856B214d7fE4846cf9509Ef7F0d74D"; // User-specified payout address

  // Deploy Verifier first
  const Verifier = await ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();
  await verifier.deployed();
  console.log("Verifier deployed to:", verifier.address);

  // Deploy WalletScrubber
  const WalletScrubber = await ethers.getContractFactory("WalletScrubber");
  const walletScrubber = await WalletScrubber.deploy(fee, feeRecipient);
  await walletScrubber.deployed();
  console.log("WalletScrubber deployed to:", walletScrubber.address);

  // Deploy ZkSend
  const ZkSend = await ethers.getContractFactory("ZkSend");
  const zkSend = await ZkSend.deploy(fee, feeRecipient, verifier.address);
  await zkSend.deployed();
  console.log("ZkSend deployed to:", zkSend.address);

  // Deploy GiftLinkFactory
  const GiftLinkFactory = await ethers.getContractFactory("GiftLinkFactory");
  const giftLinkFactory = await GiftLinkFactory.deploy(fee, feeRecipient);
  await giftLinkFactory.deployed();
  console.log("GiftLinkFactory deployed to:", giftLinkFactory.address);

  console.log("All contracts deployed successfully!");
  console.log("Contract addresses:");
  console.log("Verifier:", verifier.address);
  console.log("WalletScrubber:", walletScrubber.address);
  console.log("ZkSend:", zkSend.address);
  console.log("GiftLinkFactory:", giftLinkFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

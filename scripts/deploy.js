import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with', deployer.address);

  const fee = ethers.utils.parseEther('0.01');

  const Verifier = await ethers.getContractFactory('Verifier');
  const verifier = await Verifier.deploy();
  await verifier.deployed();

  const WalletScrubber = await ethers.getContractFactory('WalletScrubber');
  const scrubber = await WalletScrubber.deploy(fee, deployer.address);
  await scrubber.deployed();

  const Gift = await ethers.getContractFactory('GiftLinkFactory');
  const gift = await Gift.deploy(fee, deployer.address);
  await gift.deployed();

  const ZkSend = await ethers.getContractFactory('ZkSend');
  const zk = await ZkSend.deploy(fee, deployer.address, verifier.address);
  await zk.deployed();

  console.table({
    verifier: verifier.address,
    walletScrubber: scrubber.address,
    giftLinkFactory: gift.address,
    zkSend: zk.address,
  });
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

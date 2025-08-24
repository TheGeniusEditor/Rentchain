// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const RentalAgreement = await ethers.getContractFactory("RentalAgreement");
  const contract = await RentalAgreement.deploy(
    deployer.address,                      // For demo, deployer as renter
    "QmHash",                              // Dummy IPFS hash (replace as needed)
    ethers.utils.parseEther("0.01"),       // 0.01 ETH rent
    ethers.utils.parseEther("0.02"),       // 0.02 ETH deposit
    30                                     // Duration
  );
  await contract.deployed();
  console.log("RentalAgreement deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1); });

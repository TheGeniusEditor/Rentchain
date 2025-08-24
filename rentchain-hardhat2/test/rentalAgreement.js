const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RentalAgreement", function () {
  it("should deploy and create an agreement", async function () {
    const [landlord, renter] = await ethers.getSigners();
    const RentalAgreement = await ethers.getContractFactory("RentalAgreement");
    const contract = await RentalAgreement.deploy(
      renter.address, "QmHash", ethers.utils.parseEther("1"), ethers.utils.parseEther("2"), 30
    );
    await contract.deployed();
    expect(await contract.landlord()).to.equal(landlord.address);
  });

  it("should allow renter to activate the agreement", async function () {
    const [landlord, renter] = await ethers.getSigners();
    const RentalAgreement = await ethers.getContractFactory("RentalAgreement");
    const contract = await RentalAgreement.deploy(
      renter.address, "QmHash", ethers.utils.parseEther("1"), ethers.utils.parseEther("2"), 30
    );
    await contract.deployed();
    await contract.connect(renter).activateAgreement({ value: ethers.utils.parseEther("3") });
    expect(await contract.isActive()).to.equal(true);
  });
});

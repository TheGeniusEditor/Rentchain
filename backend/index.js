require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { JsonRpcProvider, Contract, Wallet, formatEther, parseEther, ContractFactory } = require('ethers');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- Dynamically load ABI and Bytecode from Hardhat artifact ---
const artifact = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../rentchain-hardhat2/artifacts/contracts/RentalAgreement.sol/RentalAgreement.json'),
    'utf8'
  )
);

const abi = artifact.abi;
const bytecode = artifact.bytecode;

// --- Setup Ethereum provider and contract instance ---
const provider = new JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const contract = new Contract(process.env.CONTRACT_ADDRESS, abi, provider);

// --- API Endpoints ---

// Deploy a new RentalAgreement contract
app.post('/deploy', async (req, res) => {
  try {
    const { renter, ipfsHash, rentEth, depositEth, duration } = req.body;
    const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
    const factory = new ContractFactory(abi, bytecode, wallet);

    const deployed = await factory.deploy(
      renter,
      ipfsHash,
      parseEther(rentEth),
      parseEther(depositEth),
      duration
    );
    await deployed.waitForDeployment();

    res.json({ address: deployed.target || deployed.address });
  } catch (err) {
    console.error("Deploy error:", err);
    res.status(400).json({ error: err.toString() });
  }
});

// ----------- Dynamic multi-address endpoints (new!) ----------------

// Get the status of any contract by address
app.get('/status/:address', async (req, res) => {
  try {
    const dynamicContract = new Contract(req.params.address, abi, provider);
    const isActive = await dynamicContract.isActive();
    const isTerminated = await dynamicContract.isTerminated();
    res.json({ isActive, isTerminated });
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  }
});

// Get agreement details of any contract by address
app.get('/agreement/:address', async (req, res) => {
  try {
    const dynamicContract = new Contract(req.params.address, abi, provider);
    const [
      landlord, renter, propertyIPFSHash, rentAmount,
      depositAmount, rentalDuration, isActive, isTerminated
    ] = await Promise.all([
      dynamicContract.landlord(),
      dynamicContract.renter(),
      dynamicContract.propertyIPFSHash(),
      dynamicContract.rentAmount(),
      dynamicContract.depositAmount(),
      dynamicContract.rentalDuration(),
      dynamicContract.isActive(),
      dynamicContract.isTerminated()
    ]);
    res.json({
      landlord,
      renter,
      propertyIPFSHash,
      rentAmount: formatEther(rentAmount),
      depositAmount: formatEther(depositAmount),
      rentalDuration: rentalDuration.toString(),
      isActive,
      isTerminated
    });
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  }
});

// Activate any contract by address
app.post('/activate', async (req, res) => {
  try {
    const { contractAddress, rentEth, depositEth } = req.body;
    const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
    const contractWithSigner = new Contract(contractAddress, abi, wallet);
    const value = parseEther((Number(rentEth) + Number(depositEth)).toString());
    const tx = await contractWithSigner.activateAgreement({ value });
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(400).json({ success: false, error: err.toString() });
  }
});

// Terminate any contract by address
app.post('/terminate', async (req, res) => {
  try {
    const { contractAddress } = req.body;
    const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
    const contractWithSigner = new Contract(contractAddress, abi, wallet);
    const tx = await contractWithSigner.terminateAgreement();
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(400).json({ success: false, error: err.toString() });
  }
});

// ----------- Default single-contract endpoints for legacy support (optional) -------------

app.get('/status', async (req, res) => {
  const isActive = await contract.isActive();
  const isTerminated = await contract.isTerminated();
  res.json({ isActive, isTerminated });
});

app.get('/agreement', async (req, res) => {
  const [
    landlord, renter, propertyIPFSHash, rentAmount,
    depositAmount, rentalDuration, isActive, isTerminated
  ] = await Promise.all([
    contract.landlord(),
    contract.renter(),
    contract.propertyIPFSHash(),
    contract.rentAmount(),
    contract.depositAmount(),
    contract.rentalDuration(),
    contract.isActive(),
    contract.isTerminated()
  ]);
  res.json({
    landlord,
    renter,
    propertyIPFSHash,
    rentAmount: formatEther(rentAmount),
    depositAmount: formatEther(depositAmount),
    rentalDuration: rentalDuration.toString(),
    isActive,
    isTerminated
  });
});

app.post('/activate-old', async (req, res) => {
  try {
    const { rentEth, depositEth } = req.body;
    const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
    const contractWithSigner = contract.connect(wallet);
    const value = parseEther((Number(rentEth) + Number(depositEth)).toString());
    const tx = await contractWithSigner.activateAgreement({ value });
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(400).json({ success: false, error: err.toString() });
  }
});

app.post('/terminate-old', async (req, res) => {
  try {
    const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
    const contractWithSigner = contract.connect(wallet);
    const tx = await contractWithSigner.terminateAgreement();
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(400).json({ success: false, error: err.toString() });
  }
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

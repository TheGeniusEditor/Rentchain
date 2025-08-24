require("dotenv").config();
const { ethers } = require("ethers");

// ABI with relevant functions
const abi = [
  // Only essential functions/events for brevity
  { "inputs": [], "name": "isActive", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "isTerminated", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "rentAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "depositAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "terminateAgreement", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

const RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Must be landlord/renter address
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

  // Check and log state before termination
  const isActiveBefore = await contract.isActive();
  const isTerminatedBefore = await contract.isTerminated();
  console.log("Before: isActive?", isActiveBefore, "isTerminated?", isTerminatedBefore);

  if (!isActiveBefore) {
    console.log("Agreement is not active, cannot terminate.");
    return;
  }

  // Terminate agreement
  const tx = await contract.terminateAgreement();
  console.log("Termination tx sent:", tx.hash);
  await tx.wait();
  console.log("Agreement terminated.");

  // Check and log state after termination
  const isActiveAfter = await contract.isActive();
  const isTerminatedAfter = await contract.isTerminated();
  console.log("After: isActive?", isActiveAfter, "isTerminated?", isTerminatedAfter);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

require("dotenv").config();
const { ethers } = require("ethers");

// Minimal ABI for isTerminated
const abi = [
  {
    "inputs": [],
    "name": "isTerminated",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const RPC_URL = process.env.SEPOLIA_RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
  const isTerminated = await contract.isTerminated();
  console.log("Agreement isTerminated?:", isTerminated);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

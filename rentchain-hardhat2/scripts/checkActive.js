require("dotenv").config();
const { ethers } = require("ethers");

const abi = [
    { "inputs": [], "name": "isActive", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }
];

const RPC_URL = process.env.SEPOLIA_RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    const isActive = await contract.isActive();
    console.log("Agreement isActive?:", isActive);
}

main();

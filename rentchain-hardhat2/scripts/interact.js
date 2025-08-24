require("dotenv").config();
const { ethers } = require("ethers");

// ABI extracted from your message
const abi = [
    {
        "inputs": [
            { "internalType": "address", "name": "_renter", "type": "address" },
            { "internalType": "string", "name": "_ipfsHash", "type": "string" },
            { "internalType": "uint256", "name": "_rent", "type": "uint256" },
            { "internalType": "uint256", "name": "_deposit", "type": "uint256" },
            { "internalType": "uint256", "name": "_duration", "type": "uint256" }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "renter", "type": "address" }], "name": "AgreementActivated", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "landlord", "type": "address" }, { "indexed": false, "internalType": "address", "name": "renter", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "rent", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "deposit", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "duration", "type": "uint256" }], "name": "AgreementCreated", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "initiator", "type": "address" }], "name": "AgreementTerminated", "type": "event" },
    { "inputs": [], "name": "activateAgreement", "outputs": [], "stateMutability": "payable", "type": "function" },
    { "inputs": [], "name": "depositAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "isActive", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "isTerminated", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "landlord", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "propertyIPFSHash", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "rentAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "rentalDuration", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "renter", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "terminateAgreement", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

// Load ENV variables
const RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

    // Read rent and deposit
    const rent = await contract.rentAmount();
    const deposit = await contract.depositAmount();
    const isActive = await contract.isActive();
    const isTerminated = await contract.isTerminated();

    console.log("Rent:", ethers.utils.formatEther(rent), "ETH");
    console.log("Deposit:", ethers.utils.formatEther(deposit), "ETH");
    console.log("Active?:", isActive);
    console.log("Terminated?:", isTerminated);

    // Activate agreement with payment (rent + deposit)
    if (!isActive) {
        console.log("\nActivating agreement (sending rent + deposit)...");
        const value = rent.add(deposit);
        const tx = await contract.activateAgreement({ value });
        console.log("Tx hash:", tx.hash);
        await tx.wait();
        console.log("Agreement activated.");
    } else {
        console.log("\nAgreement is already active.");
    }

    // Read new state
    const isActiveAfter = await contract.isActive();
    console.log("Active after?:", isActiveAfter);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});

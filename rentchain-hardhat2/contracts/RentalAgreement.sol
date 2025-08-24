// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RentalAgreement {
    address public landlord;
    address public renter;
    string public propertyIPFSHash;
    uint256 public rentAmount;
    uint256 public depositAmount;
    uint256 public rentalDuration;
    bool public isActive;
    bool public isTerminated;

    event AgreementCreated(address landlord, address renter, uint256 rent, uint256 deposit, uint256 duration);
    event AgreementActivated(address renter);
    event AgreementTerminated(address initiator);

    constructor(
        address _renter,
        string memory _ipfsHash,
        uint256 _rent,
        uint256 _deposit,
        uint256 _duration
    ) {
        landlord = msg.sender;
        renter = _renter;
        propertyIPFSHash = _ipfsHash;
        rentAmount = _rent;
        depositAmount = _deposit;
        rentalDuration = _duration;
        isActive = false;
        isTerminated = false;
        emit AgreementCreated(landlord, renter, rentAmount, depositAmount, rentalDuration);
    }

    function activateAgreement() public payable {
        require(msg.sender == renter, "Not authorized");
        require(!isActive && !isTerminated, "Cannot activate");
        require(msg.value == rentAmount + depositAmount, "Incorrect payment");
        isActive = true;
        emit AgreementActivated(msg.sender);
    }

    function terminateAgreement() public {
        require(msg.sender == renter || msg.sender == landlord, "Not authorized");
        require(isActive && !isTerminated, "Cannot terminate");
        // Set state first for security best practice
        isTerminated = true;
        isActive = false;
        payable(renter).transfer(depositAmount);
        emit AgreementTerminated(msg.sender);
    }
}

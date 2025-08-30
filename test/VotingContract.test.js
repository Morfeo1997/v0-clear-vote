const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingContract", function () {
  let VotingContract;
  let votingContract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    VotingContract = await ethers.getContractFactory("VotingContract");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    votingContract = await VotingContract.deploy();
    await votingContract.deployed();
  });

  describe("Election Creation", function () {
    it("Should create an election with correct parameters", async function () {
      const currentTime = Math.floor(Date.now() / 1000);
      const candidacyEnd = currentTime + 86400; // 1 day from now
      const startTime = currentTime + 172800; // 2 days from now
      const endTime = currentTime + 259200; // 3 days from now

      await expect(
        votingContract.createElection("Test Election", startTime, candidacyEnd, endTime)
      )
        .to.emit(votingContract, "ElectionCreated")
        .withArgs(1, "Test Election", startTime, endTime);

      const election = await votingContract.getElection(1);
      expect(election.title).to.equal("Test Election");
      expect(election.creator).to.equal(owner.address);
    });

    it("Should fail to create election with invalid times", async function () {
      const currentTime = Math.floor(Date.now() / 1000);
      const pastTime = currentTime - 86400;
      
      await expect(
        votingContract.createElection("Test Election", pastTime, pastTime, pastTime)
      ).to.be.revertedWith("Start time must be in the future");
    });
  });

  describe("Candidate Management", function () {
    let electionId;

    beforeEach(async function () {
      const currentTime = Math.floor(Date.now() / 1000);
      const candidacyEnd = currentTime + 86400;
      const startTime = currentTime + 172800;
      const endTime = currentTime + 259200;

      await votingContract.createElection("Test Election", startTime, candidacyEnd, endTime);
      electionId = 1;
    });

    it("Should register and approve candidate", async function () {
      const candidateId = await votingContract.callStatic.registerCandidate(electionId);
      await votingContract.registerCandidate(electionId);

      await expect(
        votingContract.approveCandidate(electionId, candidateId, "John Doe")
      )
        .to.emit(votingContract, "CandidateApproved")
        .withArgs(electionId, candidateId, "John Doe");

      const candidate = await votingContract.getCandidate(candidateId);
      expect(candidate.name).to.equal("John Doe");
      expect(candidate.approved).to.be.true;
    });

    it("Should fail to approve candidate if not election creator", async function () {
      const candidateId = await votingContract.callStatic.registerCandidate(electionId);
      await votingContract.registerCandidate(electionId);

      await expect(
        votingContract.connect(addr1).approveCandidate(electionId, candidateId, "John Doe")
      ).to.be.revertedWith("Only election creator can perform this action");
    });
  });

  describe("Voting", function () {
    let electionId;
    let candidateId;

    beforeEach(async function () {
      // Deploy a fresh contract for each test
      VotingContract = await ethers.getContractFactory("VotingContract");
      votingContract = await VotingContract.deploy();
      await votingContract.deployed();

      // Get current block timestamp
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      const currentTime = block.timestamp;
      
      const candidacyEnd = currentTime + 100;
      const startTime = currentTime + 200;
      const endTime = currentTime + 300;

      await votingContract.createElection("Test Election", startTime, candidacyEnd, endTime);
      electionId = 1;

      candidateId = await votingContract.callStatic.registerCandidate(electionId);
      await votingContract.registerCandidate(electionId);
      await votingContract.approveCandidate(electionId, candidateId, "John Doe");

      // Fast forward time to voting period
      await ethers.provider.send("evm_increaseTime", [250]);
      await ethers.provider.send("evm_mine");
    });

    it("Should cast vote successfully", async function () {
      const voteHash = "unique-vote-hash-123";

      await expect(
        votingContract.connect(addr1).vote(electionId, candidateId, voteHash)
      )
        .to.emit(votingContract, "VoteCast")
        .withArgs(electionId, candidateId, addr1.address, voteHash, 1);

      const candidate = await votingContract.getCandidate(candidateId);
      expect(candidate.votes).to.equal(1);
    });

    it("Should prevent double voting", async function () {
      const voteHash1 = "unique-vote-hash-123";
      const voteHash2 = "unique-vote-hash-456";

      await votingContract.connect(addr1).vote(electionId, candidateId, voteHash1);

      await expect(
        votingContract.connect(addr1).vote(electionId, candidateId, voteHash2)
      ).to.be.revertedWith("Already voted in this election");
    });

    it("Should prevent reusing vote hashes", async function () {
      const voteHash = "unique-vote-hash-123";

      await votingContract.connect(addr1).vote(electionId, candidateId, voteHash);

      await expect(
        votingContract.connect(addr2).vote(electionId, candidateId, voteHash)
      ).to.be.revertedWith("Vote hash already used");
    });
  });
});

const hre = require("hardhat");
require('dotenv').config();

async function main() {
  console.log("🧪 Testing Contract Integration...\n");

  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
  const PRIVATE_KEY_OWNER = process.env.PRIVATE_KEY_OWNER;

  if (!CONTRACT_ADDRESS || !PRIVATE_KEY_OWNER) {
    console.error("❌ Missing environment variables");
    console.error("Required: CONTRACT_ADDRESS, PRIVATE_KEY_OWNER");
    process.exit(1);
  }

  // Connect to deployed contract
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = VotingContract.attach(CONTRACT_ADDRESS);

  console.log(`🔗 Connected to contract: ${CONTRACT_ADDRESS}`);
  console.log(`🌐 Network: ${hre.network.name}\n`);

  try {
    // Test 1: Get current state
    console.log("📊 Current Contract State:");
    const owner = await votingContract.owner();
    const totalElections = await votingContract.getTotalElections();
    const totalCandidates = await votingContract.getTotalCandidates();

    console.log(`   Owner: ${owner}`);
    console.log(`   Total Elections: ${totalElections}`);
    console.log(`   Total Candidates: ${totalCandidates}\n`);

    // Test 2: Create a test election
    console.log("🗳️  Creating test election...");
    
    const currentTime = Math.floor(Date.now() / 1000);
    const candidacyEnd = currentTime + 86400; // 1 day
    const startTime = currentTime + 172800; // 2 days  
    const endTime = currentTime + 259200; // 3 days

    const tx = await votingContract.createElection(
      "Integration Test Election",
      startTime,
      candidacyEnd,
      endTime
    );

    console.log(`   Transaction Hash: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`   Block: ${receipt.blockNumber}`);
    console.log(`   Gas Used: ${receipt.gasUsed}\n`);

    // Test 3: Check updated state
    console.log("📈 Updated Contract State:");
    const newTotalElections = await votingContract.getTotalElections();
    console.log(`   Total Elections: ${newTotalElections}\n`);

    // Test 4: Get election details
    const electionId = 1;
    const election = await votingContract.getElection(electionId);
    console.log("🔍 Election Details:");
    console.log(`   ID: ${election.id}`);
    console.log(`   Title: ${election.title}`);
    console.log(`   Start Time: ${new Date(Number(election.startTime) * 1000).toISOString()}`);
    console.log(`   End Time: ${new Date(Number(election.endTime) * 1000).toISOString()}`);
    console.log(`   Creator: ${election.creator}\n`);

    // Test 5: Register a candidate
    console.log("👤 Registering test candidate...");
    const candidateTx = await votingContract.registerCandidate(electionId);
    const candidateReceipt = await candidateTx.wait();
    console.log(`   Transaction Hash: ${candidateTx.hash}`);
    console.log(`   Gas Used: ${candidateReceipt.gasUsed}\n`);

    // Test 6: Check candidates
    const newTotalCandidates = await votingContract.getTotalCandidates();
    console.log(`📊 Total Candidates: ${newTotalCandidates}\n`);

    console.log("✅ All integration tests passed!");
    console.log("🚀 Contract is fully operational and ready for Edge Functions!");

  } catch (error) {
    console.error("❌ Integration test failed:");
    console.error(error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

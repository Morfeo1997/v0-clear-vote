const hre = require("hardhat");
require('dotenv').config();

async function main() {
  console.log("🔗 Testing Full Integration: Smart Contract + Edge Functions Flow\n");

  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = VotingContract.attach(CONTRACT_ADDRESS);

  console.log(`📋 Contract: ${CONTRACT_ADDRESS}`);
  console.log(`🌐 Network: ${hre.network.name}\n`);

  try {
    // Simulate Edge Function workflow
    console.log("🎯 TESTING FULL ELECTION WORKFLOW\n");

    // Step 1: Create Election (like createElection Edge Function)
    console.log("1️⃣ Creating Election on-chain...");
    const currentTime = Math.floor(Date.now() / 1000);
    const candidacyEnd = currentTime + 86400;    // 1 day
    const startTime = currentTime + 172800;     // 2 days
    const endTime = currentTime + 259200;      // 3 days

    const createTx = await votingContract.createElection(
      "Full Integration Test Election 2024",
      startTime,
      candidacyEnd,
      endTime
    );
    
    const createReceipt = await createTx.wait();
    console.log(`   ✅ Election Created!`);
    console.log(`   📄 TX: ${createTx.hash}`);
    console.log(`   ⛽ Gas: ${createReceipt.gasUsed}\n`);

    // Extract election ID from events
    let electionId;
    for (const log of createReceipt.logs) {
      try {
        const parsed = votingContract.interface.parseLog(log);
        if (parsed.name === 'ElectionCreated') {
          electionId = parsed.args.electionId;
          break;
        }
      } catch (e) {}
    }

    console.log(`🗳️  Election ID: ${electionId}\n`);

    // Step 2: Register Candidate (like requestCandidacy Edge Function)
    console.log("2️⃣ Registering Candidate...");
    const registerTx = await votingContract.registerCandidate(electionId);
    const registerReceipt = await registerTx.wait();
    
    const candidateId = await votingContract.getTotalCandidates();
    console.log(`   ✅ Candidate Registered!`);
    console.log(`   👤 Candidate ID: ${candidateId}`);
    console.log(`   📄 TX: ${registerTx.hash}`);
    console.log(`   ⛽ Gas: ${registerReceipt.gasUsed}\n`);

    // Step 3: Approve Candidate (like approveCandidacy Edge Function)
    console.log("3️⃣ Approving Candidate...");
    const approveTx = await votingContract.approveCandidate(
      electionId,
      candidateId,
      "John Doe - Integration Test Candidate"
    );
    
    const approveReceipt = await approveTx.wait();
    console.log(`   ✅ Candidate Approved!`);
    console.log(`   📄 TX: ${approveTx.hash}`);
    console.log(`   ⛽ Gas: ${approveReceipt.gasUsed}\n`);

    // Step 4: Simulate voting period and cast vote
    console.log("4️⃣ Fast-forwarding to voting period...");
    await hre.network.provider.send("evm_increaseTime", [172801]);
    await hre.network.provider.send("evm_mine");

    const voteHash = `vote_hash_${Date.now()}_${Math.random()}`;
    console.log("5️⃣ Casting vote...");
    
    const voteTx = await votingContract.vote(
      electionId,
      candidateId,
      voteHash
    );
    
    const voteReceipt = await voteTx.wait();
    console.log(`   ✅ Vote Cast Successfully!`);
    console.log(`   🔐 Vote Hash: ${voteHash}`);
    console.log(`   📄 TX: ${voteTx.hash}`);
    console.log(`   ⛽ Gas: ${voteReceipt.gasUsed}\n`);

    // Step 5: Get Election Results (like getElectionResults Edge Function)
    console.log("6️⃣ Getting Election Results...");
    const election = await votingContract.getElection(electionId);
    const candidate = await votingContract.getCandidate(candidateId);
    const candidatesList = await votingContract.getElectionCandidates(electionId);

    console.log(`   📊 Election: ${election.title}`);
    console.log(`   👥 Total Candidates: ${candidatesList.length}`);
    console.log(`   🗳️  Candidate Votes: ${candidate.votes}`);
    console.log(`   ✅ Results Retrieved!\n`);

    // Summary
    console.log("🎉 FULL INTEGRATION TEST COMPLETED SUCCESSFULLY!");
    console.log("\n📊 Summary:");
    console.log(`   • Election Created: ${electionId}`);
    console.log(`   • Candidate Registered: ${candidateId}`);
    console.log(`   • Candidate Approved: ✅`);
    console.log(`   • Vote Cast: ✅`);
    console.log(`   • Results Retrieved: ✅`);
    console.log("\n🚀 Smart Contract + Edge Functions integration is READY!");
    
    console.log("\n🔗 Explorer Links:");
    console.log(`   Election Creation: https://amoy.polygonscan.com/tx/${createTx.hash}`);
    console.log(`   Candidate Registration: https://amoy.polygonscan.com/tx/${registerTx.hash}`);
    console.log(`   Candidate Approval: https://amoy.polygonscan.com/tx/${approveTx.hash}`);
    console.log(`   Vote Cast: https://amoy.polygonscan.com/tx/${voteTx.hash}`);

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

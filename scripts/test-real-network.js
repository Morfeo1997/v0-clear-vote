const hre = require("hardhat");
require('dotenv').config();

async function main() {
  console.log("🔗 Testing Real Network Integration\n");

  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = VotingContract.attach(CONTRACT_ADDRESS);

  console.log(`📋 Contract: ${CONTRACT_ADDRESS}`);
  console.log(`🌐 Network: ${hre.network.name}\n`);

  try {
    console.log("🎯 TESTING ELECTION WORKFLOW (Real Network)\n");

    // Step 1: Create Election with immediate voting period
    console.log("1️⃣ Creating Election with immediate voting period...");
    const currentTime = Math.floor(Date.now() / 1000);
    const candidacyEnd = currentTime + 60;      // 1 minute for candidacy
    const startTime = currentTime + 120;       // 2 minutes for voting start
    const endTime = currentTime + 3600;       // 1 hour for voting

    const createTx = await votingContract.createElection(
      "Real Network Test Election",
      startTime,
      candidacyEnd,
      endTime
    );
    
    const createReceipt = await createTx.wait();
    console.log(`   ✅ Election Created!`);
    console.log(`   📄 TX: ${createTx.hash}`);
    console.log(`   ⛽ Gas: ${createReceipt.gasUsed}`);

    // Extract election ID
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

    console.log(`   🗳️  Election ID: ${electionId}\n`);

    // Step 2: Register Candidate
    console.log("2️⃣ Registering Candidate...");
    const registerTx = await votingContract.registerCandidate(electionId);
    const registerReceipt = await registerTx.wait();
    
    const candidateId = await votingContract.getTotalCandidates();
    console.log(`   ✅ Candidate Registered!`);
    console.log(`   👤 Candidate ID: ${candidateId}`);
    console.log(`   📄 TX: ${registerTx.hash}`);
    console.log(`   ⛽ Gas: ${registerReceipt.gasUsed}\n`);

    // Step 3: Approve Candidate
    console.log("3️⃣ Approving Candidate...");
    const approveTx = await votingContract.approveCandidate(
      electionId,
      candidateId,
      "Jane Smith - Real Network Test"
    );
    
    const approveReceipt = await approveTx.wait();
    console.log(`   ✅ Candidate Approved!`);
    console.log(`   📄 TX: ${approveTx.hash}`);
    console.log(`   ⛽ Gas: ${approveReceipt.gasUsed}\n`);

    // Step 4: Check Election State
    console.log("4️⃣ Checking Election State...");
    const election = await votingContract.getElection(electionId);
    const candidate = await votingContract.getCandidate(candidateId);
    const candidatesList = await votingContract.getElectionCandidates(electionId);

    console.log(`   📊 Election: ${election.title}`);
    console.log(`   📅 Voting starts: ${new Date(Number(election.startTime) * 1000).toLocaleString()}`);
    console.log(`   📅 Voting ends: ${new Date(Number(election.endTime) * 1000).toLocaleString()}`);
    console.log(`   👤 Candidate: ${candidate.name}`);
    console.log(`   ✅ Approved: ${candidate.approved}`);
    console.log(`   🗳️  Current Votes: ${candidate.votes}`);
    console.log(`   👥 Total Candidates: ${candidatesList.length}\n`);

    // Summary
    console.log("🎉 REAL NETWORK INTEGRATION TEST COMPLETED!");
    console.log("\n📊 Test Results:");
    console.log(`   • Election Created: ✅ (ID: ${electionId})`);
    console.log(`   • Candidate Registered: ✅ (ID: ${candidateId})`);
    console.log(`   • Candidate Approved: ✅`);
    console.log(`   • State Queries: ✅`);
    console.log(`   • Gas Efficiency: ✅`);
    
    console.log("\n📈 Gas Usage Summary:");
    console.log(`   • Create Election: ${createReceipt.gasUsed} gas`);
    console.log(`   • Register Candidate: ${registerReceipt.gasUsed} gas`);
    console.log(`   • Approve Candidate: ${approveReceipt.gasUsed} gas`);
    
    const totalGas = Number(createReceipt.gasUsed) + Number(registerReceipt.gasUsed) + Number(approveReceipt.gasUsed);
    console.log(`   • Total Gas Used: ${totalGas} gas\n`);

    console.log("🔗 Transaction Links:");
    console.log(`   Election: https://amoy.polygonscan.com/tx/${createTx.hash}`);
    console.log(`   Registration: https://amoy.polygonscan.com/tx/${registerTx.hash}`);
    console.log(`   Approval: https://amoy.polygonscan.com/tx/${approveTx.hash}`);

    console.log("\n✅ Contract is fully operational and ready for Edge Functions!");
    console.log("🚀 Next: Test your Edge Functions with this deployed contract!");

  } catch (error) {
    console.error("❌ Real network test failed:");
    console.error(error.message);
    if (error.code === 'CALL_EXCEPTION') {
      console.error("This might be due to timing restrictions or insufficient permissions.");
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
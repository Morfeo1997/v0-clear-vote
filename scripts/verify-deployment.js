const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🔍 Verifying VotingContract deployment...\n");

  // Check if deployment info exists
  if (!fs.existsSync('./deployment-info.json')) {
    console.log("❌ deployment-info.json not found");
    console.log("Please deploy the contract first using: npm run deploy:amoy");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync('./deployment-info.json', 'utf8'));
  console.log("📄 Deployment Info:");
  console.log(`   Contract Address: ${deploymentInfo.contractAddress}`);
  console.log(`   Network: ${deploymentInfo.network}`);
  console.log(`   Block: ${deploymentInfo.deploymentBlock}`);
  console.log(`   Timestamp: ${deploymentInfo.timestamp}\n`);

  // Connect to the deployed contract
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = VotingContract.attach(deploymentInfo.contractAddress);

  console.log("⚡ Testing contract functions...\n");

  try {
    // Test owner
    const owner = await votingContract.owner();
    console.log(`✅ Owner: ${owner}`);

    // Test total elections (should be 0 initially)
    const totalElections = await votingContract.getTotalElections();
    console.log(`✅ Total Elections: ${totalElections}`);

    // Test total candidates (should be 0 initially)
    const totalCandidates = await votingContract.getTotalCandidates();
    console.log(`✅ Total Candidates: ${totalCandidates}`);

    console.log("\n🎉 Contract verification successful!");
    console.log("✅ All basic functions are working correctly");

  } catch (error) {
    console.log("❌ Contract verification failed:");
    console.error(error.message);
    process.exit(1);
  }

  // Network information
  console.log("\n🌐 Network Information:");
  console.log(`   Chain ID: ${hre.network.config.chainId}`);
  console.log(`   Network Name: ${hre.network.name}`);
  console.log(`   RPC URL: ${hre.network.config.url}`);

  // Explorer links
  if (hre.network.name === 'amoy') {
    console.log("\n🔗 Explorer Links:");
    console.log(`   Contract: https://amoy.polygonscan.com/address/${deploymentInfo.contractAddress}`);
    console.log(`   Deployment TX: https://amoy.polygonscan.com/tx/${deploymentInfo.deploymentHash}`);
  }

  console.log("\n📝 Next Steps:");
  console.log("1. Update your .env file with the CONTRACT_ADDRESS");
  console.log("2. Update Supabase Edge Function environment variables");
  console.log("3. Test the Edge Functions with the new contract address");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
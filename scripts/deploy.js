const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("Deploying VotingContract...");

  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy();

  await votingContract.deployed();

  console.log("VotingContract deployed to:", votingContract.address);

  // Save deployment information
  const deploymentInfo = {
    contractAddress: votingContract.address,
    network: hre.network.name,
    deploymentBlock: votingContract.deployTransaction.blockNumber,
    deploymentHash: votingContract.deployTransaction.hash,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    './deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to deployment-info.json");

  // Wait for a few block confirmations
  if (hre.network.name !== "hardhat") {
    console.log("Waiting for block confirmations...");
    await votingContract.deployTransaction.wait(6);
    console.log("Contract deployment confirmed!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

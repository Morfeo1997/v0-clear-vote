# 📋 Smart Contracts

This directory contains the smart contract implementation for the Clear Vote blockchain elections system.

## 📁 Files

### **VotingContract.sol**
The main smart contract implementing the complete election system on the blockchain.

**Key Features:**
- Election creation and management
- Candidate registration and approval
- Anonymous voting with cryptographic hashes
- Double-vote prevention mechanisms
- Real-time vote counting
- Complete audit trail through events

### **abi.json**
Application Binary Interface (ABI) for the VotingContract, required for frontend integration.

**Usage:**
\`\`\`javascript
import contractABI from './contracts/abi.json';
// Use with viem, ethers.js, or web3.js
\`\`\`

### **CONTRACT_DOCS.md**
Complete technical documentation for the VotingContract including:
- Function specifications
- Event definitions
- Security features
- Gas optimization details
- Integration guidelines

## 🚀 Deployment Information

**Current Deployment:**
- **Network**: Polygon Amoy Testnet
- **Address**: `0x88Cf938baf924Fb0DA22f4d56679f6d00fa44E48`
- **Explorer**: [View on PolygonScan](https://amoy.polygonscan.com/address/0x88Cf938baf924Fb0DA22f4d56679f6d00fa44E48)
- **Status**: ✅ Production Ready

## 🧪 Testing

All smart contract functions have been thoroughly tested:
- ✅ 7/7 unit tests passing
- ✅ Integration tests completed
- ✅ Security validations passed
- ✅ Gas optimization verified

## 📖 Documentation

For detailed technical information, see [CONTRACT_DOCS.md](./CONTRACT_DOCS.md).

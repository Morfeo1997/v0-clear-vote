// supabase/functions/_shared/blockchain.ts
import { 
    createPublicClient, 
    createWalletClient, 
    http, 
    parseAbiItem,
    decodeEventLog,
    type Address,
    type Hash
} from "npm:viem@2.x";
import { privateKeyToAccount } from "npm:viem@2.x/accounts";

// Environment variables
const ALCHEMY_RPC_URL = Deno.env.get("ALCHEMY_RPC_URL")!;
const CHAIN_ID = Number(Deno.env.get("CHAIN_ID") || "137");
const CONTRACT_ADDRESS = Deno.env.get("CONTRACT_ADDRESS")! as Address;
const PRIVATE_KEY_OWNER = Deno.env.get("PRIVATE_KEY_OWNER")!;

// Load contract ABI
let CONTRACT_ABI: any[];
try {
    const abiPath = new URL("../../contracts/abi.json", import.meta.url);
    const abiResponse = await fetch(abiPath);
    CONTRACT_ABI = await abiResponse.json();
} catch (error) {
    console.error("Failed to load contract ABI:", error);
    throw new Error("Contract ABI not found or invalid");
}

// Chain configuration
function getChainConfig() {
    const baseConfig = {
        id: CHAIN_ID,
        name: getChainName(),
        rpcUrls: {
            default: { http: [ALCHEMY_RPC_URL] },
            public: { http: [ALCHEMY_RPC_URL] }
        },
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC", 
            decimals: 18
        }
    };
    
    return baseConfig;
}

function getChainName(): string {
    switch (CHAIN_ID) {
        case 137: return "Polygon Mainnet";
        case 80002: return "Polygon Amoy";
        case 84532: return "Base Sepolia";
        default: return "Custom Chain";
    }
}

// Clients
export const publicClient = createPublicClient({
    chain: getChainConfig(),
    transport: http(ALCHEMY_RPC_URL)
});

const ownerAccount = privateKeyToAccount(`0x${PRIVATE_KEY_OWNER}` as `0x${string}`);

export const walletClient = createWalletClient({
    account: ownerAccount,
    chain: getChainConfig(),
    transport: http(ALCHEMY_RPC_URL)
});

// Contract configuration
export const contract = {
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI
} as const;

// Event signatures
export const EVENT_SIGNATURES = {
    VoteCast: parseAbiItem("event VoteCast(uint256 indexed electionId, uint256 indexed candidateId, address voter, string voteHash, uint256 totalVotesForCandidate)"),
    ElectionCreated: parseAbiItem("event ElectionCreated(uint256 indexed electionId, string title, uint256 startTime, uint256 endTime)"),
    CandidateApproved: parseAbiItem("event CandidateApproved(uint256 indexed electionId, uint256 indexed candidateId, string candidateName)")
};

// Helper functions
export async function getLatestBlock(): Promise<bigint> {
    const block = await publicClient.getBlock({ blockTag: 'latest' });
    return block.number;
}

export async function getLogs(fromBlock: bigint, toBlock: bigint, eventSignature: any) {
    return await publicClient.getLogs({
        address: CONTRACT_ADDRESS,
        event: eventSignature,
        fromBlock,
        toBlock
    });
}

export function decodeVoteCastEvent(log: any) {
    try {
        const decoded = decodeEventLog({
            abi: [EVENT_SIGNATURES.VoteCast],
            data: log.data,
            topics: log.topics
        });
        return decoded.args;
    } catch (error) {
        console.error("Failed to decode VoteCast event:", error);
        return null;
    }
}

export async function createElectionOnChain(
    title: string,
    startTime: bigint,
    candidacyEnd: bigint,
    endTime: bigint
): Promise<{ txHash: Hash; onchainId?: bigint }> {
    
    const txHash = await walletClient.writeContract({
        ...contract,
        functionName: 'createElection',
        args: [title, startTime, candidacyEnd, endTime]
    });

    const receipt = await publicClient.waitForTransactionReceipt({ 
        hash: txHash,
        timeout: 60_000 
    });

    // Extract election ID from logs
    let onchainId: bigint | undefined;
    try {
        for (const log of receipt.logs) {
            if (log.topics[0] && log.topics[1]) {
                onchainId = BigInt(log.topics[1]);
                break;
            }
        }
    } catch (e) {
        console.warn('Could not extract election ID from logs:', e);
    }

    return { txHash, onchainId };
}

export async function approveCandidateOnChain(
    electionId: bigint,
    candidateId: bigint,
    candidateName: string
): Promise<Hash> {
    
    return await walletClient.writeContract({
        ...contract,
        functionName: 'approveCandidate',
        args: [electionId, candidateId, candidateName]
    });
}

export async function voteOnChain(
    electionId: bigint,
    candidateId: bigint,
    voteHash: string,
    voterAddress: Address
): Promise<Hash> {
    
    return await walletClient.writeContract({
        ...contract,
        functionName: 'vote',
        args: [electionId, candidateId, voteHash]
    });
}

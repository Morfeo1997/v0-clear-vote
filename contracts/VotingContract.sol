// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VotingContract is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    struct Election {
        uint256 id;
        string title;
        uint256 startTime;
        uint256 candidacyEnd;
        uint256 endTime;
        address creator;
        bool exists;
    }
    
    struct Candidate {
        uint256 id;
        uint256 electionId;
        string name;
        uint256 votes;
        bool approved;
        bool exists;
    }
    
    Counters.Counter private _electionIdCounter;
    Counters.Counter private _candidateIdCounter;
    
    mapping(uint256 => Election) public elections;
    mapping(uint256 => Candidate) public candidates;
    mapping(uint256 => uint256[]) public electionCandidates; // electionId => candidateIds[]
    mapping(string => bool) public usedVoteHashes;
    mapping(address => mapping(uint256 => bool)) public hasVoted; // voter => electionId => hasVoted
    
    event ElectionCreated(
        uint256 indexed electionId,
        string title,
        uint256 startTime,
        uint256 endTime
    );
    
    event CandidateApproved(
        uint256 indexed electionId,
        uint256 indexed candidateId,
        string candidateName
    );
    
    event VoteCast(
        uint256 indexed electionId,
        uint256 indexed candidateId,
        address voter,
        string voteHash,
        uint256 totalVotesForCandidate
    );
    
    modifier onlyElectionCreator(uint256 electionId) {
        require(elections[electionId].exists, "Election does not exist");
        require(elections[electionId].creator == msg.sender, "Only election creator can perform this action");
        _;
    }
    
    modifier electionExists(uint256 electionId) {
        require(elections[electionId].exists, "Election does not exist");
        _;
    }
    
    modifier candidateExists(uint256 candidateId) {
        require(candidates[candidateId].exists, "Candidate does not exist");
        _;
    }
    
    modifier votingPeriod(uint256 electionId) {
        Election memory election = elections[electionId];
        require(block.timestamp >= election.startTime, "Voting has not started yet");
        require(block.timestamp <= election.endTime, "Voting has ended");
        _;
    }
    
    constructor() {}
    
    function createElection(
        string memory title,
        uint256 startTime,
        uint256 candidacyEnd,
        uint256 endTime
    ) external returns (uint256) {
        require(startTime > block.timestamp, "Start time must be in the future");
        require(candidacyEnd > block.timestamp && candidacyEnd < startTime, "Invalid candidacy end time");
        require(endTime > startTime, "End time must be after start time");
        require(bytes(title).length > 0, "Title cannot be empty");
        
        _electionIdCounter.increment();
        uint256 electionId = _electionIdCounter.current();
        
        elections[electionId] = Election({
            id: electionId,
            title: title,
            startTime: startTime,
            candidacyEnd: candidacyEnd,
            endTime: endTime,
            creator: msg.sender,
            exists: true
        });
        
        emit ElectionCreated(electionId, title, startTime, endTime);
        
        return electionId;
    }
    
    function approveCandidate(
        uint256 electionId,
        uint256 candidateId,
        string memory candidateName
    ) external onlyElectionCreator(electionId) candidateExists(candidateId) {
        require(candidates[candidateId].electionId == electionId, "Candidate does not belong to this election");
        require(!candidates[candidateId].approved, "Candidate already approved");
        require(block.timestamp <= elections[electionId].candidacyEnd, "Candidacy period has ended");
        
        candidates[candidateId].approved = true;
        candidates[candidateId].name = candidateName;
        
        electionCandidates[electionId].push(candidateId);
        
        emit CandidateApproved(electionId, candidateId, candidateName);
    }
    
    function vote(
        uint256 electionId,
        uint256 candidateId,
        string memory voteHash
    ) external 
        nonReentrant
        electionExists(electionId)
        candidateExists(candidateId)
        votingPeriod(electionId)
    {
        require(candidates[candidateId].electionId == electionId, "Candidate does not belong to this election");
        require(candidates[candidateId].approved, "Candidate is not approved");
        require(!hasVoted[msg.sender][electionId], "Already voted in this election");
        require(!usedVoteHashes[voteHash], "Vote hash already used");
        require(bytes(voteHash).length > 0, "Vote hash cannot be empty");
        
        hasVoted[msg.sender][electionId] = true;
        usedVoteHashes[voteHash] = true;
        candidates[candidateId].votes++;
        
        emit VoteCast(
            electionId,
            candidateId,
            msg.sender,
            voteHash,
            candidates[candidateId].votes
        );
    }
    
    // View functions
    function getElection(uint256 electionId) external view returns (Election memory) {
        require(elections[electionId].exists, "Election does not exist");
        return elections[electionId];
    }
    
    function getCandidate(uint256 candidateId) external view returns (Candidate memory) {
        require(candidates[candidateId].exists, "Candidate does not exist");
        return candidates[candidateId];
    }
    
    function getElectionCandidates(uint256 electionId) external view returns (uint256[] memory) {
        require(elections[electionId].exists, "Election does not exist");
        return electionCandidates[electionId];
    }
    
    function getTotalElections() external view returns (uint256) {
        return _electionIdCounter.current();
    }
    
    function getTotalCandidates() external view returns (uint256) {
        return _candidateIdCounter.current();
    }
    
    function hasUserVoted(address voter, uint256 electionId) external view returns (bool) {
        return hasVoted[voter][electionId];
    }
    
    function isVoteHashUsed(string memory voteHash) external view returns (bool) {
        return usedVoteHashes[voteHash];
    }
    
    // Internal helper to register candidates (for off-chain candidate registration)
    function registerCandidate(uint256 electionId) external electionExists(electionId) returns (uint256) {
        require(block.timestamp <= elections[electionId].candidacyEnd, "Candidacy period has ended");
        
        _candidateIdCounter.increment();
        uint256 candidateId = _candidateIdCounter.current();
        
        candidates[candidateId] = Candidate({
            id: candidateId,
            electionId: electionId,
            name: "",
            votes: 0,
            approved: false,
            exists: true
        });
        
        return candidateId;
    }
}
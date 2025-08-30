// supabase/functions/_shared/types.ts
export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    dni: string;
    institution?: string;
    phone?: string;
    is_active: boolean;
}

export interface Election {
    id: string;
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
    candidacy_start: string;
    candidacy_end: string;
    status: 'draft' | 'active' | 'ended' | 'cancelled';
    max_candidates_per_party: number;
    onchain_election_id?: number;
    last_block_processed?: number;
    contract_address?: string;
    created_at: string;
}

export interface Party {
    id: string;
    name: string;
    description?: string;
    logo_url?: string;
}

export interface Candidate {
    id: string;
    user_id: string;
    election_id: string;
    party_id?: string;
    description?: string;
    proposals?: string;
    photo_url?: string;
    is_approved: boolean;
    onchain_candidate_id?: number;
    created_at: string;
}

export interface Vote {
    id: string;
    election_id: string;
    candidate_id: string;
    vote_hash: string;
    created_at: string;
}

export interface Voter {
    id: string;
    user_id: string;
    election_id: string;
    has_voted: boolean;
    vote_hash?: string;
    voted_at?: string;
}

export interface ElectionResult {
    id: string;
    election_id: string;
    candidate_id: string;
    total_votes: number;
    percentage: number;
}

export interface VoteEvent {
    electionId: bigint;
    candidateId: bigint;
    voter: string;
    totalVotes: bigint;
    voteHash: string;
}

export interface CreateElectionRequest {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    candidacyStart: string;
    candidacyEnd: string;
    maxCandidatesPerParty?: number;
}

export interface RequestCandidacyRequest {
    electionId: string;
    partyId?: string;
    description?: string;
    proposals?: string;
    photoUrl?: string;
}

export interface ApproveCandidacyRequest {
    candidateId: string;
    approved: boolean;
}

export interface VoteRequest {
    electionId: string;
    candidateId: string;
}

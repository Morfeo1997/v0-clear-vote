// supabase/functions/vote/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { authenticate, generateVoteHash } from "../_shared/auth.ts";
import { voteOnChain } from "../_shared/blockchain.ts";
import type { VoteRequest } from "../_shared/types.ts";

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { user, supabase } = await authenticate(req);
        const body: VoteRequest = await req.json();
        
        const { electionId, candidateId } = body;

        // Get election details
        const { data: election, error: electionError } = await supabase
            .from('elections')
            .select('*')
            .eq('id', electionId)
            .single();

        if (electionError || !election) {
            throw new Error('Election not found');
        }

        // Check if voting period is active
        const now = new Date();
        const startDate = new Date(election.start_date);
        const endDate = new Date(election.end_date);

        if (now < startDate) {
            throw new Error('Voting has not started yet');
        }
        if (now > endDate) {
            throw new Error('Voting has ended');
        }

        // Get candidate details
        const { data: candidate, error: candidateError } = await supabase
            .from('candidates')
            .select(`
                *,
                users!inner(first_name, last_name),
                parties(name)
            `)
            .eq('id', candidateId)
            .eq('election_id', electionId)
            .eq('is_approved', true)
            .single();

        if (candidateError || !candidate) {
            throw new Error('Candidate not found or not approved');
        }

        // Check if user is registered as voter for this election
        const { data: voter, error: voterError } = await supabase
            .from('voters')
            .select('*')
            .eq('user_id', user.id)
            .eq('election_id', electionId)
            .single();

        if (voterError || !voter) {
            throw new Error('User is not registered as a voter for this election');
        }

        // Check if user has already voted
        if (voter.has_voted) {
            throw new Error('User has already voted in this election');
        }

        // Generate anonymous vote hash
        const voteHash = generateVoteHash(user.id, electionId, candidateId);

        let txHash: string | null = null;

        // If election is on-chain, cast vote on blockchain
        if (election.onchain_election_id && candidate.onchain_candidate_id) {
            try {
                // For demo purposes, we use a dummy address
                // In production, this would be the user's wallet address
                const dummyVoterAddress = "0x" + user.id.replace(/-/g, '').substring(0, 40);
                
                txHash = await voteOnChain(
                    BigInt(election.onchain_election_id),
                    BigInt(candidate.onchain_candidate_id),
                    voteHash,
                    dummyVoterAddress as `0x${string}`
                );

                console.log(`Vote cast on-chain: ${txHash}`);
            } catch (blockchainError) {
                console.error('Blockchain voting error:', blockchainError);
                throw new Error('Failed to cast vote on blockchain');
            }
        }

        // Start database transaction
        const { error: transactionError } = await supabase.rpc('vote_transaction', {
            p_user_id: user.id,
            p_election_id: electionId,
            p_candidate_id: candidateId,
            p_vote_hash: voteHash
        });

        if (transactionError) {
            // If we have a custom stored procedure, use it. Otherwise, do manual transaction:
            
            // Record the vote
            const { error: voteError } = await supabase
                .from('votes')
                .insert({
                    election_id: electionId,
                    candidate_id: candidateId,
                    vote_hash: voteHash
                });

            if (voteError) {
                throw new Error(`Failed to record vote: ${voteError.message}`);
            }

            // Update voter status
            const { error: voterUpdateError } = await supabase
                .from('voters')
                .update({
                    has_voted: true,
                    vote_hash: voteHash,
                    voted_at: new Date().toISOString()
                })
                .eq('user_id', user.id)
                .eq('election_id', electionId);

            if (voterUpdateError) {
                throw new Error(`Failed to update voter status: ${voterUpdateError.message}`);
            }
        }

        // Get updated vote count for candidate
        const { count: totalVotes } = await supabase
            .from('votes')
            .select('id', { count: 'exact' })
            .eq('election_id', electionId)
            .eq('candidate_id', candidateId);

        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    voteHash,
                    candidate: {
                        id: candidate.id,
                        name: `${candidate.users.first_name} ${candidate.users.last_name}`,
                        party: candidate.parties?.name || 'Independent'
                    },
                    totalVotes: totalVotes || 0,
                    transactionHash: txHash
                },
                message: 'Vote cast successfully'
            }),
            { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        );

    } catch (error) {
        console.error('Error in vote:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message
            }),
            { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            }
        );
    }
});
// supabase/functions/approveCandidacy/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { authenticate, requireElectionOwner } from "../_shared/auth.ts";
import { approveCandidateOnChain } from "../_shared/blockchain.ts";
import type { ApproveCandidacyRequest } from "../_shared/types.ts";

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { user, supabase } = await authenticate(req);
        const body: ApproveCandidacyRequest = await req.json();
        
        const { candidateId, approved } = body;

        // Get candidate details with election info
        const { data: candidate, error: candidateError } = await supabase
            .from('candidates')
            .select(`
                *,
                elections!inner(*),
                users!inner(first_name, last_name, email)
            `)
            .eq('id', candidateId)
            .single();

        if (candidateError || !candidate) {
            throw new Error('Candidate not found');
        }

        // Check if user is election owner
        const isOwner = await requireElectionOwner(supabase, user.id, candidate.election_id);
        if (!isOwner) {
            throw new Error('Only election owners can approve candidates');
        }

        // Check if candidacy period has ended
        const now = new Date();
        const candidacyEnd = new Date(candidate.elections.candidacy_end);

        if (now > candidacyEnd) {
            throw new Error('Candidacy period has ended');
        }

        // Check if already processed
        if (candidate.is_approved === approved) {
            return new Response(
                JSON.stringify({
                    success: true,
                    message: `Candidate already ${approved ? 'approved' : 'rejected'}`,
                    data: candidate
                }),
                { 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200
                }
            );
        }

        let txHash: string | null = null;
        let onchainCandidateId: bigint | null = null;

        // If approving and election is on-chain, register candidate on blockchain
        if (approved && candidate.elections.onchain_election_id) {
            try {
                const candidateName = `${candidate.users.first_name} ${candidate.users.last_name}`;
                
                // Generate sequential candidate ID (simple counter)
                const { count } = await supabase
                    .from('candidates')
                    .select('id', { count: 'exact' })
                    .eq('election_id', candidate.election_id)
                    .eq('is_approved', true);

                onchainCandidateId = BigInt((count || 0) + 1);

                txHash = await approveCandidateOnChain(
                    BigInt(candidate.elections.onchain_election_id),
                    onchainCandidateId,
                    candidateName
                );

                console.log(`Candidate approved on-chain: ${txHash}`);
            } catch (blockchainError) {
                console.error('Blockchain error:', blockchainError);
                // Continue with database update even if blockchain fails
                // This allows for manual blockchain sync later
            }
        }

        // Update candidate in database
        const { data: updatedCandidate, error: updateError } = await supabase
            .from('candidates')
            .update({
                is_approved: approved,
                onchain_candidate_id: onchainCandidateId ? Number(onchainCandidateId) : null
            })
            .eq('id', candidateId)
            .select(`
                *,
                users!inner(first_name, last_name, email),
                parties(name, logo_url)
            `)
            .single();

        if (updateError) {
            throw new Error(`Failed to update candidate: ${updateError.message}`);
        }

        return new Response(
            JSON.stringify({
                success: true,
                data: updatedCandidate,
                transactionHash: txHash,
                onchainCandidateId: onchainCandidateId,
                message: `Candidate ${approved ? 'approved' : 'rejected'} successfully`
            }),
            { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        );

    } catch (error) {
        console.error('Error in approveCandidacy:', error);
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

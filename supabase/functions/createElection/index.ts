// supabase/functions/createElection/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { authenticate } from "../_shared/auth.ts";
import { createElectionOnChain } from "../_shared/blockchain.ts";
import type { CreateElectionRequest } from "../_shared/types.ts";

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { user, supabase } = await authenticate(req);
        const body: CreateElectionRequest = await req.json();
        
        const { 
            title, 
            description, 
            startDate, 
            endDate, 
            candidacyStart, 
            candidacyEnd,
            maxCandidatesPerParty = 1 
        } = body;

        // Validate dates
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        const candidacyStartDate = new Date(candidacyStart);
        const candidacyEndDate = new Date(candidacyEnd);

        if (candidacyStartDate < now) {
            throw new Error('Candidacy start must be in the future');
        }
        if (candidacyEndDate < candidacyStartDate) {
            throw new Error('Candidacy end must be after candidacy start');
        }
        if (start < candidacyEndDate) {
            throw new Error('Election start must be after candidacy period ends');
        }
        if (end <= start) {
            throw new Error('Election end must be after start');
        }

        console.log('Creating election on-chain...');
        
        // Create on blockchain
        const { txHash, onchainId } = await createElectionOnChain(
            title,
            BigInt(Math.floor(start.getTime() / 1000)),
            BigInt(Math.floor(candidacyEndDate.getTime() / 1000)),
            BigInt(Math.floor(end.getTime() / 1000))
        );

        console.log(`Transaction confirmed: ${txHash}, Election ID: ${onchainId}`);

        // Save to database
        const { data: election, error: electionError } = await supabase
            .from('elections')
            .insert({
                title,
                description,
                start_date: startDate,
                end_date: endDate,
                candidacy_start: candidacyStart,
                candidacy_end: candidacyEnd,
                max_candidates_per_party: maxCandidatesPerParty,
                onchain_election_id: onchainId ? Number(onchainId) : null,
                status: 'draft'
            })
            .select()
            .single();

        if (electionError) {
            throw new Error(`Database error: ${electionError.message}`);
        }

        // Add user as election owner
        await supabase
            .from('election_owners')
            .insert({
                user_id: user.id,
                election_id: election.id,
                role: 'owner'
            });

        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    election,
                    transactionHash: txHash,
                    onchainElectionId: onchainId
                }
            }),
            { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        );

    } catch (error) {
        console.error('Error in createElection:', error);
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
// supabase/functions/requestCandidacy/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { authenticate } from "../_shared/auth.ts";
import type { RequestCandidacyRequest } from "../_shared/types.ts";

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { user, supabase } = await authenticate(req);
        const body: RequestCandidacyRequest = await req.json();
        
        const { electionId, partyId, description, proposals, photoUrl } = body;

        // Get election details
        const { data: election, error: electionError } = await supabase
            .from('elections')
            .select('*')
            .eq('id', electionId)
            .single();

        if (electionError || !election) {
            throw new Error('Election not found');
        }

        // Check if candidacy period is active
        const now = new Date();
        const candidacyStart = new Date(election.candidacy_start);
        const candidacyEnd = new Date(election.candidacy_end);

        if (now < candidacyStart) {
            throw new Error('Candidacy period has not started yet');
        }
        if (now > candidacyEnd) {
            throw new Error('Candidacy period has ended');
        }

        // Check if user already has a candidacy for this election
        const { data: existingCandidacy } = await supabase
            .from('candidates')
            .select('id')
            .eq('user_id', user.id)
            .eq('election_id', electionId)
            .single();

        if (existingCandidacy) {
            throw new Error('User already has a candidacy for this election');
        }

        // If party is specified, check candidate limit per party
        if (partyId) {
            const { count } = await supabase
                .from('candidates')
                .select('id', { count: 'exact' })
                .eq('election_id', electionId)
                .eq('party_id', partyId);

            if (count && count >= election.max_candidates_per_party) {
                throw new Error('Party has reached maximum candidates limit');
            }
        }

        // Create candidacy request
        const { data: candidate, error: candidateError } = await supabase
            .from('candidates')
            .insert({
                user_id: user.id,
                election_id: electionId,
                party_id: partyId || null,
                description,
                proposals,
                photo_url: photoUrl,
                is_approved: false
            })
            .select(`
                *,
                users!inner(first_name, last_name, email),
                parties(name, logo_url)
            `)
            .single();

        if (candidateError) {
            throw new Error(`Failed to create candidacy: ${candidateError.message}`);
        }

        return new Response(
            JSON.stringify({
                success: true,
                data: candidate,
                message: 'Candidacy request submitted successfully. Waiting for approval.'
            }),
            { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 201
            }
        );

    } catch (error) {
        console.error('Error in requestCandidacy:', error);
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

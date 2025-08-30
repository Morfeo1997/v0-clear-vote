// supabase/functions/getElectionResults/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { authenticate } from "../_shared/auth.ts";

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { user, supabase } = await authenticate(req);
        const url = new URL(req.url);
        const electionId = url.searchParams.get('electionId');

        if (!electionId) {
            throw new Error('Election ID is required');
        }

        // Get election details
        const { data: election, error: electionError } = await supabase
            .from('elections')
            .select('*')
            .eq('id', electionId)
            .single();

        if (electionError || !election) {
            throw new Error('Election not found');
        }

        // Get all approved candidates for this election
        const { data: candidates, error: candidatesError } = await supabase
            .from('candidates')
            .select(`
                id,
                description,
                proposals,
                photo_url,
                users!inner(first_name, last_name, email),
                parties(name, logo_url)
            `)
            .eq('election_id', electionId)
            .eq('is_approved', true);

        if (candidatesError) {
            throw new Error(`Failed to fetch candidates: ${candidatesError.message}`);
        }

        // Get vote counts for each candidate
        const results = await Promise.all(
            (candidates || []).map(async (candidate) => {
                const { count } = await supabase
                    .from('votes')
                    .select('id', { count: 'exact' })
                    .eq('election_id', electionId)
                    .eq('candidate_id', candidate.id);

                return {
                    candidate: {
                        id: candidate.id,
                        name: `${candidate.users.first_name} ${candidate.users.last_name}`,
                        email: candidate.users.email,
                        party: candidate.parties?.name || 'Independent',
                        partyLogo: candidate.parties?.logo_url || null,
                        description: candidate.description,
                        proposals: candidate.proposals,
                        photo: candidate.photo_url
                    },
                    votes: count || 0
                };
            })
        );

        // Calculate total votes and percentages
        const totalVotes = results.reduce((sum, result) => sum + result.votes, 0);
        const resultsWithPercentages = results.map(result => ({
            ...result,
            percentage: totalVotes > 0 ? Number(((result.votes / totalVotes) * 100).toFixed(2)) : 0
        }));

        // Sort by votes (descending)
        resultsWithPercentages.sort((a, b) => b.votes - a.votes);

        // Get total registered voters
        const { count: totalVoters } = await supabase
            .from('voters')
            .select('id', { count: 'exact' })
            .eq('election_id', electionId);

        // Get total votes cast
        const { count: totalVotesCast } = await supabase
            .from('voters')
            .select('id', { count: 'exact' })
            .eq('election_id', electionId)
            .eq('has_voted', true);

        // Calculate participation rate
        const participationRate = totalVoters && totalVoters > 0 
            ? Number(((totalVotesCast || 0) / totalVoters * 100).toFixed(2))
            : 0;

        // Determine election status
        const now = new Date();
        const startDate = new Date(election.start_date);
        const endDate = new Date(election.end_date);
        
        let status = election.status;
        if (now < startDate) {
            status = 'upcoming';
        } else if (now >= startDate && now <= endDate) {
            status = 'ongoing';
        } else if (now > endDate) {
            status = 'finished';
        }

        const winner = resultsWithPercentages.length > 0 && totalVotes > 0 
            ? resultsWithPercentages[0].candidate
            : null;

        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    election: {
                        id: election.id,
                        title: election.title,
                        description: election.description,
                        startDate: election.start_date,
                        endDate: election.end_date,
                        status,
                        onchainId: election.onchain_election_id
                    },
                    statistics: {
                        totalVoters: totalVoters || 0,
                        totalVotesCast: totalVotesCast || 0,
                        participationRate,
                        totalCandidates: candidates?.length || 0
                    },
                    results: resultsWithPercentages,
                    winner: winner,
                    lastUpdated: new Date().toISOString()
                }
            }),
            { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        );

    } catch (error) {
        console.error('Error in getElectionResults:', error);
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
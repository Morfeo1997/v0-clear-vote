// supabase/functions/pollOnchainEvents/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { authenticate } from "../_shared/auth.ts";
import { 
    getLatestBlock, 
    getLogs, 
    EVENT_SIGNATURES, 
    decodeVoteCastEvent 
} from "../_shared/blockchain.ts";

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { user, supabase } = await authenticate(req);
        const url = new URL(req.url);
        const electionId = url.searchParams.get('electionId');
        const forceSync = url.searchParams.get('forceSync') === 'true';

        // Get elections to process (specific one or all active ones)
        let electionsQuery = supabase
            .from('elections')
            .select('*')
            .not('onchain_election_id', 'is', null);

        if (electionId) {
            electionsQuery = electionsQuery.eq('id', electionId);
        } else {
            electionsQuery = electionsQuery.in('status', ['active', 'draft']);
        }

        const { data: elections, error: electionsError } = await electionsQuery;

        if (electionsError) {
            throw new Error(`Failed to fetch elections: ${electionsError.message}`);
        }

        if (!elections || elections.length === 0) {
            return new Response(
                JSON.stringify({
                    success: true,
                    message: 'No on-chain elections found to sync',
                    data: { processedElections: 0, eventsProcessed: 0 }
                }),
                { 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200
                }
            );
        }

        const latestBlock = await getLatestBlock();
        let totalEventsProcessed = 0;

        for (const election of elections) {
            try {
                console.log(`Processing election: ${election.id} (onchain: ${election.onchain_election_id})`);

                const fromBlock = forceSync ? 0n : BigInt(election.last_block_processed || 0);
                const toBlock = latestBlock;

                if (fromBlock >= toBlock) {
                    console.log(`Election ${election.id} is up to date (block ${fromBlock})`);
                    continue;
                }

                console.log(`Fetching logs from block ${fromBlock} to ${toBlock}`);

                // Get VoteCast events
                const voteLogs = await getLogs(fromBlock, toBlock, EVENT_SIGNATURES.VoteCast);

                for (const log of voteLogs) {
                    const voteEvent = decodeVoteCastEvent(log);
                    if (!voteEvent) continue;

                    // Only process events for this election
                    if (Number(voteEvent.electionId) !== election.onchain_election_id) {
                        continue;
                    }

                    console.log(`Processing vote event: election ${voteEvent.electionId}, candidate ${voteEvent.candidateId}`);

                    // Find the candidate in our database
                    const { data: candidate } = await supabase
                        .from('candidates')
                        .select('id')
                        .eq('election_id', election.id)
                        .eq('onchain_candidate_id', Number(voteEvent.candidateId))
                        .single();

                    if (!candidate) {
                        console.warn(`Candidate with onchain ID ${voteEvent.candidateId} not found for election ${election.id}`);
                        continue;
                    }

                    // Check if this vote hash already exists (to avoid duplicates)
                    const { data: existingVote } = await supabase
                        .from('votes')
                        .select('id')
                        .eq('vote_hash', voteEvent.voteHash)
                        .single();

                    if (existingVote) {
                        console.log(`Vote with hash ${voteEvent.voteHash} already exists, skipping`);
                        continue;
                    }

                    // Record the vote
                    const { error: voteError } = await supabase
                        .from('votes')
                        .insert({
                            election_id: election.id,
                            candidate_id: candidate.id,
                            vote_hash: voteEvent.voteHash
                        });

                    if (voteError) {
                        console.error(`Failed to record vote: ${voteError.message}`);
                        continue;
                    }

                    // Try to update voter status if we can identify the voter by hash
                    // This is a best-effort attempt since vote hashes are anonymous
                    const { error: voterUpdateError } = await supabase
                        .from('voters')
                        .update({ 
                            has_voted: true, 
                            vote_hash: voteEvent.voteHash,
                            voted_at: new Date().toISOString()
                        })
                        .eq('election_id', election.id)
                        .eq('vote_hash', voteEvent.voteHash);

                    // Don't log voter update errors as they're expected (anonymous voting)

                    totalEventsProcessed++;
                }

                // Update last processed block for this election
                await supabase
                    .from('elections')
                    .update({ last_block_processed: Number(toBlock) })
                    .eq('id', election.id);

                console.log(`Election ${election.id} synced up to block ${toBlock}`);

            } catch (electionError) {
                console.error(`Error processing election ${election.id}:`, electionError);
                // Continue with other elections
            }
        }

        // Get updated statistics
        const stats = await Promise.all(
            elections.map(async (election) => {
                const { count: totalVotes } = await supabase
                    .from('votes')
                    .select('id', { count: 'exact' })
                    .eq('election_id', election.id);

                const { count: totalVoters } = await supabase
                    .from('voters')
                    .select('id', { count: 'exact' })
                    .eq('election_id', election.id);

                return {
                    electionId: election.id,
                    electionTitle: election.title,
                    onchainId: election.onchain_election_id,
                    totalVotes: totalVotes || 0,
                    totalVoters: totalVoters || 0,
                    lastBlockProcessed: Number(latestBlock)
                };
            })
        );

        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    processedElections: elections.length,
                    eventsProcessed: totalEventsProcessed,
                    latestBlock: Number(latestBlock),
                    statistics: stats
                },
                message: `Synchronized ${totalEventsProcessed} events across ${elections.length} elections`
            }),
            { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        );

    } catch (error) {
        console.error('Error in pollOnchainEvents:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message
            }),
            { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
            }
        );
    }
});
-- Add blockchain-related fields to existing tables

-- Add blockchain fields to elections table
ALTER TABLE public.elections 
ADD COLUMN IF NOT EXISTS onchain_election_id bigint,
ADD COLUMN IF NOT EXISTS last_block_processed bigint DEFAULT 0,
ADD COLUMN IF NOT EXISTS contract_address varchar(42);

-- Add blockchain fields to candidates table  
ALTER TABLE public.candidates
ADD COLUMN IF NOT EXISTS onchain_candidate_id bigint;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS elections_onchain_id_idx ON public.elections(onchain_election_id);
CREATE INDEX IF NOT EXISTS elections_status_idx ON public.elections(status);
CREATE INDEX IF NOT EXISTS candidates_election_approved_idx ON public.candidates(election_id, is_approved);
CREATE INDEX IF NOT EXISTS voters_election_voted_idx ON public.voters(election_id, has_voted);
CREATE INDEX IF NOT EXISTS votes_election_candidate_idx ON public.votes(election_id, candidate_id);

-- Create function to update election results cache
CREATE OR REPLACE FUNCTION update_election_results()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or insert election results
    INSERT INTO public.election_results (election_id, candidate_id, total_votes, percentage)
    SELECT 
        NEW.election_id,
        NEW.candidate_id,
        COUNT(*) as total_votes,
        (COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM public.votes WHERE election_id = NEW.election_id), 0)) as percentage
    FROM public.votes 
    WHERE election_id = NEW.election_id AND candidate_id = NEW.candidate_id
    ON CONFLICT (election_id, candidate_id) 
    DO UPDATE SET
        total_votes = EXCLUDED.total_votes,
        percentage = EXCLUDED.percentage;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update results
DROP TRIGGER IF EXISTS update_results_trigger ON public.votes;
CREATE TRIGGER update_results_trigger
    AFTER INSERT ON public.votes
    FOR EACH ROW
    EXECUTE FUNCTION update_election_results();

-- Add RLS policies for blockchain operations
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.election_results ENABLE ROW LEVEL SECURITY;

-- Elections policies
DROP POLICY IF EXISTS "Elections readable by all" ON public.elections;
CREATE POLICY "Elections readable by all"
    ON public.elections FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Elections writable by owners" ON public.elections;
CREATE POLICY "Elections writable by owners"
    ON public.elections FOR ALL
    USING (
        id IN (
            SELECT election_id FROM public.election_owners 
            WHERE user_id = auth.uid()
        )
    );

-- Candidates policies
DROP POLICY IF EXISTS "Candidates readable by all" ON public.candidates;
CREATE POLICY "Candidates readable by all"
    ON public.candidates FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Candidates writable by user or election owner" ON public.candidates;
CREATE POLICY "Candidates writable by user or election owner"
    ON public.candidates FOR ALL
    USING (
        user_id = auth.uid() OR
        election_id IN (
            SELECT election_id FROM public.election_owners 
            WHERE user_id = auth.uid()
        )
    );

-- Votes readable only for aggregation (no individual vote details)
DROP POLICY IF EXISTS "Votes readable for results only" ON public.votes;
CREATE POLICY "Votes readable for results only"
    ON public.votes FOR SELECT
    USING (false); -- Individual votes should not be readable

-- Voters policies
DROP POLICY IF EXISTS "Voters readable by self and election owners" ON public.voters;
CREATE POLICY "Voters readable by self and election owners"
    ON public.voters FOR SELECT
    USING (
        user_id = auth.uid() OR
        election_id IN (
            SELECT election_id FROM public.election_owners 
            WHERE user_id = auth.uid()
        )
    );

-- Election results readable by all
DROP POLICY IF EXISTS "Election results readable by all" ON public.election_results;
CREATE POLICY "Election results readable by all"
    ON public.election_results FOR SELECT
    USING (true);
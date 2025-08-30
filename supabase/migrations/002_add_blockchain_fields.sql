-- Add blockchain-related fields to existing tables

-- Add blockchain fields to elections table
ALTER TABLE public.elections 
ADD COLUMN IF NOT EXISTS onchain_election_id bigint,
ADD COLUMN IF NOT EXISTS last_block_processed bigint DEFAULT 0,
ADD COLUMN IF NOT EXISTS contract_address varchar(42);

-- Add blockchain fields to candidates table  
ALTER TABLE public.candidates
ADD COLUMN IF NOT EXISTS onchain_candidate_id bigint;

-- Add blockchain fields to voters table
ALTER TABLE public.voters
ADD COLUMN IF NOT EXISTS wallet_address varchar(42);

-- Add blockchain fields to votes table  
ALTER TABLE public.votes
ADD COLUMN IF NOT EXISTS blockchain_tx_hash varchar(66);

-- Add indexes for blockchain performance
CREATE INDEX IF NOT EXISTS elections_onchain_id_idx ON public.elections(onchain_election_id);
CREATE INDEX IF NOT EXISTS candidates_onchain_id_idx ON public.candidates(onchain_candidate_id);
CREATE INDEX IF NOT EXISTS voters_wallet_address_idx ON public.voters(wallet_address);
CREATE INDEX IF NOT EXISTS votes_blockchain_tx_idx ON public.votes(blockchain_tx_hash);

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

-- Enhanced RLS policies for blockchain operations

-- Elections: Writable by owners and admins  
CREATE POLICY "Elections writable by owners" ON public.elections
    FOR ALL
    USING (
        id IN (
            SELECT election_id FROM public.election_owners 
            WHERE user_id = auth.uid()
        )
    );

-- Candidates: Writable by user or election owner
CREATE POLICY "Candidates writable by user or election owner" ON public.candidates
    FOR ALL
    USING (
        user_id = auth.uid() OR
        election_id IN (
            SELECT election_id FROM public.election_owners 
            WHERE user_id = auth.uid()
        )
    );

-- Voters: Readable by self and election owners
CREATE POLICY "Voters readable by self and election owners" ON public.voters
    FOR SELECT
    USING (
        user_id = auth.uid() OR
        election_id IN (
            SELECT election_id FROM public.election_owners 
            WHERE user_id = auth.uid()
        )
    );

-- Voters: Writable by self and election owners
CREATE POLICY "Voters writable by self and election owners" ON public.voters
    FOR ALL
    USING (
        user_id = auth.uid() OR
        election_id IN (
            SELECT election_id FROM public.election_owners 
            WHERE user_id = auth.uid()
        )
    );

-- Votes: Not individually readable (privacy protection)
CREATE POLICY "Votes not individually readable" ON public.votes
    FOR SELECT
    USING (false);

-- Votes: Writable by registered voters only
CREATE POLICY "Votes writable by registered voters" ON public.votes
    FOR INSERT
    WITH CHECK (
        election_id IN (
            SELECT election_id FROM public.voters 
            WHERE user_id = auth.uid() AND has_voted = false
        )
    );

-- Election owners: Readable by owners themselves
CREATE POLICY "Election owners readable by owners" ON public.election_owners
    FOR SELECT
    USING (user_id = auth.uid());

-- Election owners: Writable by election owners with admin role
CREATE POLICY "Election owners writable by admins" ON public.election_owners
    FOR ALL
    USING (
        election_id IN (
            SELECT election_id FROM public.election_owners 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
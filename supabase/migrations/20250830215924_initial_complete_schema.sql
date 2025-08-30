-- Initial Complete Schema for Clear Vote Election System
-- Based on the provided schema structure

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE election_status AS ENUM ('draft', 'active', 'ended', 'cancelled');
CREATE TYPE owner_role AS ENUM ('owner', 'moderator', 'admin');

-- Users table
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  email character varying NOT NULL UNIQUE CHECK (email::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text),
  password_hash character varying NOT NULL,
  dni character varying NOT NULL UNIQUE CHECK (length(dni::text) >= 6),
  institution character varying,
  phone character varying CHECK (phone IS NULL OR phone::text ~* '^\+?[0-9\s\-()]+$'::text),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Parties table
CREATE TABLE public.parties (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL UNIQUE CHECK (length(TRIM(BOTH FROM name)) > 0),
  description text,
  logo_url character varying,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT parties_pkey PRIMARY KEY (id)
);

-- Elections table
CREATE TABLE public.elections (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL CHECK (length(TRIM(BOTH FROM title)) > 0),
  description text,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  candidacy_start timestamp with time zone NOT NULL,
  candidacy_end timestamp with time zone NOT NULL,
  status election_status DEFAULT 'draft',
  max_candidates_per_party integer DEFAULT 1 CHECK (max_candidates_per_party > 0),
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT elections_pkey PRIMARY KEY (id),
  CONSTRAINT valid_election_dates CHECK (end_date > start_date),
  CONSTRAINT valid_candidacy_dates CHECK (candidacy_end > candidacy_start),
  CONSTRAINT candidacy_before_election CHECK (candidacy_end <= start_date)
);

-- Election owners table
CREATE TABLE public.election_owners (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  election_id uuid NOT NULL,
  role owner_role DEFAULT 'moderator',
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT election_owners_pkey PRIMARY KEY (id),
  CONSTRAINT election_owners_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT election_owners_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.elections(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_election UNIQUE (user_id, election_id)
);

-- Candidates table
CREATE TABLE public.candidates (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  election_id uuid NOT NULL,
  party_id uuid,
  description text,
  proposals text,
  photo_url character varying,
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT candidates_pkey PRIMARY KEY (id),
  CONSTRAINT candidates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT candidates_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.elections(id) ON DELETE CASCADE,
  CONSTRAINT candidates_party_id_fkey FOREIGN KEY (party_id) REFERENCES public.parties(id) ON DELETE SET NULL,
  CONSTRAINT unique_user_election_candidate UNIQUE (user_id, election_id)
);

-- Voters table
CREATE TABLE public.voters (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  election_id uuid NOT NULL,
  has_voted boolean DEFAULT false,
  vote_hash character varying,
  voted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT voters_pkey PRIMARY KEY (id),
  CONSTRAINT voters_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT voters_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.elections(id) ON DELETE CASCADE,
  CONSTRAINT unique_voter_election UNIQUE (user_id, election_id)
);

-- Votes table
CREATE TABLE public.votes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  election_id uuid NOT NULL,
  candidate_id uuid NOT NULL,
  vote_hash character varying NOT NULL CHECK (length(TRIM(BOTH FROM vote_hash)) > 0),
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT votes_pkey PRIMARY KEY (id),
  CONSTRAINT votes_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.elections(id) ON DELETE CASCADE,
  CONSTRAINT votes_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE
);

-- Election results table
CREATE TABLE public.election_results (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  election_id uuid NOT NULL,
  candidate_id uuid NOT NULL,
  total_votes integer DEFAULT 0 CHECK (total_votes >= 0),
  percentage numeric DEFAULT 0.00 CHECK (percentage >= 0::numeric AND percentage <= 100::numeric),
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT election_results_pkey PRIMARY KEY (id),
  CONSTRAINT election_results_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE,
  CONSTRAINT election_results_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.elections(id) ON DELETE CASCADE,
  CONSTRAINT unique_election_candidate_result UNIQUE (election_id, candidate_id)
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_dni ON public.users(dni);
CREATE INDEX idx_users_active ON public.users(is_active);

CREATE INDEX idx_elections_status ON public.elections(status);
CREATE INDEX idx_elections_dates ON public.elections(start_date, end_date);
CREATE INDEX idx_elections_candidacy_dates ON public.elections(candidacy_start, candidacy_end);

CREATE INDEX idx_candidates_election_approved ON public.candidates(election_id, is_approved);
CREATE INDEX idx_candidates_user ON public.candidates(user_id);
CREATE INDEX idx_candidates_party ON public.candidates(party_id);

CREATE INDEX idx_voters_election_voted ON public.voters(election_id, has_voted);
CREATE INDEX idx_voters_user ON public.voters(user_id);

CREATE INDEX idx_votes_election_candidate ON public.votes(election_id, candidate_id);
CREATE INDEX idx_votes_hash ON public.votes(vote_hash);

CREATE INDEX idx_election_results_election ON public.election_results(election_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_timestamp_users
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_elections
    BEFORE UPDATE ON public.elections
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.election_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.election_results ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (can be extended later)
-- Users: Can read all, update only own profile
CREATE POLICY "Users readable by all" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Elections: Readable by all
CREATE POLICY "Elections readable by all" ON public.elections
    FOR SELECT USING (true);

-- Parties: Readable by all
CREATE POLICY "Parties readable by all" ON public.parties
    FOR SELECT USING (true);

-- Candidates: Readable by all
CREATE POLICY "Candidates readable by all" ON public.candidates
    FOR SELECT USING (true);

-- Election results: Readable by all
CREATE POLICY "Election results readable by all" ON public.election_results
    FOR SELECT USING (true);

-- Enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_wallet ON public.profiles(wallet_address);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update own profile"
  ON public.profiles FOR UPDATE
  USING (true);

-- 2. quest_progress table
CREATE TABLE public.quest_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address text NOT NULL,
  quest_id text NOT NULL,
  quest_type text,
  status text NOT NULL DEFAULT 'available',
  submission_value text,
  link_opened boolean DEFAULT false,
  admin_verified boolean DEFAULT false,
  verified_by text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(wallet_address, quest_id)
);

CREATE INDEX idx_quest_wallet ON public.quest_progress(wallet_address);

ALTER TABLE public.quest_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read quest_progress"
  ON public.quest_progress FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert quest_progress"
  ON public.quest_progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update quest_progress"
  ON public.quest_progress FOR UPDATE
  USING (true);

-- 3. learning_progress table
CREATE TABLE public.learning_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address text NOT NULL,
  module_id text NOT NULL,
  completed boolean DEFAULT false,
  quiz_score int,
  passed boolean DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(wallet_address, module_id)
);

CREATE INDEX idx_learning_wallet ON public.learning_progress(wallet_address);

ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read learning_progress"
  ON public.learning_progress FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert learning_progress"
  ON public.learning_progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update learning_progress"
  ON public.learning_progress FOR UPDATE
  USING (true);

-- 4. credential_status table
CREATE TABLE public.credential_status (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address text NOT NULL,
  credential_id text NOT NULL,
  eligible boolean DEFAULT false,
  issued boolean DEFAULT false,
  token_id text,
  tx_hash text,
  issued_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(wallet_address, credential_id)
);

CREATE INDEX idx_credential_wallet ON public.credential_status(wallet_address);

ALTER TABLE public.credential_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read credential_status"
  ON public.credential_status FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert credential_status"
  ON public.credential_status FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update credential_status"
  ON public.credential_status FOR UPDATE
  USING (true);


CREATE TYPE user_role AS ENUM ('sponsor', 'grad');
CREATE TYPE gig_status AS ENUM ('open', 'active', 'completed', 'cancelled', 'pending');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE txn_type AS ENUM ('credit', 'debit');
CREATE TYPE gig_category AS ENUM ('coding', 'admin', 'design', 'marketing', 'other');

CREATE TABLE users (
    user_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role        user_role NOT NULL,
    avatar_url  TEXT,
    bio         TEXT,
    xp_balance  INTEGER NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE GIGS (

    gig_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contractor_id UUID REFERENCES users(user_id),
    sponsor_id UUID REFERENCES users(user_id),
    title TEXT NOT NULL,
    description TEXT,
    category gig_category NOT NULL
    pay_amount INTEGER NOT NULL,
    status gig_status NOT NULL DEFAULT 'pending',
    deadline date NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW() 
)



-- CREATE TABLE CONTRACTS (



-- )

-- CREATE TABLE PORTFOLIO (



-- )

-- CREATE TABLE TRANSACTIONS (



-- )

-- CREATE TABLE REVIEWS (



-- )
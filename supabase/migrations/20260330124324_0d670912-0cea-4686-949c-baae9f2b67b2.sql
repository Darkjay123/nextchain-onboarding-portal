
-- Remove duplicate credential_status rows, keeping only the latest per (wallet_address, credential_id)
DELETE FROM credential_status
WHERE id NOT IN (
  SELECT DISTINCT ON (wallet_address, credential_id) id
  FROM credential_status
  ORDER BY wallet_address, credential_id, updated_at DESC
);

-- Add unique constraint to prevent future duplicates
ALTER TABLE credential_status
ADD CONSTRAINT credential_status_wallet_credential_unique
UNIQUE (wallet_address, credential_id);

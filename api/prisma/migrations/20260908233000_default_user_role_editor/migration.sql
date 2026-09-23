-- New users must receive the least-privileged role unless a role is supplied explicitly.
-- Existing users and administrators are not changed by this migration.
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'EDITOR';

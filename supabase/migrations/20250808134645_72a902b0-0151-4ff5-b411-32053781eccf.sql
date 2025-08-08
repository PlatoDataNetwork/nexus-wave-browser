-- 1) Secure and attach new-user profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (NEW.id, NEW.email, '');
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END$$;

-- 2) Audit logs table and function
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schema_name text NOT NULL,
  table_name text NOT NULL,
  action text NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
  record_id text,
  actor_id uuid,
  old_data jsonb,
  new_data jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_time ON public.audit_logs (occurred_at);

-- Enable RLS and policies
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
-- Allow inserts from triggers/any session; data integrity is enforced by function
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='audit_logs' AND policyname='Allow all inserts for audit'
  ) THEN
    CREATE POLICY "Allow all inserts for audit"
    ON public.audit_logs
    FOR INSERT
    TO public
    WITH CHECK (true);
  END IF;
END$$;

-- 3) Role model (RBAC)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper function to check role with SECURITY DEFINER and safe search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Basic policies for user_roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_roles' AND policyname='Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_roles' AND policyname='Users can insert their own user role'
  ) THEN
    CREATE POLICY "Users can insert their own user role"
    ON public.user_roles
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid() AND role = 'user'::public.app_role);
  END IF;
END$$;

-- Policy to read audit logs (own or admin)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='audit_logs' AND policyname='Users can view own logs or admins'
  ) THEN
    CREATE POLICY "Users can view own logs or admins"
    ON public.audit_logs
    FOR SELECT
    TO authenticated
    USING (actor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
  END IF;
END$$;

-- 4) Audit trigger function (SECURITY DEFINER, fixed search_path)
CREATE OR REPLACE FUNCTION public.log_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_record_id text;
BEGIN
  -- Try to capture common primary key column named 'id' if present
  BEGIN
    v_record_id := CASE WHEN TG_OP = 'DELETE' THEN (OLD).id::text ELSE (NEW).id::text END;
  EXCEPTION WHEN undefined_column THEN
    v_record_id := NULL;
  END;

  INSERT INTO public.audit_logs(schema_name, table_name, action, record_id, actor_id, old_data, new_data, occurred_at)
  VALUES (TG_TABLE_SCHEMA::text,
          TG_TABLE_NAME::text,
          TG_OP::text,
          v_record_id,
          auth.uid(),
          CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) ELSE NULL END,
          CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
          now());
  RETURN NULL;
END;
$$;

-- Attach audit triggers to key tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'audit_profiles_iud'
  ) THEN
    CREATE TRIGGER audit_profiles_iud
    AFTER INSERT OR UPDATE OR DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.log_audit();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'audit_search_api_keys_iud'
  ) THEN
    CREATE TRIGGER audit_search_api_keys_iud
    AFTER INSERT OR UPDATE OR DELETE ON public.search_api_keys
    FOR EACH ROW EXECUTE FUNCTION public.log_audit();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'audit_wallet_connections_iud'
  ) THEN
    CREATE TRIGGER audit_wallet_connections_iud
    AFTER INSERT OR UPDATE OR DELETE ON public.wallet_connections
    FOR EACH ROW EXECUTE FUNCTION public.log_audit();
  END IF;
END$$;

-- 5) updated_at trigger for tables that have updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'updated_at'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_profiles_updated_at'
  ) THEN
    CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'search_api_keys' AND column_name = 'updated_at'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_search_api_keys_updated_at'
  ) THEN
    CREATE TRIGGER set_search_api_keys_updated_at
    BEFORE UPDATE ON public.search_api_keys
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END$$;

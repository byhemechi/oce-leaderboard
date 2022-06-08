import { createClient } from "https://esm.sh/@supabase/supabase-js@1.35.3";
import invariant from "https://esm.sh/tiny-invariant@1.2.0";

const { SUPABASE_URL, SUPABASE_KEY } = Deno.env.toObject();
invariant(SUPABASE_URL, "Missing Supabase URL");
invariant(SUPABASE_KEY, "Missing Supabase key");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export default supabase;

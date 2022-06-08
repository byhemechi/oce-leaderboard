import { createClient } from "@supabase/supabase-js";
import invariant from "tiny-invariant";

const { SUPABASE_URL, SUPABASE_KEY } = process.env;
invariant(SUPABASE_URL, "Missing Supabase URL");
invariant(SUPABASE_KEY, "Missing Supabase key");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export default supabase;

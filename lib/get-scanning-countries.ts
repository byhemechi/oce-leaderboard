import supabase from "./client.ts";

export default async function getTrackedCountries() {
  const { data, status } = await supabase
    .from("country")
    .select("name, extra_players");
  if (status !== 200) return null;
  return data as { name: string; extra_players: (number | null)[] }[];
}

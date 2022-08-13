import supabase from "./client.ts";

const getTrackedCountries = async () => {
  const { data } = await supabase.from("country");
  if (!data) throw "Failed to load countries";
  else
    return data as {
      name: string;
      extra_players?: (string | null)[];
    }[];
};

export default getTrackedCountries;

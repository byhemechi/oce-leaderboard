import supabase from "./client.ts";
import getLeaderboard from "./get-leaderboard.ts";
import getPlayer from "./get-player.ts";
import getTrackedCountries from "./get-scanning-countries.ts";

export default async function updatePlayers() {
  const countries = await getTrackedCountries();
  const pages = 20;
  const log: string[] = [];
  console.log("Updating player data...");

  const extraPlayers =
    countries
      ?.flatMap((i) =>
        i.extra_players
          ? i.extra_players.map((player) => ({ player, country: i.name }))
          : null
      )
      .filter((i) => i !== null) ?? [];

  const updated = await Promise.all([
    ...extraPlayers.map(async (d) => {
      if (d === null) return null;
      const { player, country } = d;
      const playerData = await getPlayer(player?.toString() ?? "");
      if (playerData === null) return null;
      playerData.country = country;
      log.push(`Updated player ${player}`);
      return playerData;
    }),
    ...new Array(pages).fill(null).map(async (_i, page) => {
      const pageData = await getLeaderboard(
        countries?.map((i) => i.name) ?? [],
        page + 1
      );
      if (pageData == null) return null;
      log.push(`Updated page ${page + 1}`);
      return pageData.players;
    }),
  ]);
  await supabase
    .from("player")
    .upsert([...updated.flat(Infinity).map((i) => ({ data: i }))]);

  await supabase.rpc("update_leaderboards");
  log.push("Refreshed leaderboard");
  await supabase.rpc("update_firsts");
  log.push("Refreshed firsts");
  return log;
}

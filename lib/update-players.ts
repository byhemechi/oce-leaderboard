import supabase from "./client.ts";
import getLeaderboard from "./get-leaderboard.ts";
import getPlayer from "./get-player.ts";
import getTrackedCountries from "./get-scanning-countries.ts";

export default async function updatePlayers() {
  const countries = getTrackedCountries();
  const pages = 20;

  Promise.all(
    new Array(20).fill(null).map(async (_i, page) => {
      const pageData = await getLeaderboard(
        countries?.map((i) => i.name) ?? [],
        page + 1
      );
      if (pageData == null) return null;
      console.log(`Updated page ${page + 1}`);

      await supabase.from("player").upsert(
        pageData.players.map((data) => ({
          data,
        }))
      );
    })
  );

  const extraPlayers =
    countries
      ?.flatMap((i) =>
        i.extra_players
          ? i.extra_players.map((player) => ({ player, country: i.name }))
          : null
      )
      .filter((i) => i !== null) ?? [];

  await supabase.from("player").upsert(
    (
      await Promise.all(
        extraPlayers.map(async (d) => {
          if (d === null) return null;
          const { player, country } = d;
          const playerData = await getPlayer(player?.toString() ?? "");
          if (playerData === null) return null;
          playerData.country = country;
          console.log(`Updated player ${player}`);
          return playerData;
        })
      )
    ).map((i) => ({ data: i }))
  );
}

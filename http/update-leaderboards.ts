import ms from "https://esm.sh/ms@2.1.3";
let lastUpdated = 0;
import updatePlayers from "../lib/update-players.ts";
import { json } from "https://deno.land/x/sift@0.5.0/mod.ts";

const updateFrequency = ms("1m");

export const lastUpdatedRoute = () =>
  json({
    absolute: lastUpdated,
    relative: Date.now() - lastUpdated,
    human: ms(Date.now() - lastUpdated, { long: true }) + " ago",
  });

const updateLeaderboardRoute = async () => {
  const now = Date.now();
  if (now - lastUpdated < updateFrequency)
    return new Response(
      `Please wait ${ms(lastUpdated + updateFrequency - now)}`,
      { status: 429 }
    );
  lastUpdated = now;
  return new Response((await updatePlayers()).join("\n"));
};

export default updateLeaderboardRoute;

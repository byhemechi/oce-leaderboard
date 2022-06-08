import ms from "https://esm.sh/ms";
let lastUpdated = 0;
import updatePlayers from "../lib/update-players.ts";

const updateFrequency = ms("1m");

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

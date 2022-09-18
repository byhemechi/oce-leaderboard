import ms from "https://esm.sh/ms@2.1.3";
let lastUpdated = 0;
import updatePlayers from "../lib/update-players.ts";

const updateFrequency = ms("1m");

export const lastUpdatedRoute = () =>
  new Response(
    JSON.stringify({
      absolute: lastUpdated,
      relative: Date.now() - lastUpdated,
      human: ms(Date.now() - lastUpdated, { long: true }) + " ago",
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );

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

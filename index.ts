import updateLeaderboardRoute from "./http/update-leaderboards.ts";
import tablePage from "./http/rankings.tsx";
import { serve } from "https://deno.land/x/sift@0.5.0/mod.ts";

serve({
  "/": tablePage,
  "/update_leaderboards": updateLeaderboardRoute,
});

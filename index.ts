import updatePlayers from "./lib/update-players.ts";
import handler from "./http/index.tsx";
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

await serve(handler(updatePlayers), { addr: "0.0.0.0:3000" });

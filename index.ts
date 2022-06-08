import updatePlayers from "./lib/update-players.ts";
import handler from "./http/index.tsx";
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import ms from "https://esm.sh/ms@2.1.3";

updatePlayers();

setInterval(() => updatePlayers(), ms("2m"));
await serve(handler, { addr: "0.0.0.0:3000" });

import updateLeaderboardRoute, {
  lastUpdatedRoute,
} from "./http/update-leaderboards.ts";
import tablePage from "./http/rankings.tsx";
import { serveStatic } from "https://deno.land/x/sift@0.5.0/mod.ts";
import { serve } from "https://deno.land/std@0.138.0/http/mod.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

interface FetchEvent {
  readonly clientId: string;
  readonly preloadResponse: Promise<any>;
  readonly replacesClientId: string;
  readonly request: Request;
  readonly resultingClientId: string;
  respondWith(r: Response | Promise<Response>): void;
}

const routes = new Map(
  Object.entries({
    "/": tablePage,
    "/update_leaderboards": updateLeaderboardRoute,
    "/last_updated": lastUpdatedRoute,
  })
);

const listingRoute = (request: Request) =>
  serveDir(request, {
    fsRoot: "./static/",
  });

const handleRequest = (request: Request) => {
  const { pathname } = new URL(request.url);

  const route = routes.get(pathname) ?? listingRoute;
  return route(request);
};

if ("FetchEvent" in window) {
  addEventListener("fetch", async (event) => {
    const { respondWith, request } = event as unknown as FetchEvent; // Deno deploy does some annoying things
    respondWith(await handleRequest(request));
  });
} else {
  const l = location ?? new URL("http://localhost:8000");
  await serve(handleRequest, {
    hostname: l.hostname ?? "localhost",
    port: parseInt(l.port) ?? 8000,
  });
}

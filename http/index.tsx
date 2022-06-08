/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
import { h, ssr, tw } from "https://crux.land/nanossr@0.0.1";
import supabase from "../lib/client.ts";
import ms from "https://esm.sh/ms@2.1.3";
import { Helmet } from "https://deno.land/x/nano_jsx/mod.ts";

interface PlayerBasic {
  rank: number;
  scoresaber_id: number;
  name: string;
  pp: string;
}

const PlayerTable = ({
  players,
  page,
}: {
  players: PlayerBasic[];
  page: number;
}) => (
  <div class={tw`max-w-screen-lg mx-auto`}>
    <Helmet>
      <title>OCE Leaderboard page {page + 1}</title>
    </Helmet>
    <table class={tw`w-full`}>
      <thead>
        <tr class={tw`text-left border-b-2`}>
          <th>#</th>
          <th class={tw`py-2`}>Name</th>
          <th class={tw`text-right`}>PP</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player) => (
          <tr class={tw`border-b-2`}>
            <td>{player.rank}</td>
            <td class={tw`py-2`}>{player.name}</td>
            <td class={tw`text-right`}>{player.pp}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <Pagination page={page} />
  </div>
);

const Pagination = ({ page }: { page: number }) => (
  <form method="get" class={tw`flex justify-between p-4`}>
    <button
      type="submit"
      name="page"
      class={tw`disabled:opacity-25`}
      value={page}
      disabled={page < 1 ? "disabled" : undefined}
    >
      &larr;
    </button>
    <button type="submit" name="page" value={page + 2}>
      &rarr;
    </button>
  </form>
);

let lastUpdated = 0;
const delay = ms("1m");

const handler =
  (updateFunction: () => Promise<string[]>) => async (req: Request) => {
    const url = new URL(req.url);
    switch (url.pathname) {
      case "/":
        return await playerTable(url);
      case "/update_leaderboards":
        if (Date.now() - lastUpdated >= delay) {
          lastUpdated = Date.now();
          return new Response((await updateFunction()).join("\n"));
        } else {
          return new Response(
            `please wait ${ms(lastUpdated + delay - Date.now())}`,
            { status: 429 }
          );
        }
      default:
        return new Response("Not Found", { status: 404 });
    }
  };

export default handler;

async function playerTable(url: URL) {
  const page = parseInt(url.searchParams.get("page") ?? "1") - 1;
  const pageSize = 50;
  const { data: players } = await supabase
    .from("player_basic")
    .select("*")
    .range(page * pageSize, page * pageSize + pageSize - 1);
  return ssr(() => (
    <PlayerTable players={players as PlayerBasic[]} page={page} />
  ));
}

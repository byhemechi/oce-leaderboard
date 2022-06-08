/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { h, ssr, tw } from "https://crux.land/nanossr@0.0.1";
import supabase from "../lib/client.ts";

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

const handler = async (req: Request) => {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") ?? "1") - 1;
  const pageSize = 50;
  const { data: players } = await supabase
    .from("player_basic")
    .select("*")
    .range(page * pageSize, page * pageSize + pageSize - 1);
  return ssr(() => (
    <PlayerTable players={players as PlayerBasic[]} page={page} />
  ));
};

export default handler;

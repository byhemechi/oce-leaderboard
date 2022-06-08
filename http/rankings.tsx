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
  scoresaber_id: string;
  country: string;
  name: string;
  pp: string;
}

const toEmojiFlag = (countryCode: string): string =>
  countryCode
    .toLowerCase()
    .replace(/[a-z]/g, (i) =>
      String.fromCodePoint((i.codePointAt(0) ?? 0) - 97 + 0x1f1e6)
    );

const PlayerTable = ({
  players,
  page,
}: {
  players: PlayerBasic[];
  page: number;
}) => (
  <div class={tw`max-w-screen-lg mx-auto`}>
    <Helmet>
      <title>
        OCE Beat Saber Leaderboard{page > 0 ? ` page ${page + 1}` : ""}
      </title>
      <link rel="shortcut icon" href="/OCEBeatSaber.svg" />
    </Helmet>
    <Pagination page={page} />
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
            <td class={tw`py-2`}>
              <a
                href={`https://scoresaber.com/u/${player.scoresaber_id}`}
                class={tw`flex h-8 items-center gap-2`}
              >
                <img
                  src={
                    player.scoresaber_id.startsWith("7")
                      ? `https://cdn.scoresaber.com/avatars/${player.scoresaber_id}.jpg`
                      : "https://cdn.scoresaber.com/avatars/oculus.png"
                  }
                  class={tw`h-8 w-8 rounded-full`}
                  alt="avatar"
                  loading="lazy"
                />
                <span>{toEmojiFlag(player.country)}</span>
                <span>{player.name}</span>
              </a>
            </td>
            <td class={tw`text-right`}>{player.pp}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <Pagination page={page} />
  </div>
);

const Pagination = ({ page }: { page: number }) => (
  <form method="get" class={tw`flex justify-between p-2`}>
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

const rankingPageHandler = async (req: Request) => {
  const url = new URL(req.url);
  return await playerTable(url);
};

export default rankingPageHandler;

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

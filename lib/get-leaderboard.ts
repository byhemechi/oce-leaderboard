import { components } from "../scoresaber.ts";

export default async function getLeaderboard(countries: string[], page = 1) {
  const url = new URL(`https://scoresaber.com/api/players`);
  url.searchParams.set("countries", countries.join(","));
  url.searchParams.set("page", page.toString());

  const response = await fetch(url.toString());
  if (response.status !== 200) return null;
  const players =
    (await response.json()) as components["schemas"]["PlayerCollection"];
  return players;
}

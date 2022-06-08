import { components } from "../scoresaber";

export default async function getPlayer(id: string) {
  const response = await fetch(`https://scoresaber.com/api/player/${id}/basic`);
  if (response.status !== 200) return null;
  else return (await response.json()) as components["schemas"]["Player"];
}

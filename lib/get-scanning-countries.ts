const getTrackedCountries = (): {
  name: string;
  extra_players?: (string | null)[];
}[] => [
  {
    name: "AU",
    extra_players: ["76561198404774259", "76561198417639620"],
  },
  { name: "NZ" },
];

export default getTrackedCountries;

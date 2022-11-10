import { QueryData } from "../types/app.types";

const backgroundImages: QueryData = {
  queryKey: ["background-images"],
  address: "/api/background-image",
};

const gameNames: QueryData = {
  queryKey: ["game-names"],
  address: "/api/game-name",
};

const sponsorsBars: QueryData = {
  queryKey: ["sponsors-bar"],
  address: "/api/sponsors-bar",
};

const teams: QueryData = {
  queryKey: ["teams"],
  address: "/api/team",
};

export const QUERIES_DATA = {
  BACKGROUND_IMAGES: backgroundImages,
  GAME_NAMES: gameNames,
  SPONSORS_BARS: sponsorsBars,
  TEAMS: teams,
};

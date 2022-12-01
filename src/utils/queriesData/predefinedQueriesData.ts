import { IQueryData } from "../types/app.types";

const backgroundImages: IQueryData = {
  queryKey: ["background-images"],
  address: "/api/background-image",
};

const gameNames: IQueryData = {
  queryKey: ["game-names"],
  address: "/api/game-name",
};

const sponsorsBars: IQueryData = {
  queryKey: ["sponsors-bar"],
  address: "/api/sponsors-bar",
};

const teams: IQueryData = {
  queryKey: ["teams"],
  address: "/api/team",
};

export const QUERIES_DATA = {
  BACKGROUND_IMAGES: backgroundImages,
  GAME_NAMES: gameNames,
  SPONSORS_BARS: sponsorsBars,
  TEAMS: teams,
};

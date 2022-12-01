////formik
export interface ILoginFormValues {
  userName: string;
  password: string;
}

//team
export interface ITeamFormValues {
  teamName: string;
  place: string;
  teamCrestImage: File[] | null;
}
export interface ITeam {
  teamName: string;
  place: string;
  teamCrestImage: string;
  _id: string;
}

//sponsors-bar
export interface ISponsorBarFormValues {
  barName: string;
  sponsorsBarImage: File | null;
}
export interface SponsorBarInterface {
  barName: string;
  sponsorsBarImage: string;
  _id: string;
}

//background-image
export interface IBackgroundImage {
  backgroundImageName: string;
  backgroundImage: string;
  backgroundImageThumbnail: string;
  _id: string;
}
export interface IBackgroundImageFormValues {
  backgroundImageName: string;
  backgroundImage: File | null;
}

//game-name
export interface IGameName {
  gameName: string;
  gameImage: string;
  _id: string;
}
export interface IGameNameFormValues {
  gameName: string;
  gameImage: File | null;
}

//match-config
export interface IMatchConfigFormValues {
  date: string;
  time: string;
  gameName: string;
  sponsorsBar: string | null;
  isHost: boolean;
  opponent: string;
  differentPlace: string | null;
}
export interface IMatchConfig {
  date: string;
  time: string;
  gameName: IGameName;
  sponsorsBar: SponsorBarInterface | null;
  isHost: boolean;
  opponent: ITeam;
  differentPlace: string | null;
}

//match-day
export interface IMatchDayFormValues {
  background: string;
}
export interface IMatchDay {
  background: string;
  _id: string;
}

////
export interface INotification {
  title: string;
  message: string;
  status: "success" | "error";
}

export interface IQueryData {
  queryKey: string[];
  address: string;
}

export interface IDropDownOptions {
  key: string;
  value: string;
}

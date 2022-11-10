////formik
export interface LoginFormValues {
  userName: string;
  password: string;
}

//team
export interface TeamFormValues {
  teamName: string;
  place: string;
  teamCrestImage: File | null;
}
export interface TeamInterface {
  teamName: string;
  place: string;
  teamCrestImage: string;
  _id: string;
}

//sponsors-bar
export interface SponsorBarFormValues {
  barName: string;
  sponsorsBarImage: File | null;
}
export interface SponsorBarInterface {
  barName: string;
  sponsorsBarImage: string;
  _id: string;
}

//background-image
export interface BackgroundImageInterface {
  backgroundImageName: string;
  backgroundImage: string;
  backgroundImageThumbnail: string;
  _id: string;
}
export interface BackgroundImageFormValues {
  backgroundImageName: string;
  backgroundImage: File | null;
}

//game-name
export interface GameNameInterface {
  gameName: string;
  gameImage: string;
  _id: string;
}
export interface GameNameFormValues {
  gameName: string;
  gameImage: File | null;
}

//match-config
export interface MatchConfigFormValues {
  date: string;
  time: string;
  gameName: string;
  sponsorsBar: string | null;
  isHost: boolean;
  opponent: string;
  differentPlace: string | null;
}

//match-day
export interface MatchDayFormValues {
  background: string;
}
export interface MatchDayInterface {
  background: string;
  _id: string;
}

////
export interface NotificationInterface {
  title: string;
  message: string;
  status: "success" | "error";
}

export interface QueryData {
  queryKey: string[];
  address: string;
}

export interface DropDownOptions {
  key: string;
  value: string;
}

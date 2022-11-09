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

////
export interface NotificationInterface {
  title: string;
  message: string;
  status: "success" | "error";
}

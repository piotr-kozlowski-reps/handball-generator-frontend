//formik
export interface LoginFormValues {
  userName: string;
  password: string;
}

export interface TeamFormValues {
  teamName: string;
  place: string;
  teamCrest: File | null;
}

export interface NotificationInterface {
  title: string;
  message: string;
  status: "success" | "error";
}

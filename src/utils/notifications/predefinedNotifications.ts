import { INotification } from "../types/app.types";

const notLoggedNotification: INotification = {
  status: "error",
  title: "Niezalgowany.",
  message: "Niepoprawne dane.",
};

const noAccessNotification: INotification = {
  status: "error",
  title: "Brak dostępu.",
  message: "Brak dostępu do zasobów.",
};

export const NOTIFICATIONS = {
  NOT_LOGGED: notLoggedNotification,
  NO_ACCESS: noAccessNotification,
};

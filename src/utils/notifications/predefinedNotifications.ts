import { NotificationInterface } from "../types/app.types";

const notLoggedNotification: NotificationInterface = {
  status: "error",
  title: "Niezalgowany.",
  message: "Niepoprawne dane.",
};

const noAccessNotification: NotificationInterface = {
  status: "error",
  title: "Brak dostępu.",
  message: "Brak dostępu do zasobów.",
};

export const NOTIFICATIONS = {
  NOT_LOGGED: notLoggedNotification,
  NO_ACCESS: noAccessNotification,
};

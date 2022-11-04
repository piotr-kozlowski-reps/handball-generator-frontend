import { createContext, useState, useEffect } from "react";
import { NotificationInterface } from "../utils/types/app.types";

////interfaces
interface Props {
  children: JSX.Element;
}

interface NotificationProviderInterface {
  notification: NotificationInterface | null;
  showNotification: (notificationData: NotificationInterface) => void;
  hideNotification: () => void;
}

////context
const defaultState: NotificationProviderInterface = {
  notification: null,
  showNotification: () => {},
  hideNotification: () => {},
};
const NotificationContext =
  createContext<NotificationProviderInterface>(defaultState);

export const NotificationProvider = ({ children }: Props) => {
  ////vars
  const [activeNotification, setActiveNotification] =
    useState<NotificationInterface | null>(null);

  ////logic
  const showNotification = (notificationData: NotificationInterface) => {
    setActiveNotification(notificationData);
  };

  const hideNotification = () => {
    setActiveNotification(null);
  };

  ////effect
  useEffect(() => {
    if (
      activeNotification &&
      (activeNotification.status === "success" ||
        activeNotification.status === "error")
    ) {
      const timer = setTimeout(() => {
        setActiveNotification(null);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [activeNotification]);

  const context = {
    notification: activeNotification,
    showNotification,
    hideNotification,
  };

  ////jsx
  return (
    <NotificationContext.Provider value={context}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;

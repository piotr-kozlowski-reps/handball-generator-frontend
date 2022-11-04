import NotificationContext from "../context/NotificationProvider";
import { useContext } from "react";

const useNotification = () => {
  return useContext(NotificationContext);
};

export default useNotification;

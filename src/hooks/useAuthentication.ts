import { useState } from "react";

interface AuthenticationReturnInterface {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

/** Hook for managing global state of Authentication */
export const useAuthentication = (): AuthenticationReturnInterface => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return {
    isLoggedIn,
    setIsLoggedIn,
  };
};

// ////context
// const defaultState: AuthProviderInterface = {
//   auth: {},
//   setAuth: () => {},
// };
// const AuthContext = createContext<AuthProviderInterface>(defaultState);

// export const AuthContextProvider = ({ children }: Props) => {
//   const [auth, setAuth] = useState({});

//   return (
//     <AuthContext.Provider value={{ auth, setAuth }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuthProvider = () => useContext(AuthContext);

import { createContext, useState } from "react";

////interfaces
interface Props {
  children: JSX.Element;
}
interface AuthInterface {
  accessToken?: string;
  roles?: number[];
}
interface AuthProviderInterface {
  auth: AuthInterface | undefined;
  setAuth: React.Dispatch<React.SetStateAction<AuthInterface | undefined>>;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
}

////context
const defaultState: AuthProviderInterface = {
  auth: {},
  setAuth: () => {},
  persist: false,
  setPersist: () => {},
};
const AuthContext = createContext<AuthProviderInterface>(defaultState);

export const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState<AuthInterface>();
  const [persist, setPersist] = useState<boolean>(
    JSON.parse(localStorage.getItem("persist") || "false") || false
  );

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

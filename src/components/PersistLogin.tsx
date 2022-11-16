import { Outlet } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import useLocalStorage from "../hooks/useLocalStorage";
import Loading from "./ui/Loading";

const PersistLogin = () => {
  ////vars
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();
  // const [persist] = useLocalStorage("persist", false);

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);
    // !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    // return () => (isMounted = false);
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`authToken: ${JSON.stringify(auth?.accessToken)}`);
  }, [isLoading]);

  return (
    <Fragment>
      {!persist ? <Outlet /> : isLoading ? <Loading /> : <Outlet />}
    </Fragment>
  );
};

export default PersistLogin;

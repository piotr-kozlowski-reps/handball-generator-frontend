import { Outlet } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import useRefreshToken from "../hooks/useRefresh";
import useAuth from "../hooks/useAuth";
import useLocalStorage from "../hooks/useLocalStorage";
import Loading from "./ui/Loading";

const PersistLogin = () => {
  ////vars
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const [persist] = useLocalStorage("persist", false);

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

    // return () => (isMounted = false);
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
  }, [isLoading]);

  return (
    <Fragment>
      {!persist ? <Outlet /> : isLoading ? <Loading /> : <Outlet />}
    </Fragment>
  );
};

export default PersistLogin;

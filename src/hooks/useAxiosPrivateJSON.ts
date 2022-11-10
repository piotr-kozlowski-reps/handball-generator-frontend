import { axiosPrivateJSON } from "../utils/api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { AxiosRequestConfig } from "axios";

const useAxiosPrivateJSON = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivateJSON.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        config.headers = config.headers ?? {};
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${auth?.accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivateJSON.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivateJSON(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivateJSON.interceptors.request.eject(requestIntercept);
      axiosPrivateJSON.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivateJSON;
};

export default useAxiosPrivateJSON;

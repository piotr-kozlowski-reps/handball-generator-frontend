import axios from "../utils/api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    console.log("refreshing token");

    const response = await axios.get("/refresh", { withCredentials: true });
    setAuth((prev) => {
      console.log("prev: ", JSON.stringify(prev));
      console.log(response.data.accessToken);

      return {
        ...prev,
        roles: response.data.roles,
        accessToken: response.data.accessToken,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;

import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosPrivateFormData } from "../utils/api/axios";
import useAuth from "./useAuth";

////POST
export const usePostData = (address: string) => {
  ////vars
  const { auth } = useAuth();

  const sendFunction = (dataToBeSent: any) => {
    return axiosPrivateFormData.post(address, dataToBeSent, {
      headers: { Authorization: `Bearer ${auth?.accessToken}` },
    });
  };
  return useMutation(sendFunction);
};

////GET
export const useGetData = (address: string, queryKey: string[]) => {
  ////vars
  const { auth } = useAuth();

  const getFunction = () => {
    return axiosPrivateFormData.get(address, {
      headers: { Authorization: `Bearer ${auth?.accessToken}` },
    });
  };
  return useQuery(queryKey, () => getFunction(), {
    refetchOnWindowFocus: true,
  });
};

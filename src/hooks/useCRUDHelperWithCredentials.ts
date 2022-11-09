import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosPrivateFormData } from "../utils/api/axios";
import useAuth from "./useAuth";

////TODO: generics: axiosPrivateFormData.post<TYP>

////POST
export const usePostData = (address: string, queryKey: string[]) => {
  ////vars
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const sendFunction = (dataToBeSent: any) => {
    return axiosPrivateFormData.post(address, dataToBeSent, {
      headers: { Authorization: `Bearer ${auth?.accessToken}` },
    });
  };
  return useMutation(sendFunction, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
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

////DELETE
export const useDeleteData = (address: string, queryKey: string[]) => {
  ////vars
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const deleteFunction = (id: string) => {
    return axiosPrivateFormData.delete(`${address}/${id}`, {
      headers: { Authorization: `Bearer ${auth?.accessToken}` },
    });
  };
  return useMutation(deleteFunction, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

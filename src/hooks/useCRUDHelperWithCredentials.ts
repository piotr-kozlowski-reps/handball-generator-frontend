import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPrivateFormData from "./useAxiosPrivateFormData";
import { Location, useNavigate } from "react-router-dom";

////TODO: generics: axiosPrivateFormData.post<TYP>

////POST
export const usePostData = (
  address: string,
  queryKey: string[],
  onErrorHandler:
    | ((error: unknown, variables: string, context: unknown) => unknown)
    | undefined
) => {
  ////vars
  const queryClient = useQueryClient();
  const axiosPrivateFormData = useAxiosPrivateFormData();

  const sendFunction = (dataToBeSent: any) => {
    return axiosPrivateFormData.post(address, dataToBeSent);
  };
  return useMutation(sendFunction, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: onErrorHandler,
  });
};

////GET
export const useGetData = (
  address: string,
  queryKey: string[],
  location: Location
) => {
  ////vars
  const { auth } = useAuth();
  const axiosPrivateFormData = useAxiosPrivateFormData();
  const navigate = useNavigate();

  const getFunction = () => {
    return axiosPrivateFormData.get(address);
  };
  return useQuery(queryKey, () => getFunction(), {
    refetchOnWindowFocus: true,
    onError: () => {
      navigate("/login", { state: { from: location }, replace: true });
    },
  });
};

////DELETE
export const useDeleteData = (
  address: string,
  queryKey: string[],
  onErrorHandler:
    | ((error: unknown, variables: string, context: unknown) => unknown)
    | undefined
) => {
  ////vars
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const axiosPrivateFormData = useAxiosPrivateFormData();
  const navigate = useNavigate();

  const deleteFunction = (id: string) => {
    return axiosPrivateFormData.delete(`${address}/${id}`);
  };
  return useMutation(deleteFunction, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
    // onError: () => {
    //   navigate("/login", { state: { from: location }, replace: true });
    // },
    onError: onErrorHandler,
  });
};

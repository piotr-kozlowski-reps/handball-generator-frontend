import { useMutation } from "@tanstack/react-query";
import axios from "../utils/api/axios";

export const usePostData = (address: string) => {
  const sendFunction = (dataToBeSent: any) => {
    return axios.post(address, dataToBeSent);
  };
  return useMutation(sendFunction);
};

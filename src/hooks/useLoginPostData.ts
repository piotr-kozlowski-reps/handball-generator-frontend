import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { LoginFormValues } from "../utils/types/app.types";

const postLoginData = (loginData: LoginFormValues) => {
  console.log(process.env.REACT_APP_BACKEND_URL);

  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/api/login`,
    loginData
  );
};

export const useLoginPostData = () => {
  return useMutation(postLoginData);
};

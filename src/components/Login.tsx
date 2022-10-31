import React, { Fragment } from "react";
import { LoginFormValues } from "../utils/types/app.types";
import * as Yup from "yup";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";

import herb from "../images/gornik-logo-01.png";
import FormikControl from "./formik-components/FormikControl";
import Button from "./ui/Button";
import { usePostData } from "../hooks/useCRUDOperationsHelper";
import useAuth from "../hooks/useAuth";
import { AxiosError, AxiosResponse } from "axios";

const Login = () => {
  ////vars
  const { mutate, isLoading } = usePostData("/api/aut");
  const { setAuth } = useAuth();
  ////formik
  const formikInitialValues: LoginFormValues = {
    userName: "",
    password: "",
  };
  const validationSchema = Yup.object({
    userName: Yup.string().required("Użytkownik jest wymagany."),
    password: Yup.mixed().test({
      name: "required",
      message: "Hasło jest wymagane.",
      test: (value) => {
        if (!value) return false;
        if (value.trim().length < 1) return false;
        return true;
      },
    }),
  });
  const onSubmitHandler = async (
    values: LoginFormValues,
    formikHelpers: FormikHelpers<LoginFormValues>
  ) => {
    const loginBody: LoginFormValues = {
      userName: values.userName,
      password: values.password,
    };
    mutate(loginBody, {
      onSuccess: (data) => {
        const accessToken: string = data.data.accessToken;
        const roles: number[] = data.data.roles;
        setAuth({ accessToken, roles });
        formikHelpers.setSubmitting(false);
        formikHelpers.resetForm();
      },
      onError: (error) => {
        const axiosReadableError: AxiosError = error as AxiosError;

        console.log(axiosReadableError?.response?.data);
      },
    });
  };

  ////jsx
  return (
    <Fragment>
      <Formik
        initialValues={formikInitialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitHandler}
        validateOnMount={true}
      >
        {(formik: FormikProps<LoginFormValues>) => {
          ////jsx
          return (
            <Form>
              <div className="w-full h-screen flex flex-col justify-center items-center">
                <div>
                  <div className="pb-20">
                    <img src={herb} alt="Herb" />
                    <p className="text-md">Handball Konfigurator</p>
                  </div>
                </div>
                <div className="pt-12">
                  <span className="font-bold uppercase text-xl">Login</span>
                </div>
                <div className="w-full p-2">
                  <FormikControl
                    control="input"
                    type="text"
                    label="Użytkownik:"
                    name="userName"
                    placeholder={"tu wpisz nazwę uzytkownika"}
                    additionalClass=""
                    formik={formik}
                  />
                </div>
                <div className="w-full p-2">
                  <FormikControl
                    control="input"
                    type="text"
                    label="Password:"
                    name="password"
                    placeholder={"tu wpisz hasło"}
                    additionalClass=""
                    formik={formik}
                  />
                </div>
                <div className="pt-6">
                  <Button
                    disabled={!formik.isValid || formik.isSubmitting}
                    type="submit"
                    color="white"
                    bgColor={`bg-appButton`}
                    text="Login"
                    borderRadius="10px"
                    size="md"
                    additionalClass="px-7"
                  />
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Fragment>
  );
};

export default Login;
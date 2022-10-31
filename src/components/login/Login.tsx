import React, { Fragment } from "react";
import { LoginFormValues } from "../../utils/types/app.types";
import * as Yup from "yup";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";

import herb from "../../images/gornik-logo-01.png";
import FormikControl from "../formik-components/FormikControl";
import Button from "../ui/Button";
import { useLoginPostData } from "../../hooks/useLoginPostData";

const Login = () => {
  ////vars
  const { mutate, isLoading } = useLoginPostData();
  ////formik
  const formikInitialValues: LoginFormValues = {
    login: "",
    password: "",
  };
  const validationSchema = Yup.object({
    login: Yup.string().required("Login jest wymagany."),
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
      login: values.login,
      password: values.password,
    };
    mutate(loginBody, {
      onSuccess: (data) => {
        console.log(data);
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
                    label="Login:"
                    name="login"
                    placeholder={"tu wpisz login"}
                    additionalClass=""
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

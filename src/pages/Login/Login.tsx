import React, { Fragment, useEffect, useRef } from "react";
import { ILoginFormValues, INotification } from "../../utils/types/app.types";
import * as Yup from "yup";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import useLocalStorage from "../../hooks/useLocalStorage";

import herb from "../../assets/gornik-logo-01.png";

import FormikControl from "../../components/formik-components/FormikControl";
import Button from "../../components/ui/Button";
import { usePostData } from "../../hooks/useCRUDHelper";
import useAuth from "../../hooks/useAuth";
import useNotification from "../../hooks/useNotification";
import Loading from "../../components/ui/Loading";
import Notification from "../../components/ui/Notification";

const Login = () => {
  ////vars
  const { mutate, isLoading } = usePostData("/api/auth");
  const { setAuth, persist, setPersist } = useAuth();
  const { notification, showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  ////formik
  const formikInitialValues: ILoginFormValues = {
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
    values: ILoginFormValues,
    formikHelpers: FormikHelpers<ILoginFormValues>
  ) => {
    const loginBody: ILoginFormValues = {
      userName: values.userName,
      password: values.password,
    };
    mutate(loginBody, {
      onSuccess: (data) => {
        console.log(data);

        const accessToken: string = data.data.accessToken;
        const roles: number[] = data.data.roles;
        setAuth({ accessToken, roles });

        formikHelpers.setSubmitting(false);
        formikHelpers.resetForm();
        navigate(from, { replace: true });
      },
      onError: (error) => {
        const axiosReadableError: AxiosError = error as AxiosError;

        if (
          axiosReadableError.response?.status === 401 ||
          axiosReadableError.response?.status === 400
        ) {
          showNotification({
            status: "error",
            title: "Niezalgowany.",
            message: "Niepoprawne dane.",
          });
        } else {
          showNotification({
            status: "error",
            title: "Niezalgowany.",
            message: "Bład logowania.",
          });
        }

        // console.log(axiosReadableError?.response?.data);
        // if (!axiosReadableError?.response) {
        //   alert("No Server Response");
        // } else if (axiosReadableError.response?.status === 400) {
        //   alert("Missing Username or Password");
        // } else if (axiosReadableError.response?.status === 401) {
        //   alert("Unauthorized");
        // } else {
        //   alert("Login Failed");
        // }
        // errRef.current.focus();
      },
    });
  };

  //// Persistent login - trusted device
  const togglePersistHandler = () => {
    setPersist((prev) => !prev);
  };
  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  ////jsx
  return (
    <Fragment>
      {isLoading && <Loading />}
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Formik
        initialValues={formikInitialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitHandler}
        validateOnMount={true}
      >
        {(formik: FormikProps<ILoginFormValues>) => {
          ////jsx
          return (
            <Form>
              <div className="w-96 h-screen flex flex-col justify-center items-center">
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
                    isFocusOn={true}
                    formik={formik}
                  />
                </div>
                <div className="w-full p-2">
                  <FormikControl
                    control="input"
                    type="password"
                    label="Password:"
                    name="password"
                    placeholder={"tu wpisz hasło"}
                    additionalClass=""
                    formik={formik}
                  />
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="persist"
                    onChange={togglePersistHandler}
                    checked={persist}
                  />
                  <label htmlFor="persist" className="ml-2">
                    Zaufane urządzenie
                  </label>
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

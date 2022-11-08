import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import React, { Fragment } from "react";
import * as Yup from "yup";
import { TeamFormValues } from "../utils/types/app.types";
import FormikControl from "./formik-components/FormikControl";
import Button from "./ui/Button";
import { usePostData, useGetData } from "../hooks/useCRUDHelperWithCredentials";
import Loading from "./ui/Loading";
import { AxiosError } from "axios";
import useNotification from "../hooks/useNotification";
import Notification from "./ui/Notification";

const Team = () => {
  ////vars
  const { notification, showNotification } = useNotification();
  const { mutate, isLoading: isLoadingPost } = usePostData("/api/team");
  const { data, isLoading: isLoadingGet } = useGetData("/api/team", ["teams"]);

  ////formik
  const formikInitialValues: TeamFormValues = {
    teamName: "",
    place: "",
    teamCrest: null,
  };
  const validationSchema = Yup.object({
    teamName: Yup.string().required("Nazwa drużyny jest wymagana."),
    place: Yup.string().required("Lokalizacja drużyny jest wymagana."),
    teamCrest: Yup.mixed()
      .test({
        name: "required",
        message: "Herb drużyny jest wymagany.",
        test: (value) => value !== null,
      })
      .test({
        name: "type",
        message: "Herb drużyny musi być plikiem PNG.",
        test: (value) => value && value.type === "image/png",
      }),
  });
  const onSubmitHandler = async (
    values: TeamFormValues,
    formikHelpers: FormikHelpers<TeamFormValues>
  ) => {
    console.log(values);

    const formData: any = new FormData();
    formData.append("teamName", values.teamName);
    formData.append("place", values.place);
    formData.append("teamCrest", values.teamCrest);

    mutate(formData, {
      onSuccess: (data) => {
        console.log(data.data);
        showNotification({
          status: "success",
          title: "Dodano drużynę.",
          message: `Dodana drużyna:\nnazwa: ${data.data.result.teamName}\nmiejsce: ${data.data.result.place}\nherb: ${data.data.result.teamCrest}`,
        });
        formikHelpers.setSubmitting(false);
        formikHelpers.resetForm();
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
            title: "Brak dostępu.",
            message: "Brak dostępu do zasobów.",
          });
        }
      },
    });
  };

  ////jsx
  return (
    <Fragment>
      {(isLoadingPost || isLoadingGet) && <Loading />}
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <div className="pb-12">
        <p>Lista druzyn:</p>
      </div>
      <hr />
      <Formik
        initialValues={formikInitialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitHandler}
        validateOnMount={true}
      >
        {(formik: FormikProps<TeamFormValues>) => {
          console.log(formik);

          ////jsx
          return (
            <Form>
              <div className="w-96 h-screen flex flex-col justify-center items-center">
                <div className="pt-12">
                  <span className="font-bold uppercase text-xl">
                    Wprowadź drużynę
                  </span>
                </div>
                <div className="w-full p-2">
                  <FormikControl
                    control="input"
                    type="text"
                    label="Nazwa drużyny:"
                    name="teamName"
                    placeholder={"tu wpisz nazwę drużyny"}
                    additionalClass=""
                    isFocusOn={true}
                    formik={formik}
                  />
                </div>
                <div className="w-full p-2">
                  <FormikControl
                    control="input"
                    type="text"
                    label="Lokalizacja drużyny:"
                    name="place"
                    placeholder={"tu wpisz lokalizację drużyny"}
                    additionalClass=""
                    formik={formik}
                  />
                </div>

                {/* <div className="w-full p-2">
                  <FormikControl
                    control="image"
                    label="Application image"
                    name="appInfo.appImageFull"
                    additionalText="(Provide only one file. Formats supported: .jpg .jpeg .png
                      .gif. Remember -> Here PhoneImage with 345x701px resolution.)"
                    placeholder=""
                    additionalClass=""
                    formik={formik}
                  />
                </div> */}

                <div className="w-full p-2">
                  <input
                    id="teamCrest"
                    name="teamCrest"
                    type="file"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "teamCrest",
                        event?.currentTarget?.files?.[0]
                      );
                    }}
                  />
                </div>

                <div className="pt-6">
                  <Button
                    disabled={!formik.isValid || formik.isSubmitting}
                    type="submit"
                    color="white"
                    bgColor={`bg-appButton`}
                    text="Wyślij"
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

export default Team;

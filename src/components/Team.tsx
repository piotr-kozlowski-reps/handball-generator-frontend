import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import React, { Fragment, useEffect, useState } from "react";
import * as Yup from "yup";
import { TeamFormValues, TeamInterface } from "../utils/types/app.types";
import FormikControl from "./formik-components/FormikControl";
import Button from "./ui/Button";
import {
  usePostData,
  useGetData,
  useDeleteData,
} from "../hooks/useCRUDHelperWithCredentials";
import Loading from "./ui/Loading";
import { AxiosError } from "axios";
import useNotification from "../hooks/useNotification";
import Notification from "./ui/Notification";
import { NOTIFICATIONS } from "../utils/notifications/predefinedNotifications";
import { useLocation, useNavigate } from "react-router-dom";

import { QUERIES_DATA } from "../utils/queriesData/predefinedQueriesData";
const QUERY_KEY = QUERIES_DATA.TEAMS.queryKey;
const ADDRESS = QUERIES_DATA.TEAMS.address;

const Team = () => {
  ////vars
  const [teams, setTeams] = useState<TeamInterface[]>([]);
  const { notification, showNotification } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();

  const { mutate: postForm, isLoading: isLoadingPost } = usePostData(
    ADDRESS,
    QUERY_KEY,
    (error) => {
      showNotification({
        status: "error",
        title: "Błąd",
        message: `Nie udało się utworzyć drużyny. Error: ${error}`,
      });
    }
  );
  const { mutate: deleteTeam, isLoading: isDeletingPost } = useDeleteData(
    ADDRESS,
    QUERY_KEY,
    (error) => {
      showNotification({
        status: "error",
        title: "Błąd",
        message: `Nie udało się skasować drużyny. Error: ${error}`,
      });
    }
  );
  const { data, isLoading: isLoadingGet } = useGetData(
    ADDRESS,
    QUERY_KEY,
    location
  );

  useEffect(() => {
    if (data) {
      console.log({ data });

      setTeams([...data.data]);
    }
  }, [data]);

  ////formik
  const formikInitialValues: TeamFormValues = {
    teamName: "",
    place: "",
    teamCrestImage: null,
  };
  const validationSchema = Yup.object({
    teamName: Yup.string().required("Nazwa drużyny jest wymagana."),
    place: Yup.string().required("Lokalizacja drużyny jest wymagana."),
    teamCrestImage: Yup.mixed()
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
    const formData: any = new FormData();
    formData.append("teamName", values.teamName);
    formData.append("place", values.place);
    formData.append("teamCrestImage", values.teamCrestImage);

    postForm(formData, {
      onSuccess: (data) => {
        console.log(data.data);
        showNotification({
          status: "success",
          title: "Dodano drużynę.",
          message: `Dodana drużyna:\nnazwa: ${data.data.result.teamName}\nmiejsce: ${data.data.result.place}\nherb: ${data.data.result.teamCrestImage}`,
        });
        formikHelpers.setSubmitting(false);
        formikHelpers.resetForm();
      },
      onError: (error) => {
        const axiosReadableError: AxiosError = error as AxiosError;
        if (axiosReadableError.response?.status === 401) {
          showNotification(NOTIFICATIONS.NOT_LOGGED);
        } else {
          showNotification({
            status: "error",
            title: "Błąd",
            message: `Nie udało się utworzyć drużyny. \n Error: ${axiosReadableError.response?.data}`,
          });
        }
      },
    });
  };

  ////jsx
  return (
    <Fragment>
      {(isLoadingPost || isLoadingGet || isDeletingPost) && <Loading />}
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <div className="pb-12">
        <p>Lista druzyn:</p>
        <ul>
          {teams.length > 0 ? (
            teams.map((team) => (
              <li
                key={team.teamName}
                className="p-4 m-1 bg-appInFocus bg-opacity-10"
              >
                <p>
                  nazwa druzyny:{" "}
                  <span className="font-bold">{team.teamName}</span>
                </p>
                <p>
                  miejsce: <span className="font-bold">{team.place}</span>
                </p>
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/${team.teamCrestImage}`}
                  alt={team.teamName}
                  width="50"
                  height="50"
                />
                <button
                  className="bg-appInFocus p-1 text-white"
                  onClick={() => {
                    deleteTeam(team._id);
                  }}
                >
                  delete
                </button>
              </li>
            ))
          ) : (
            <p>Nie ma żadnych drużyn</p>
          )}
        </ul>
      </div>
      <hr />
      <Formik
        initialValues={formikInitialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitHandler}
        validateOnMount={true}
      >
        {(formik: FormikProps<TeamFormValues>) => {
          // console.log(formik);

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

                <div className="w-full p-2">
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
                </div>

                {/* <div className="w-full p-2">
                  <input
                    id="teamCrestImage"
                    name="teamCrestImage"
                    type="file"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "teamCrestImage",
                        event?.currentTarget?.files?.[0]
                      );
                    }}
                  />
                </div> */}

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

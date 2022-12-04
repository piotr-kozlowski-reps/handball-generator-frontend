import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import React, { Fragment, useEffect, useState } from "react";
import * as Yup from "yup";
import { ITeamFormValues, ITeam } from "../../utils/types/app.types";
import FormikControl from "../../components/formik-components/FormikControl";
import Button from "../../components/ui/Button";
import {
  usePostData,
  useGetData,
  useDeleteData,
} from "../../hooks/useCRUDHelperWithCredentials";
import Loading from "../../components/ui/Loading";
import { AxiosError } from "axios";
import useNotification from "../../hooks/useNotification";
import Notification from "../../components/ui/Notification";
import { NOTIFICATIONS } from "../../utils/notifications/predefinedNotifications";
import { useLocation, useNavigate } from "react-router-dom";

import { QUERIES_DATA } from "../../utils/queriesData/predefinedQueriesData";
import {
  SendImagesStrategy,
  SendOnlyImage,
} from "../../utils/sendImagesStrategy";
const QUERY_KEY = QUERIES_DATA.TEAMS.queryKey;
const ADDRESS = QUERIES_DATA.TEAMS.address;

const Team = () => {
  ////vars
  const [teams, setTeams] = useState<ITeam[]>([]);
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
      setTeams([...data.data]);
    }
  }, [data]);

  ////formik
  const formikInitialValues: ITeamFormValues = {
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
        test: (value) => {
          console.log({ value });
          return value && value[0].type === "image/png";
        },
      }),
  });
  const onSubmitHandler = async (
    values: ITeamFormValues,
    formikHelpers: FormikHelpers<ITeamFormValues>
  ) => {
    const formData: any = new FormData();
    formData.append("teamName", values.teamName);
    formData.append("place", values.place);
    formData.append(
      "teamCrestImage",
      SendImagesStrategy.prepareImageOrArrayOfImages(SendOnlyImage).sendImage(
        values.teamCrestImage
      )
    );

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
        setTeams([]);
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
        {(formik: FormikProps<ITeamFormValues>) => {
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

                <div className="w-full p-2">
                  <FormikControl
                    control="image"
                    label="Herb drużyny"
                    name="teamCrestImage"
                    additionalText="(Provide only one file. Formats supported: .jpg .jpeg .png
                      .gif. Remember -> Here PhoneImage with 345x701px resolution.)"
                    placeholder=""
                    additionalClass=""
                    maxFiles={1}
                    accept={{ "image/png": [".png"] }}
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

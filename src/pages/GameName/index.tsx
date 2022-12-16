import React, { useState, useEffect, Fragment } from "react";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import useNotification from "../../hooks/useNotification";
import {
  usePostData,
  useGetData,
  useDeleteData,
} from "../../hooks/useCRUDHelperWithCredentials";
import * as Yup from "yup";
import Notification from "../../components/ui/Notification";
import FormikControl from "../../components/formik-components/FormikControl";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import { AxiosError } from "axios";
import { NOTIFICATIONS } from "../../utils/notifications/predefinedNotifications";
import { useLocation, useNavigate } from "react-router-dom";
import { IGameNameFormValues, IGameName } from "../../utils/types/app.types";

import { QUERIES_DATA } from "../../utils/queriesData/predefinedQueriesData";
import deleteDistHelper from "../../utils/deleteDistHelper";
import {
  SendImagesStrategy,
  SendOnlyImage,
} from "../../utils/sendImagesStrategy";
const QUERY_KEY = QUERIES_DATA.GAME_NAMES.queryKey;
const ADDRESS = QUERIES_DATA.GAME_NAMES.address;

const GameName = () => {
  ////vars
  const [gameNames, setGameNames] = useState<IGameName[]>([]);
  const { notification, showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  ////CRUD
  const { mutate: postGameName, isLoading: isLoadingPost } = usePostData(
    ADDRESS,
    QUERY_KEY,
    () => {} //TODO:
  );
  const { mutate: deleteGameName, isLoading: isDeletingPost } = useDeleteData(
    ADDRESS,
    QUERY_KEY,
    (error) => {
      showNotification({
        status: "error",
        title: "Błąd",
        message: `Nie udało się skasować rozgrywek. Error: ${error}`,
      });
    }
  );
  const { data, isLoading: isLoadingGet } = useGetData(
    ADDRESS,
    QUERY_KEY,
    location
  );

  ////effects
  useEffect(() => {
    if (data) {
      console.log(data);
      setGameNames([...data.data]);
    }
  }, [data]);

  ////formik
  const formikInitialValues: IGameNameFormValues = {
    gameName: "",
    gameImage: null,
  };
  const validationSchema = Yup.object({
    gameName: Yup.string().required("Nazwa rozgrywek jest wymagana."),
    gameImage: Yup.mixed()
      .test({
        name: "required",
        message: "Grafika rozgrywek jest wymagana.",
        test: (value) => value !== null,
      })
      .test({
        name: "type",
        message: "Grafika rozgrywek musi być plikiem PNG/JPG/JPEG.",
        test: (value) => {
          let areImagesCorrect = true;
          const files = value as File[];
          files.forEach((file) => {
            areImagesCorrect =
              areImagesCorrect &&
              (file?.type === "image/png" ||
                file?.type === "image/jpg" ||
                file?.type === "image/jpeg");
          });
          return areImagesCorrect;
        },
      }),
  });

  const onSubmitHandler = async (
    values: IGameNameFormValues,
    formikHelpers: FormikHelpers<IGameNameFormValues>
  ) => {
    console.log(values);

    const formData: any = new FormData();
    formData.append("gameName", values.gameName);
    formData.append(
      "gameImage",
      SendImagesStrategy.prepareImageOrArrayOfImages(SendOnlyImage).sendImage(
        values.gameImage
      )
    );
    postGameName(formData, {
      onSuccess: (data) => {
        console.log(data.data);
        showNotification({
          status: "success",
          title: "Dodano nazwę rozgrywek.",
          message: `Dodany nazwa rozgrywek:\nnazwa: ${data.data.result.gameName}\nobrazek: ${data.data.result.gameImage}`,
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
            message: `Nie udało się utworzyć rozgrywek. \n Error: ${axiosReadableError.response?.data}`,
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
        <p>Lista rodzajów rozgrywek:</p>
        <ul>
          {gameNames?.length ? (
            gameNames.map((gameName) => (
              <li
                key={gameName.gameName}
                className="p-4 m-1 bg-appInFocus bg-opacity-10"
              >
                <p>
                  nazwa rozgrywek:
                  <span className="font-bold">{gameName.gameName}</span>
                </p>
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/${deleteDistHelper(
                    gameName.gameImage
                  )}`}
                  alt={gameName.gameName}
                  width="200"
                  height="200"
                />
                <button
                  className="bg-appInFocus p-1 text-white"
                  onClick={() => {
                    deleteGameName(gameName._id);
                  }}
                >
                  delete
                </button>
              </li>
            ))
          ) : (
            <p>Nie ma żadnych rodzajów rozgrywek.</p>
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
        {(formik: FormikProps<IGameNameFormValues>) => {
          ////jsx
          return (
            <Form>
              <div className="w-96 h-screen flex flex-col justify-center items-center">
                <div className="pt-12">
                  <span className="font-bold uppercase text-xl">
                    Wprowadź rodzaj rozgrywek
                  </span>
                </div>
                <div className="w-full p-2">
                  <FormikControl
                    control="input"
                    type="text"
                    label="Nazwa rodzaju rozgrywek:"
                    name="gameName"
                    placeholder={"tu wpisz nazwę rodzaju rozgrywek"}
                    additionalClass=""
                    isFocusOn={true}
                    formik={formik}
                  />
                </div>

                {/* <div className="w-full p-2"> */}
                {/* <input
                    id="gameImage"
                    name="gameImage"
                    type="file"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "gameImage",
                        event?.currentTarget?.files?.[0]
                      );
                    }}
                  />
                </div> */}

                <div className="w-full p-2">
                  <FormikControl
                    control="image"
                    label="Pliki rodzaju rozgrywek"
                    name="gameImage"
                    // additionalText="(Provide only one file. Formats supported: .jpg .jpeg .png
                    //   .gif. Remember -> Here PhoneImage with 345x701px resolution.)"
                    placeholder=""
                    additionalClass=""
                    maxFiles={100}
                    accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif"] }}
                    formik={formik}
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

export default GameName;

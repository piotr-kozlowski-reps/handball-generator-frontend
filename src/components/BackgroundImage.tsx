import React, { useState, useEffect, Fragment } from "react";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import useNotification from "../hooks/useNotification";
import {
  usePostData,
  useGetData,
  useDeleteData,
} from "../hooks/useCRUDHelperWithCredentials";
import * as Yup from "yup";
import Notification from "./ui/Notification";
import FormikControl from "./formik-components/FormikControl";
import Button from "./ui/Button";
import Loading from "./ui/Loading";
import { AxiosError } from "axios";
import { NOTIFICATIONS } from "../utils/notifications/predefinedNotifications";
import {
  BackgroundImageFormValues,
  BackgroundImageInterface,
} from "../utils/types/app.types";
import useRefreshToken from "../hooks/useRefreshToken";
import { useLocation, useNavigate } from "react-router-dom";
import { QUERIES_DATA } from "../utils/queriesData/predefinedQueriesData";

const QUERY_KEY = QUERIES_DATA.BACKGROUND_IMAGES.queryKey;
const ADDRESS = QUERIES_DATA.BACKGROUND_IMAGES.address;

const BackgroundImage = () => {
  ////vars
  const [backgroundImages, setBackgroundImages] = useState<
    BackgroundImageInterface[]
  >([]);
  const { notification, showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const { mutate: postBackgroundImage, isLoading: isLoadingPost } = usePostData(
    ADDRESS,
    QUERY_KEY,
    (error) => {
      showNotification({
        status: "error",
        title: "Błąd",
        message: `Nie udało się utworzyć paska sponsorów. Error: ${error}`,
      });
    }
  );
  const { mutate: deleteBackgroundImage, isLoading: isDeletingPost } =
    useDeleteData(ADDRESS, QUERY_KEY, (error) => {
      showNotification({
        status: "error",
        title: "Błąd",
        message: `Nie udało się tła. Error: ${error}`,
      });
    });
  const { data, isLoading: isLoadingGet } = useGetData(
    ADDRESS,
    QUERY_KEY,
    location
  );

  ////effects
  useEffect(() => {
    if (data) {
      setBackgroundImages([...data.data]);
    }
  }, [data]);

  ////formik
  const formikInitialValues: BackgroundImageFormValues = {
    backgroundImageName: "",
    backgroundImage: null,
  };
  const validationSchema = Yup.object({
    backgroundImageName: Yup.string().required("Nazwa tła jest wymagana."),
    backgroundImage: Yup.mixed()
      .test({
        name: "required",
        message: "Obrazek tła jest wymagany.",
        test: (value) => value !== null,
      })
      .test({
        name: "type",
        message: "Obrazek tła musi być plikiem PNG/JPG/JPEG.",
        test: (value) =>
          value &&
          (value.type === "image/png" ||
            value.type === "image/jpg" ||
            value.type === "image/jpeg"),
      }),
  });
  const onSubmitHandler = async (
    values: BackgroundImageFormValues,
    formikHelpers: FormikHelpers<BackgroundImageFormValues>
  ) => {
    const formData: any = new FormData();
    formData.append("backgroundImageName", values.backgroundImageName);
    formData.append("backgroundImage", values.backgroundImage);
    postBackgroundImage(formData, {
      onSuccess: (data) => {
        console.log(data.data);
        showNotification({
          status: "success",
          title: "Dodano obrazek tła.",
          message: `Dodany obrazek tła:\nnazwa: ${data.data.result.backgroundImageName}\nobrazek: ${data.data.result.backgroundImage}`,
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
            message: `Nie udało się utworzyć tła. \n Error: ${axiosReadableError.response?.data}`,
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
        <p>Lista obrazków tła:</p>
        <ul>
          {backgroundImages?.length ? (
            backgroundImages.map((background) => (
              <li
                key={background.backgroundImageName}
                className="p-4 m-1 bg-appInFocus bg-opacity-10"
              >
                <p>
                  nazwa tła:
                  <span className="font-bold">
                    {background.backgroundImageName}
                  </span>
                </p>
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/${background.backgroundImageThumbnail}`}
                  alt={background.backgroundImageName}
                  width="200"
                  height="200"
                />
                <button
                  className="bg-appInFocus p-1 text-white"
                  onClick={() => {
                    deleteBackgroundImage(background._id);
                  }}
                >
                  delete
                </button>
              </li>
            ))
          ) : (
            <p>Nie ma żadnych plików tła.</p>
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
        {(formik: FormikProps<BackgroundImageFormValues>) => {
          ////jsx
          return (
            <Form>
              <div className="w-96 h-screen flex flex-col justify-center items-center">
                <div className="pt-12">
                  <span className="font-bold uppercase text-xl">
                    Wprowadź tło/tła (później)
                  </span>
                </div>
                <div className="w-full p-2">
                  <FormikControl
                    control="input"
                    type="text"
                    label="Nazwa tła:"
                    name="backgroundImageName"
                    placeholder={"tu wpisz nazwę pliku tła"}
                    additionalClass=""
                    isFocusOn={true}
                    formik={formik}
                  />
                </div>

                <div className="w-full p-2">
                  <input
                    id="backgroundImage"
                    name="backgroundImage"
                    type="file"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "backgroundImage",
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

export default BackgroundImage;

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
import {
  IBackgroundImageFormValues,
  IBackgroundImage,
} from "../../utils/types/app.types";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useLocation, useNavigate } from "react-router-dom";
import { QUERIES_DATA } from "../../utils/queriesData/predefinedQueriesData";

const QUERY_KEY = QUERIES_DATA.BACKGROUND_IMAGES.queryKey;
const ADDRESS = QUERIES_DATA.BACKGROUND_IMAGES.address;

const BackgroundImage = () => {
  ////vars
  const [backgroundImages, setBackgroundImages] = useState<IBackgroundImage[]>(
    []
  );
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
  const formikInitialValues: IBackgroundImageFormValues = {
    backgroundImageName: "",
    backgroundImages: null,
  };
  const validationSchema = Yup.object({
    backgroundImageName: Yup.string().required("Nazwa tła jest wymagana."),
    backgroundImages: Yup.mixed()
      .test({
        name: "required",
        message: "Obrazek/obrazki tła są wymagane.",
        test: (value) => value !== null,
      })
      .test({
        name: "type",
        message: "Obrazki tła muszą być plikami PNG/JPG/JPEG.",
        test: (value) => {
          console.log({ value });

          if (!value) return false;
          console.log("isArray: ", Array.isArray(value));

          let isImageCorrect = true;
          value.forEach((file: File) => {
            isImageCorrect =
              isImageCorrect &&
              (file.type === "image/png" ||
                file.type === "image/jpg" ||
                file.type === "image/jpeg");
          });

          console.log({ isImageCorrect });

          return isImageCorrect;
        },
      }),
  });

  const onSubmitHandler = async (
    values: IBackgroundImageFormValues,
    formikHelpers: FormikHelpers<IBackgroundImageFormValues>
  ) => {
    console.log({ values });

    const formData: any = new FormData();
    formData.append("backgroundImageName", values.backgroundImageName);
    if (values.backgroundImages && Array.isArray(values.backgroundImages)) {
      values.backgroundImages.forEach((image) => {
        formData.append("backgroundImages", image);
      });
    }

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
        {(formik: FormikProps<IBackgroundImageFormValues>) => {
          console.log({ formik });

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
                    multiple
                    id="backgroundImages"
                    name="backgroundImages"
                    type="file"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "backgroundImages",
                        event?.currentTarget?.files
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
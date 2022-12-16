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
import deleteDistHelper from "../../utils/deleteDistHelper";

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
    // backgroundImageName: "",
    backgroundImages: null,
  };
  const validationSchema = Yup.object({
    // backgroundImageName: Yup.string().required("Nazwa tła jest wymagana."),
    backgroundImages: Yup.mixed()
      .test("required", "Obrazek/obrazki tła są wymagane.", (value) => {
        console.log("required test: ", { value });
        return value !== null;
      })
      .test("type", "Obrazki tła muszą być plikami PNG/JPG/JPEG.", (value) => {
        console.log("type test: ", { value });

        let areImagesCorrect = true;
        const files = value as File[] | null;
        console.log({ files });

        if (!files) areImagesCorrect = false;
        if (files) {
          files.forEach((file) => {
            areImagesCorrect =
              areImagesCorrect &&
              (file?.type === "image/png" ||
                file?.type === "image/jpg" ||
                file?.type === "image/jpeg");
          });
        }

        console.log(areImagesCorrect);

        console.log({ files });
        console.log({ areImagesCorrect });

        return areImagesCorrect;
      }),
  });

  const onSubmitHandler = async (
    values: IBackgroundImageFormValues,
    formikHelpers: FormikHelpers<IBackgroundImageFormValues>
  ) => {
    console.log("onSubmitHandler");
    console.log({ values });

    const formData: any = new FormData();

    //files
    const fileList = values.backgroundImages;
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        // const file = fileList.item(i);
        const file = fileList[i];
        formData.append("backgroundImages", file);
      }
    }

    console.log({ fileList });

    postBackgroundImage(formData, {
      onSuccess: (data) => {
        console.log(data.data);
        showNotification({
          status: "success",
          title: "Dodano obrazek/obrazki tła.",
          message: `Dodany obrazek/obrazki: ${data.data.processedImages.map(
            (image: any) => `\n${image.backgroundImageName}`
          )}\\nNie dodany obrazek/obrazki: ${data.data.unprocessedImages.map(
            (image: any) => `\n${image.fileName} bo: ${image.error}`
          )}`,
        });
        setBackgroundImages([]);
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
                  src={`${process.env.REACT_APP_BACKEND_URL}/${deleteDistHelper(
                    background.backgroundImageThumbnail
                  )}`}
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
                    Wprowadź tło/tła
                  </span>
                </div>
                {/* <div className="w-full p-2">
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
                </div> */}

                <div className="w-full p-2">
                  <FormikControl
                    control="image"
                    label="Pliki tła"
                    name="backgroundImages"
                    // additionalText="(Provide only one file. Formats supported: .jpg .jpeg .png
                    //   .gif. Remember -> Here PhoneImage with 345x701px resolution.)"
                    placeholder=""
                    additionalClass=""
                    maxFiles={100}
                    accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif"] }}
                    formik={formik}
                  />
                </div>

                {/* <div className="w-full p-2">
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

export default BackgroundImage;

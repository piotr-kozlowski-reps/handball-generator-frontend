import React, { useState, useEffect, Fragment } from "react";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import useNotification from "../../hooks/useNotification";
import {
  ISponsorBarFormValues,
  SponsorBarInterface,
} from "../../utils/types/app.types";
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

import { QUERIES_DATA } from "../../utils/queriesData/predefinedQueriesData";
import deleteDistHelper from "../../utils/deleteDistHelper";
const QUERY_KEY = QUERIES_DATA.SPONSORS_BARS.queryKey;
const ADDRESS = QUERIES_DATA.SPONSORS_BARS.address;

const Sponsors = () => {
  ////vars
  const [sponsorsBars, setSponsorsBars] = useState<SponsorBarInterface[]>([]);
  const { notification, showNotification } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: postSponsorBar, isLoading: isLoadingPost } = usePostData(
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
  const { mutate: deleteSponsorBar, isLoading: isDeletingPost } = useDeleteData(
    ADDRESS,
    QUERY_KEY,
    (error) => {
      showNotification({
        status: "error",
        title: "Błąd",
        message: `Nie udało się skasować paska sponsorów. Error: ${error}`,
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
      setSponsorsBars([...data.data]);
    }
  }, [data]);

  ////formik
  const formikInitialValues: ISponsorBarFormValues = {
    barName: "",
    sponsorsBarImage: null,
  };
  const validationSchema = Yup.object({
    barName: Yup.string().required("Nazwa paska sponsorów jest wymagana."),
    sponsorsBarImage: Yup.mixed()
      .test({
        name: "required",
        message: "Obrazek paska sponsorów jest wymagany.",
        test: (value) => value !== null,
      })
      .test({
        name: "type",
        message: "Obrazek paska sponsorów musi być plikiem PNG/JPG/JPEG.",
        test: (value) =>
          value &&
          (value.type === "image/png" ||
            value.type === "image/jpg" ||
            value.type === "image/jpeg"),
      }),
  });

  const onSubmitHandler = async (
    values: ISponsorBarFormValues,
    formikHelpers: FormikHelpers<ISponsorBarFormValues>
  ) => {
    // console.log(values);

    const formData: any = new FormData();
    formData.append("barName", values.barName);
    formData.append("sponsorsBarImage", values.sponsorsBarImage);
    postSponsorBar(formData, {
      onSuccess: (data) => {
        // console.log(data.data);
        showNotification({
          status: "success",
          title: "Dodano pasek sponsorów.",
          message: `Dodany pasek sponsorów:\nnazwa: ${data.data.result.teamName}\nmiejsce: ${data.data.result.place}\nherb: ${data.data.result.teamCrestImage}`,
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
            message: `Nie udało się utworzyć paska sponsorów. \n Error: ${axiosReadableError.response?.data}`,
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
        <p>Lista pasków sponsorów:</p>
        <ul>
          {sponsorsBars.length > 0 ? (
            sponsorsBars.map((sponsorBar) => (
              <li
                key={sponsorBar.barName}
                className="p-4 m-1 bg-appInFocus bg-opacity-10"
              >
                <p>
                  nazwa paska sponsorów:{" "}
                  <span className="font-bold">{sponsorBar.barName}</span>
                </p>
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/${deleteDistHelper(
                    sponsorBar.sponsorsBarImage
                  )}`}
                  alt={sponsorBar.barName}
                  width="250"
                  height="80"
                />
                <button
                  className="bg-appInFocus p-1 text-white"
                  onClick={() => {
                    deleteSponsorBar(sponsorBar._id);
                  }}
                >
                  delete
                </button>
              </li>
            ))
          ) : (
            <p>Nie ma żadnych pasków sponsorów</p>
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
        {(formik: FormikProps<ISponsorBarFormValues>) => {
          console.log(formik);

          ////jsx
          return (
            <Form>
              <div className="w-96 h-screen flex flex-col justify-center items-center">
                <div className="pt-12">
                  <span className="font-bold uppercase text-xl">
                    Wprowadź pasek sponsorów
                  </span>
                </div>
                <div className="w-full p-2">
                  <FormikControl
                    control="input"
                    type="text"
                    label="Nazwa paska sponsorów:"
                    name="barName"
                    placeholder={"tu wpisz nazwę paska sponsorów"}
                    additionalClass=""
                    isFocusOn={true}
                    formik={formik}
                  />
                </div>

                <div className="w-full p-2">
                  <input
                    id="sponsorsBarImage"
                    name="sponsorsBarImage"
                    type="file"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "sponsorsBarImage",
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

export default Sponsors;

// import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
// import React, { Fragment, useEffect, useState } from "react";

// import { TeamFormValues, TeamInterface } from "../utils/types/app.types";
// import FormikControl from "./formik-components/FormikControl";
// import Button from "./ui/Button";
// import {
//   usePostData,
//   useGetData,
//   useDeleteData,
// } from "../hooks/useCRUDHelperWithCredentials";
// import Loading from "./ui/Loading";
// import { AxiosError } from "axios";
// import useNotification from "../hooks/useNotification";
// import Notification from "./ui/Notification";

// const QUERY_KEY = ["teams"];

// const Team = () => {
//
//
//
//

// };

// export default Team;

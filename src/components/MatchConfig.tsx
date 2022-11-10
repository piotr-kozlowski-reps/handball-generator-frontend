import React, { useState, useEffect, Fragment } from "react";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import useNotification from "../hooks/useNotification";
import * as Yup from "yup";
import Notification from "./ui/Notification";
import FormikControl from "./formik-components/FormikControl";
import Button from "./ui/Button";
import Loading from "./ui/Loading";
import { NOTIFICATIONS } from "../utils/notifications/predefinedNotifications";
import { useLocation, useNavigate } from "react-router-dom";
import { QUERIES_DATA } from "../utils/queriesData/predefinedQueriesData";
import {
  BackgroundImageInterface,
  DropDownOptions,
  GameNameInterface,
  MatchConfigFormValues,
  SponsorBarInterface,
  TeamInterface,
} from "../utils/types/app.types";
import { useGetData } from "../hooks/useCRUDHelperWithCredentials";

const QUERY_KEY_GAMENAMES = QUERIES_DATA.GAME_NAMES.queryKey;
const ADDRESS_GAMENAMES = QUERIES_DATA.GAME_NAMES.address;

const QUERY_KEY_SPONSORSBARS = QUERIES_DATA.SPONSORS_BARS.queryKey;
const ADDRESS_SPONSORSBARS = QUERIES_DATA.SPONSORS_BARS.address;

const QUERY_KEY_TEAMS = QUERIES_DATA.TEAMS.queryKey;
const ADDRESS_TEAMS = QUERIES_DATA.TEAMS.address;

const MatchConfig = () => {
  ////vars
  const [gameNames, setGameNames] = useState<GameNameInterface[]>([]);
  const [sponsorsBars, setSponsorsBars] = useState<SponsorBarInterface[]>([]);
  const [teams, setTeams] = useState<TeamInterface[]>([]);

  const { notification, showNotification } = useNotification();
  const location = useLocation();

  ////data fetching
  //game names
  const { data: fetchedGameNames, isLoading: isLoadingGameNames } = useGetData(
    ADDRESS_GAMENAMES,
    QUERY_KEY_GAMENAMES,
    location
  );
  useEffect(() => {
    if (fetchedGameNames) {
      setGameNames([...fetchedGameNames.data]);
    }
  }, [fetchedGameNames]);
  //sponsors bars
  const { data: fetchedSponsorsBars, isLoading: isLoadingSponsorsBars } =
    useGetData(ADDRESS_SPONSORSBARS, QUERY_KEY_SPONSORSBARS, location);
  useEffect(() => {
    if (fetchedSponsorsBars) {
      setSponsorsBars([...fetchedSponsorsBars.data]);
    }
  }, [fetchedSponsorsBars]);
  //teams
  const { data: fetchedTeams, isLoading: isLoadingTeams } = useGetData(
    ADDRESS_TEAMS,
    QUERY_KEY_TEAMS,
    location
  );
  useEffect(() => {
    if (fetchedTeams) {
      setTeams([...fetchedTeams.data]);
    }
  }, [fetchedTeams]);

  ////data for selects
  //game names
  const optionsGameNames: DropDownOptions[] = gameNames.map((gameName) => {
    return { key: gameName.gameName, value: gameName._id };
  });
  const dropDownGameNamesOptions: DropDownOptions[] = [
    { key: "wybierz rodzaj rozgrywek:", value: "" },
    ...optionsGameNames,
  ];
  //sponsors bars
  const optionsSponsorsBars: DropDownOptions[] = sponsorsBars.map(
    (sponsorBar) => {
      return { key: sponsorBar.barName, value: sponsorBar._id };
    }
  );
  const dropDownSponsorsBarsOptions: DropDownOptions[] = [
    { key: "bez belki sponsora", value: "" },
    ...optionsSponsorsBars,
  ];
  //teams
  const optionsTeams: DropDownOptions[] = teams.map((team) => {
    return { key: team.teamName, value: team._id };
  });
  const dropDownTeamsOptions: DropDownOptions[] = [
    { key: "wybierz drużynę przeciwnika:", value: "" },
    ...optionsTeams,
  ];

  ////formik
  const formikInitialValues: MatchConfigFormValues = {
    date: "",
    time: "",
    gameName: "",
    sponsorsBar: null,
    isHost: true,
    opponent: "",
    differentPlace: "",
  };
  const validationSchema = Yup.object({
    date: Yup.string().required("Podaj datę."),
    time: Yup.string().required("Podaj godzinę meczu."),
    gameName: Yup.string().required("Podaj rodzaj rozgrywek."),
    opponent: Yup.string().required("Podaj nazwę przeciwnika."),
    // backgroundImage: Yup.mixed()
    //   .test({
    //     name: "required",
    //     message: "Obrazek tła jest wymagany.",
    //     test: (value) => value !== null,
    //   })
    //   .test({
    //     name: "type",
    //     message: "Obrazek tła musi być plikiem PNG/JPG/JPEG.",
    //     test: (value) =>
    //       value &&
    //       (value.type === "image/png" ||
    //         value.type === "image/jpg" ||
    //         value.type === "image/jpeg"),
    //   }),
  });
  const cancelFormHandler = (formik: FormikProps<MatchConfigFormValues>) => {
    formik.resetForm();
  };
  const onSubmitHandler = async (
    values: MatchConfigFormValues,
    formikHelpers: FormikHelpers<MatchConfigFormValues>
  ) => {
    console.log(values);

    // const formData: any = new FormData();
    // formData.append("backgroundImageName", values.backgroundImageName);
    // formData.append("backgroundImage", values.backgroundImage);
    // postBackgroundImage(formData, {
    //   onSuccess: (data) => {
    //     console.log(data.data);
    //     showNotification({
    //       status: "success",
    //       title: "Dodano obrazek tła.",
    //       message: `Dodany obrazek tła:\nnazwa: ${data.data.result.backgroundImageName}\nobrazek: ${data.data.result.backgroundImage}`,
    //     });
    //     formikHelpers.setSubmitting(false);
    //     formikHelpers.resetForm();
    //   },
    //   onError: (error) => {
    //     const axiosReadableError: AxiosError = error as AxiosError;
    //     if (
    //       axiosReadableError.response?.status === 401 ||
    //       axiosReadableError.response?.status === 400
    //     ) {
    //       showNotification(NOTIFICATIONS.NOT_LOGGED);
    //     } else {
    //       showNotification(NOTIFICATIONS.NO_ACCESS);
    //     }
    //     navigate("/login", { state: { from: location }, replace: true });
    //   },
    // });
  };

  ////jsx
  return (
    <Fragment>
      {(isLoadingGameNames || isLoadingSponsorsBars) && <Loading />}
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      {/* <div className="pb-12">
        <p>Konfiguracja meczu:</p>
      </div> */}
      <Formik
        initialValues={formikInitialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitHandler}
        validateOnMount={true}
      >
        {(formik: FormikProps<MatchConfigFormValues>) => {
          ////jsx
          return (
            <Form>
              <div className="w-96 h-screen flex flex-col justify-center items-center">
                <div className="pt-12">
                  <span className="font-bold uppercase text-xl">
                    Konfiguracja meczu
                  </span>
                </div>
                <div className="w-full p-2">
                  <FormikControl
                    control="input"
                    type="text"
                    label="Data:"
                    name="date"
                    placeholder={"tu wpisz datę meczu"}
                    additionalClass=""
                    isFocusOn={true}
                    formik={formik}
                  />
                </div>

                <div className="w-full p-2">
                  <FormikControl
                    control="input"
                    type="text"
                    label="Godzina:"
                    name="time"
                    placeholder={"tu wpisz godzinę meczu"}
                    additionalClass=""
                    formik={formik}
                  />
                </div>

                <div className="w-full pr-6">
                  <FormikControl
                    control="select"
                    label="Rodzaj rozgrywek: "
                    name="gameName"
                    additionalClass=""
                    formik={formik}
                    options={dropDownGameNamesOptions}
                  />
                </div>

                <div className="w-full pr-6">
                  <FormikControl
                    control="select"
                    label="Belka sponsorów: "
                    name="sponsorsBar"
                    additionalClass=""
                    formik={formik}
                    options={dropDownSponsorsBarsOptions}
                  />
                </div>

                <div className="w-full pr-6">
                  <FormikControl
                    control="select"
                    label="Górnik dospodarzem: "
                    name="isHost"
                    additionalClass=""
                    formik={formik}
                    options={[
                      { key: "tak", value: "true" },
                      { key: "nie", value: "false" },
                    ]}
                  />
                </div>

                <div className="w-full pr-6">
                  <FormikControl
                    control="select"
                    label="Przeciwnik: "
                    name="opponent"
                    additionalClass=""
                    formik={formik}
                    options={dropDownTeamsOptions}
                  />
                </div>

                <hr />

                <div className="w-full p-2">
                  <FormikControl
                    control="input"
                    type="text"
                    label="Inne miejsce:"
                    name="differentPlace"
                    placeholder={"tu (ewentualną) inną lokalizację meczu"}
                    additionalClass=""
                    formik={formik}
                  />
                </div>

                {/* <div className="w-full p-2">
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
                  <Button
                    type="button"
                    color="white"
                    bgColor={`bg-appButton`}
                    text="Wyczyść"
                    borderRadius="10px"
                    size="md"
                    additionalClass="px-7 ml-3"
                    onClick={cancelFormHandler.bind(null, formik)}
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

export default MatchConfig;

// };

// export default BackgroundImage;

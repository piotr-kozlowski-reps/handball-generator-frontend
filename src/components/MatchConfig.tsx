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
  IDropDownOptions,
  IGameName,
  IMatchConfigFormValues,
  IMatchConfig,
  SponsorBarInterface,
  ITeam,
} from "../utils/types/app.types";
import { useGetData } from "../hooks/useCRUDHelperWithCredentials";
import useAxiosPrivateJSON from "../hooks/useAxiosPrivateJSON";
import useLocalStorage from "../hooks/useLocalStorage";

const QUERY_KEY_GAMENAMES = QUERIES_DATA.GAME_NAMES.queryKey;
const ADDRESS_GAMENAMES = QUERIES_DATA.GAME_NAMES.address;

const QUERY_KEY_SPONSORSBARS = QUERIES_DATA.SPONSORS_BARS.queryKey;
const ADDRESS_SPONSORSBARS = QUERIES_DATA.SPONSORS_BARS.address;

const QUERY_KEY_TEAMS = QUERIES_DATA.TEAMS.queryKey;
const ADDRESS_TEAMS = QUERIES_DATA.TEAMS.address;

const MatchConfig = () => {
  ////vars
  const [gameNames, setGameNames] = useState<IGameName[]>([]);
  const [sponsorsBars, setSponsorsBars] = useState<SponsorBarInterface[]>([]);
  const [teams, setTeams] = useState<ITeam[]>([]);

  const axiosPrivate = useAxiosPrivateJSON();

  const { notification, showNotification } = useNotification();
  const location = useLocation();
  const [matchConfig, setMatchConfig] = useLocalStorage("matchConfig");

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
  //one game name

  ////data for selects
  //game names
  const optionsGameNames: IDropDownOptions[] = gameNames.map((gameName) => {
    return { key: gameName.gameName, value: gameName._id };
  });
  const dropDownGameNamesOptions: IDropDownOptions[] = [
    { key: "wybierz rodzaj rozgrywek:", value: "" },
    ...optionsGameNames,
  ];
  //sponsors bars
  const optionsSponsorsBars: IDropDownOptions[] = sponsorsBars.map(
    (sponsorBar) => {
      return { key: sponsorBar.barName, value: sponsorBar._id };
    }
  );
  const dropDownSponsorsBarsOptions: IDropDownOptions[] = [
    { key: "bez belki sponsora", value: "" },
    ...optionsSponsorsBars,
  ];
  //teams
  const optionsTeams: IDropDownOptions[] = teams.map((team) => {
    return { key: team.teamName, value: team._id };
  });
  const dropDownTeamsOptions: IDropDownOptions[] = [
    { key: "wybierz drużynę przeciwnika:", value: "" },
    ...optionsTeams,
  ];

  ////formik
  const formikInitialValues: IMatchConfigFormValues = {
    date: "",
    time: "",
    gameName: "",
    sponsorsBar: "",
    isHost: true,
    opponent: "",
    differentPlace: "",
  };
  const validationSchema = Yup.object({
    date: Yup.string().required("Podaj datę."),
    time: Yup.string().required("Podaj godzinę meczu."),
    gameName: Yup.string().required("Podaj rodzaj rozgrywek."),
    opponent: Yup.string().required("Podaj nazwę przeciwnika."),
  });
  const cancelFormHandler = (formik: FormikProps<IMatchConfigFormValues>) => {
    formik.resetForm();
  };
  const onSubmitHandler = async (
    values: IMatchConfigFormValues,
    formikHelpers: FormikHelpers<IMatchConfigFormValues>
  ) => {
    console.log(values);

    let fetchedGameName;
    let fetchedOpponent;
    let sponsorsBarOpponent;
    try {
      fetchedGameName = await axiosPrivate.get(
        `/api/game-name/${values.gameName}`
      );
      fetchedOpponent = await axiosPrivate.get(`/api/team/${values.opponent}`);
      if (values.sponsorsBar) {
        sponsorsBarOpponent = await axiosPrivate.get(
          `/api/sponsors-bar/${values.sponsorsBar}`
        );
      }
    } catch (error) {
      console.error();
    }

    if (!fetchedGameName || !fetchedOpponent) {
      showNotification({
        title: "Brak danych",
        message: "Nie udało się pobrać danych z serwera, spróbuj ponownie.",
        status: "error",
      });
      return;
    }
    const finalObjectToBeSavedInLocalStorage: IMatchConfig = {
      date: values.date,
      time: values.time,
      gameName: fetchedGameName.data.gameName,
      sponsorsBar: sponsorsBarOpponent?.data?.sponsorsBar
        ? sponsorsBarOpponent.data.sponsorsBar
        : "",
      isHost: values.isHost,
      opponent: fetchedOpponent.data.team,
      differentPlace: values.differentPlace,
    };

    setMatchConfig(finalObjectToBeSavedInLocalStorage);
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
        {(formik: FormikProps<IMatchConfigFormValues>) => {
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
                    placeholder={
                      "(opcjonalnie) tu wpisz inną lokalizację meczu"
                    }
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

import React, { Fragment, useEffect, useState } from "react";
import * as Yup from "yup";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useGetData } from "../../hooks/useCRUDHelperWithCredentials";
import Loading from "../../components/ui/Loading";
import { IMatchDayFormValues, IMatchDay } from "../../utils/types/app.types";
import { useLocation } from "react-router-dom";
import axios from "axios";
import useImage from "use-image";

import { QUERIES_DATA } from "../../utils/queriesData/predefinedQueriesData";
import StageMatchDay from "../../components/konva/StageMatchDay";
const QUERY_KEY = QUERIES_DATA.BACKGROUND_IMAGES.queryKey;
const ADDRESS = QUERIES_DATA.BACKGROUND_IMAGES.address;

const MatchDay = () => {
  ////vars
  const [backgrounds, setBackgrounds] = useState<IMatchDay[]>([]);
  const location = useLocation();
  const [testImage, setTestImage] = useState<any>();

  const [imageBackground] = useImage(
    `${process.env.REACT_APP_BACKEND_URL}/images/background-images/sklad_uklad_lista_wyjazd___20221211-215310.jpg`
  );

  // useEffect(() => {
  //   const fetchImage = async () => {
  //     const image = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}/images/background-images/sklad_uklad_lista_wyjazd___20221211-215310.jpg`,
  //       { withCredentials: true }
  //     );

  //     setTestImage(image);
  //   };

  //   fetchImage();

  //   // fetch(
  //   //   `${process.env.REACT_APP_BACKEND_URL}/images/background-images/sklad_uklad_lista_wyjazd___20221211-215310.jpg`,
  //   //   {
  //   //     headers: {
  //   //       "Access-Control-Allow-Origin": "http://127.0.0.1:5000",
  //   //     },
  //   //   }
  //   // )
  //   //   .then((res) => res.blob())
  //   //   .then((blob) => {
  //   //     console.log({ blob });
  //   //     const file = new File([blob], "image", { type: blob.type });
  //   //     console.log({ file });
  //   //   });
  // }, []);

  // console.log(imageBackground);

  // await convertImageIntoBase64(image_podklad, (base64String) => {
  //   console.log();

  // })

  console.log({ testImage });

  ////CRUD
  const { data, isLoading: isLoadingGet } = useGetData(
    ADDRESS,
    QUERY_KEY,
    location
  );

  ////effects
  useEffect(() => {
    if (data) {
      console.log(data);
      setBackgrounds([...data.data]);
    }
  }, [data]);

  ////formik
  const formikInitialValues: IMatchDayFormValues = {
    background: "",
  };
  const validationSchema = Yup.object({
    background: Yup.string().required("Wybierz tło."),
  });
  const onSubmitHandler = async (
    values: IMatchDayFormValues,
    formikHelpers: FormikHelpers<IMatchDayFormValues>
  ) => {
    console.log(values);
  };

  ////logic
  const handleSave: any = (stage: HTMLCanvasElement) => {
    const uri = stage.toDataURL();
    console.log(uri);
  };

  ////jsx
  return (
    <Fragment>
      <div className="">
        <StageMatchDay
          // imageBackground={imageBackground}
          imageBackground={imageBackground}
          mainText={`DZIEŃ MECZOWY !`}
          date="08.11.2022"
          hour="15:30"
          takesPlace="STADION MIEJSKI W KALISZU"
          // handleSave={handleSave}
        />
      </div>
    </Fragment>
  );
};

export default MatchDay;

//   ////jsx
//   return (
//     <Fragment>
//       {(isLoadingPost || isLoadingGet || isDeletingPost) && <Loading />}
//       {notification && (
//         <Notification
//           status={notification.status}
//           title={notification.title}
//           message={notification.message}
//         />
//       )}
//       <div className="pb-12">
//         <p>Lista obrazków tła:</p>
//         <ul>
//           {backgroundImages?.length ? (
//             backgroundImages.map((background) => (
//               <li
//                 key={background.backgroundImageName}
//                 className="p-4 m-1 bg-appInFocus bg-opacity-10"
//               >
//                 <p>
//                   nazwa tła:
//                   <span className="font-bold">
//                     {background.backgroundImageName}
//                   </span>
//                 </p>
//                 <img
//                   src={`${process.env.REACT_APP_BACKEND_URL}/${background.backgroundImage}`} //TODO: finalnie .backgroundImageThumbnail
//                   alt={background.backgroundImageName}
//                   width="200"
//                   height="200"
//                 />
//                 <button
//                   className="bg-appInFocus p-1 text-white"
//                   onClick={() => {
//                     deleteBackgroundImage(background._id);
//                   }}
//                 >
//                   delete
//                 </button>
//               </li>
//             ))
//           ) : (
//             <p>Nie ma żadnych plików tła.</p>
//           )}
//         </ul>
//       </div>
//       <hr />
//       <Formik
//         initialValues={formikInitialValues}
//         validationSchema={validationSchema}
//         onSubmit={onSubmitHandler}
//         validateOnMount={true}
//       >
//         {(formik: FormikProps<BackgroundImageFormValues>) => {
//           ////jsx
//           return (
//             <Form>
//               <div className="w-96 h-screen flex flex-col justify-center items-center">
//                 <div className="pt-12">
//                   <span className="font-bold uppercase text-xl">
//                     Wprowadź tło/tła (później)
//                   </span>
//                 </div>
//                 <div className="w-full p-2">
//                   <FormikControl
//                     control="input"
//                     type="text"
//                     label="Nazwa tła:"
//                     name="backgroundImageName"
//                     placeholder={"tu wpisz nazwę pliku tła"}
//                     additionalClass=""
//                     isFocusOn={true}
//                     formik={formik}
//                   />
//                 </div>

//                 <div className="w-full p-2">
//                   <input
//                     id="backgroundImage"
//                     name="backgroundImage"
//                     type="file"
//                     onChange={(event) => {
//                       formik.setFieldValue(
//                         "backgroundImage",
//                         event?.currentTarget?.files?.[0]
//                       );
//                     }}
//                   />
//                 </div>

//                 <div className="pt-6">
//                   <Button
//                     disabled={!formik.isValid || formik.isSubmitting}
//                     type="submit"
//                     color="white"
//                     bgColor={`bg-appButton`}
//                     text="Wyślij"
//                     borderRadius="10px"
//                     size="md"
//                     additionalClass="px-7"
//                   />
//                 </div>
//               </div>
//             </Form>
//           );
//         }}
//       </Formik>
//     </Fragment>
//   );
// };

// export default BackgroundImage;

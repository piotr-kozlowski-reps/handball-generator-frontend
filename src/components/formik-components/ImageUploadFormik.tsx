import React, {
  useState,
  useCallback,
  Fragment,
  ComponentType,
  useEffect,
} from "react";
import { ErrorMessage, Field, FormikProps } from "formik";
import { FileRejection, useDropzone } from "react-dropzone";
import TextErrorFormik from "./TextErrorFormik";
import noImagePicked from "../../images/noimage.jpg";
import ImagesThumbnailsPreview from "./ImagesThumbnailsPreview";
import useNotification from "../../hooks/useNotification";

////func
const getNestedObject = (obj: any, path: any): any => {
  if (typeof obj === "undefined" || obj === null) return null;
  if (typeof path === "string") path = path.split(".");

  if (path.length === 0) return obj;
  return getNestedObject(obj[path[0]], path.slice(1));
};

interface Props {
  label: string;
  name: string;
  additionalClass: string;
  isFocusOn?: boolean;
  maxFiles?: number;
  formik: FormikProps<any>;
}

export type IImageWithPreview = File & { preview: string };

const ImageUploadFormik = (props: Props) => {
  //vars
  const { label, name, additionalClass, maxFiles, formik } = props;
  const { notification, showNotification } = useNotification();

  const [files, setFiles] = useState<IImageWithPreview[] | null>(null);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[] | null>(
    null
  );
  const [previewUrl, setPreviewUrl] = useState();

  //useDropZone - start
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      console.log("onDrop");
      console.log({ acceptedFiles });
      console.log({ fileRejections });

      if (acceptedFiles.length > 0) {
        setFiles(
          acceptedFiles?.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          )
        );
      }

      setRejectedFiles(fileRejections);
    },
    []
  );

  ////useDropZone - start
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    fileRejections,
    isFileDialogActive,
  } = useDropzone({
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif"] },
    maxFiles: maxFiles || 1,
    onDrop,
  });
  //useDropZone - end

  const setFileInFormik = useCallback(() => {
    formik.setFieldValue(name, files);
  }, [files]);

  const clearErrorInFormik = useCallback(() => {
    formik.setFieldError(name, undefined);
  }, [files]);

  const isErrorPresent = getNestedObject(formik.errors, name);
  const isTouched = getNestedObject(formik.touched, name);

  /** sets field touched when dialog active or anything dropped on hot area */
  useEffect(() => {
    if (isDragActive || isFileDialogActive) formik.setFieldTouched(name);
  }, [isDragActive, isFileDialogActive]);

  /** clears data uris to avoid memory leaks*/
  useEffect(() => {
    return () => files?.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  /** shows error message if any rejected files appeared */
  useEffect(() => {
    if (rejectedFiles && rejectedFiles?.length > 0) {
      const message = rejectedFiles[0].errors[0].message;

      showNotification({
        status: "error",
        title: "Błąd.",
        message: message,
      });
    }
  }, [rejectedFiles]);

  ////jsx
  return (
    <Fragment>
      <div
        className={`w-full flex items-center ${
          additionalClass ? additionalClass : ""
        }`}
      >
        <div className="flex flex-col justify-start min-w-full">
          <div>
            <ImagesThumbnailsPreview files={files} />
          </div>

          <div className="flex justify-start  min-w-full">
            <div>
              <label htmlFor={name} className="text-lg">
                {label}
              </label>
            </div>
            <div>
              <div
                {...getRootProps({
                  className: isDragActive
                    ? "w-96 h-32 p-4 border-dotted border-[#333] border-4 m-2 bg-light-gray"
                    : isErrorPresent && isTouched
                    ? "w-96 h-32 p-4 border-dotted border-[#aaa] border-2 m-2 bg-appError"
                    : "w-96 h-32 p-4 border-dotted border-[#aaa] border-2 m-2 bg-light-gray",
                })}
              >
                <input {...getInputProps()} />
                <p>drop zone</p>
              </div>
            </div>
            <div className="text-xs font-semibold text-appError">
              <ErrorMessage
                name={name}
                component={
                  TextErrorFormik as string | ComponentType<{}> | undefined
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ImageUploadFormik;

//  <div className={props.additionalClass ? props.additionalClass : ""}>
//    <label
//      htmlFor={name}
//      className={`details ${additionalClass ? additionalClass : ""}`}
//    >
//      {label}
//    </label>
//    <div className={`w-full h-52`}>
//      <ImagesThumbnailsPreview />
//      {/* <div
//             className={
//               isErrorPresent && isTouched
//                 ? "thumbnail-admin-form thumbnail-error"
//                 : "thumbnail-admin-form "
//             }
//           >
//             <img
//               width="100"
//               height="80"
//               src={previewUrl ? previewUrl : noImagePicked}
//               alt={previewUrl && files ? files[0].name : "no file selected"} //TODO: all files
//               className={isErrorPresent && isTouched ? "image-error" : ""}
//             ></img>
//           </div> */}

//      {/* <Field id={name} name={name} style={{ display: "none" }}>
//           <input
//             id={name}
//             name={name}
//             type="file"
//             // onChange={setImageInFormikHandler}
//             // onChange={pickHandler} //
//             // onBlur={onBlur} //
//             style={{ display: "none" }}
//             className={isErrorPresent && isTouched ? "input-invalid" : ""}
//             accept=".jpg,.png,.jpeg,.gif"
//           />
//            </Field> */}

//  </div>;

// import { Field, ErrorMessage, useFormikContext } from "formik";
// import TextErrorFormik from "./TextErrorFormik";

// import noImagePicked from "../../images/nima.jpg";

// ////func
// const getNestedObject = (obj, path) => {
//   if (typeof obj === "undefined" || obj === null) return null;
//   if (typeof path === "string") path = path.split(".");

//   if (path.length === 0) return obj;
//   return getNestedObject(obj[path[0]], path.slice(1));
// };

// const ImageUploadFormik = (props) => {
//   ////vars
//   const formikProps = useFormikContext();
//   const { label, name, errors, touched, additionalClass, ...rest } = props;

//   const [file, setFile] = useState();
//   const [rejectedFile, setRejectedFile] = useState();
//   const [previewUrl, setPreviewUrl] = useState();
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [modalContent, setModalContent] = useState(
//     "Some error occurred during file validation. Try again, please."
//   );

//   //useDropZone - start
//   const onDrop = (acceptedFile, rejectedFile) => {
//     if (acceptedFile.length === 1) {
//       setFile(acceptedFile[0]);
//       setRejectedFile(null);
//       return;
//     }

//     if (rejectedFile.length === 1) {
//       setRejectedFile(rejectedFile[0]);
//       return;
//     }

//     if (rejectedFile.length > 1) {
//       setRejectedFile(rejectedFile);
//       return;
//     }
//   };

//   const {
//     getRootProps,
//     getInputProps,
//     isDragActive,
//     isFocused,
//     acceptedFiles,
//     fileRejections,
//   } = useDropzone({
//     accept: ["image/png", "image/jpg", "image/jpeg", "image/gif"],
//     maxFiles: 1,
//     onDrop,
//   });
//   //useDropZone - end

//   ////func
//   const setErrorAndTouched = () => {
//     formikProps.setFieldTouched(name, true);
//     formikProps.setFieldError(name, "Error");
//   };

//   const setIsTouchedWhenFocused = () => {
//     formikProps.setFieldTouched(name, true);
//   };

//   const setFileInFormik = useCallback(() => {
//     formikProps.setFieldValue(name, file);
//   }, [file]);

//   const clearErrorInFormik = useCallback(() => {
//     formikProps.setFieldError(name, null);
//   }, [file]);

//   const showModalWhenNeeded = () => {
//     setShowConfirmModal(true);

//     const timer = () => {
//       setTimeout(() => {
//         setShowConfirmModal(false);
//       }, 2500);
//     };
//     timer();

//     clearTimeout(timer);
//   };

//   //effects
//   //set file thumbnail url if in updateForm mode and
//   //TODO: teraz z cloudinary to raczej inaczej
//   useEffect(() => {
//     let urlResult = "";
//     let fieldPathRestored = "";

//     const nameChangedToThumbnail =
//       changeDesiredFieldNameToAppropriateThumbnail(name);
//     if (nameChangedToThumbnail.includes(".")) {
//       const urlElements = nameChangedToThumbnail.split(".");
//       urlElements.forEach((el, index) => {
//         if (isNaN(el)) fieldPathRestored += `.${el}`;
//         if (!isNaN(el)) fieldPathRestored += `[${el}]`;
//       });
//       urlResult += eval(`formikProps.values${fieldPathRestored}`);
//     }
//     if (!nameChangedToThumbnail.includes(".")) {
//       urlResult += `${formikProps.values[nameChangedToThumbnail]}`;
//     }
//     if (
//       urlResult.endsWith("undefined") ||
//       urlResult.endsWith(process.env.REACT_APP_BACKEND_URL)
//     )
//       return;
//     setPreviewUrl(urlResult);
//   }, []);

//   // useEffect(() => {
//   // let urlResult = "";
//   // let fieldPathRestored = "";
//   // const nameChangedToThumbnail =
//   //   changeDesiredFieldNameToAppropriateThumbnail(name);
//   // if (nameChangedToThumbnail.includes(".")) {
//   //   const urlElements = nameChangedToThumbnail.split(".");
//   //   urlElements.forEach((el, index) => {
//   //     if (isNaN(el)) fieldPathRestored += `.${el}`;
//   //     if (!isNaN(el)) fieldPathRestored += `[${el}]`;
//   //   });
//   //   urlResult += eval(`formikProps.values${fieldPathRestored}`);
//   // }
//   // if (!nameChangedToThumbnail.includes(".")) {
//   //   urlResult += `${formikProps.values[nameChangedToThumbnail]}`;
//   // }
//   // if (
//   //   urlResult.endsWith("/undefined") ||
//   //   urlResult.endsWith(process.env.REACT_APP_BACKEND_URL)
//   // )
//   //   return;
//   // setPreviewUrl(urlResult);
//   // }, []);

//   //if file changes and is valid, makes prev and sets "previewUrl" and sets Formik Value and clears error
//   useEffect(() => {
//     if (!file) return;
//     const fileReader = new FileReader();
//     fileReader.onload = () => {
//       setPreviewUrl(fileReader.result);
//     };
//     fileReader.readAsDataURL(file);

//     setFileInFormik();
//     clearErrorInFormik();
//   }, [file, name, setFileInFormik]);

//   //if (no proper file and rejected file) sets error and isTouched - to show validation error
//   //if (is proper file and rejected file) sets modal for a moment saying
//   useEffect(() => {
//     const isFileAlready = file && file.path !== "" ? true : false;
//     const isRejectedFile = rejectedFile;

//     if (!isFileAlready && isRejectedFile) {
//       setErrorAndTouched();
//       return;
//     }

//     if (isFileAlready && isRejectedFile) {
//       if (Array.isArray(rejectedFile)) {
//         setModalContent(`You can only provide one file.`);
//       }

//       if (!Array.isArray(rejectedFile)) {
//         setModalContent(`Formats supported:  .jpg  .jpeg  .png  .gif`);
//       }

//       showModalWhenNeeded();
//       return;
//     }
//   }, [rejectedFile, file]);

//   //if focused - set isTouched in Formik
//   useEffect(() => {
//     if (isFocused) setIsTouchedWhenFocused();
//   }, [isFocused]);

//   const isErrorPresent = getNestedObject(formikProps.errors, name);
//   const isTouched = getNestedObject(formikProps.touched, name);

//   // console.log({ noImagePicked });
//   // console.log({ previewUrl });
//   // console.log(previewUrl ? previewUrl : noImagePicked);

//   ////jsx
//   return (
//     <Fragment>
//       <Modal
//         header="Information"
//         headerClass="modal-header-mine__show-header-login"
//         show={showConfirmModal}
//         // onCancel={hideLoginModal}
//       >
//         <Separator additionalClass="py-bottom2_5" />
//         <div className="center">
//           <p>{modalContent}</p>
//         </div>
//       </Modal>
//       <div className={props.additionalClass ? props.additionalClass : ""}>
//         <label
//           htmlFor={name}
//           className={`details ${additionalClass ? additionalClass : ""}`}
//         >
//           {label}
//         </label>
//         <div className={`input-box-image`}>
//           <div
//             className={
//               isErrorPresent && isTouched
//                 ? "thumbnail-admin-form thumbnail-error"
//                 : "thumbnail-admin-form "
//             }
//           >
//             <img
//               width="100"
//               height="80"
//               src={previewUrl ? previewUrl : noImagePicked}
//               alt={previewUrl && file ? file.name : "no file selected"}
//               className={isErrorPresent && isTouched ? "image-error" : ""}
//             ></img>
//           </div>

//           <Field id={name} name={name} style={{ display: "none" }}>
//             {/* <input
//               id={name}
//               name={name}
//               type="file"
//               // {...rest}
//               // onChange={setImageInFormikHandler}
//               // onChange={pickHandler}
//               // onBlur={onBlur}
//               style={{ display: "none" }}
//               className={isErrorPresent && isTouched ? "input-invalid" : ""}
//               accept=".jpg,.png,.jpeg,.gif"
//             /> */}
//           </Field>

//           <div
//             className={
//               isDragActive ? "drop-zone drop-zone-active" : "drop-zone"
//             }
//             {...getRootProps()}
//           >
//             <input {...getInputProps()} />
//             <div className="drop-zone-middle-zone">
//               <p className="center drop-zone-text">
//                 {isDragActive
//                   ? "DROP FILE HERE"
//                   : !previewUrl
//                   ? "DROP FILE HERE OR CLICK TO OPEN FILE BROWSER"
//                   : "DROP FILE HERE OR CLICK TO CHANGE CHOSEN FILE"}
//                 <br />
//                 <span className="small-text">
//                   {props.additionalText
//                     ? props.additionalText
//                     : `(Provide only one file. Formats supported: .jpg .jpeg .png
//                   .gif)`}
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>
//         <ErrorMessage name={name} component={TextErrorFormik} />
//       </div>
//     </Fragment>
//   );
// };

// export default ImageUploadFormik;

import { FormikProps } from "formik";
import React from "react";
import { LoginFormValues } from "../../utils/types/app.types";
import ImageUploadFormik from "./ImageUploadFormik";
import InputFormik from "./InputFormik";

interface Props {
  control: "input" | "image";
  type?: React.HTMLInputTypeAttribute | undefined;
  label: string;
  name: string;
  placeholder: string;
  additionalClass: string;
  isFocusOn?: boolean;
  additionalText?: string;
  formik: FormikProps<any>;
}

const FormikControl = (props: Props) => {
  ////vars
  const { control, ...rest } = props;

  switch (control) {
    case "input":
      return <InputFormik {...rest} />;

    case "image":
      return <ImageUploadFormik {...rest} />;

    default:
      return null;
  }
};

export default FormikControl;

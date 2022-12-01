import { FormikProps } from "formik";
import React from "react";
import {
  IDropDownOptions,
  ILoginFormValues,
} from "../../utils/types/app.types";
import ImageUploadFormik from "./ImageUploadFormik";
import InputFormik from "./InputFormik";
import SelectFormik from "./SelectFormik";

interface Props {
  control: "input" | "image" | "select";
  type?: React.HTMLInputTypeAttribute | undefined;
  label: string;
  name: string;
  placeholder?: string;
  additionalClass: string;
  isFocusOn?: boolean;
  additionalText?: string;
  options?: IDropDownOptions[];
  maxFiles?: number;
  formik: FormikProps<any>;
}

const FormikControl = (props: Props) => {
  ////vars
  const { control, ...rest } = props;

  switch (control) {
    case "input":
      return <InputFormik placeholder={props.placeholder!} {...rest} />;

    case "image":
      return <ImageUploadFormik placeholder={props.placeholder!} {...rest} />;

    case "select":
      return <SelectFormik options={props.options!} {...rest} />;

    default:
      return null;
  }
};

export default FormikControl;

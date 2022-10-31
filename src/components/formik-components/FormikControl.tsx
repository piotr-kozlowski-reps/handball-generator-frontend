import { FormikProps } from "formik";
import React from "react";
import { LoginFormValues } from "../../utils/types/app.types";
import InputFormik from "./InputFormik";

interface Props {
  control: "input";
}

const FormikControl = (props: any) => {
  ////vars
  const { control, ...rest } = props;

  switch (control) {
    case "input":
      return <InputFormik {...rest} />;

    default:
      return null;
  }
};

export default FormikControl;

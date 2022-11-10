import React, { ComponentType, Fragment, useState } from "react";
import { Field, ErrorMessage, FormikProps } from "formik";
import TextErrorFormik from "./TextErrorFormik";
import { DropDownOptions } from "../../utils/types/app.types";
// import { useStateContext } from "../../context/ContextProvider";

////func
// const getNestedObject: any = (obj: any, path: string | string[]) => {
//   if (typeof obj === "undefined" || obj === null) return null;
//   if (typeof path === "string") path = path.split(".");

//   if (path.length === 0) return obj;
//   return getNestedObject(obj[path[0]], path.slice(1));

interface Props {
  label: string;
  name: string;
  additionalClass: string;
  isFocusOn?: boolean;
  options: DropDownOptions[];
  formik: FormikProps<any>;
}
// };

const SelectFormik = (props: Props) => {
  ////vars
  const {
    label,
    name,
    options,
    // errors,
    // placeholder,
    // touched,
    additionalClass,
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  // const optionsList = options as DropDownProductOptions[];

  ////jsx
  return (
    <Fragment>
      <div
        className={`w-full mt-3 pr-6 flex items-center ${
          additionalClass ? additionalClass : ""
        }`}
      >
        <label htmlFor={name} className={` text-lg `}>
          {label}
        </label>
        <Field id={name} name={name} {...rest}>
          {(formik: any) => {
            ////focus/blur adding classes logic
            const focusInHandler = () => {
              setIsFocused(true);
            };
            const blurHandler = () => {
              setIsFocused(false);
            };

            if (typeof window !== "undefined") {
              const inputEl = document?.getElementById(name);

              if (inputEl) {
                inputEl.onblur = blurHandler;
              }
            }

            ////vars
            const { field, form } = formik;
            const { value, onChange, onBlur } = field;
            const { errors, touched } = form;

            // const isErrorPresent = getNestedObject(errors, name);
            // const isTouched = getNestedObject(touched, name);
            const isErrorPresent: undefined | string = errors[name];
            const isTouched: undefined | boolean = touched[name];

            ////jsx
            return (
              <select
                id={name}
                name={name}
                // placeholder={placeholder}
                value={value}
                {...rest}
                onChange={(val) => onChange(val)}
                // className={`group-focus:border-b-2 transition-all ease-out duration-200 min-w-full ml-2 p-2 bg-main-bg dark:bg-main-dark-bg outline-none rounded-sm border-b-2 border-[#fafbfb] dark:border-[#555] ${
                //   isErrorPresent && isTouched
                //     ? "bg-red-100 text-black dark:bg-red-700 dark:text-white"
                //     : ""
                // }`}
                className={`group-focus:border-b-2 transition-all ease-out duration-200 min-w-full ml-2 p-2 bg-main-bg dark:bg-main-dark-bg outline-none rounded-sm border-b-2 border-[#fafbfb] dark:border-[#555] ${
                  isFocused ? "border-appInFocus" : ""
                } ${
                  isErrorPresent && isTouched
                    ? "bg-appError text-black dark:bg-red-700 dark:text-white"
                    : ""
                }`}
                // style={}
                onFocus={focusInHandler}
                onBlur={onBlur}
              >
                {options.map((option) => {
                  return (
                    <option key={option.value} value={option.value}>
                      {option.key}
                    </option>
                  );
                })}
              </select>
            );
          }}
        </Field>
      </div>
      <div className="text-xs font-semibold text-appError">
        <ErrorMessage
          name={name}
          component={TextErrorFormik as string | ComponentType<{}> | undefined}
        />
      </div>
    </Fragment>
  );
};

export default SelectFormik;

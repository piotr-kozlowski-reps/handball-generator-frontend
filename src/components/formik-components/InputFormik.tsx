import React, { ComponentType, Fragment, useState } from "react";
import { Field, ErrorMessage } from "formik";
import TextErrorFormik from "./TextErrorFormik";

const InputFormik = (props: any) => {
  ////vars
  const {
    label,
    name,
    errors,
    placeholder,
    touched,
    additionalClass,
    ...rest
  } = props;
  const [isFocused, setIsFocused] = useState(false);

  ////jsx
  return (
    <Fragment>
      <div
        className={`w-full flex items-center ${
          additionalClass ? additionalClass : ""
        }`}
      >
        <label htmlFor={name} className="text-lg">
          {label}
        </label>
        <Field id={name} name={name} {...rest}>
          {(formik: any) => {
            ////vars
            const { field, form } = formik;
            const { value, onChange, onBlur } = field;
            const { errors, touched } = form;
            const isErrorPresent: undefined | string = errors[name];
            const isTouched: undefined | boolean = touched[name];

            const focusInHandler = () => {
              setIsFocused(true);
            };

            const blurHandler = () => {
              setIsFocused(false);
            };
            if (typeof window !== "undefined") {
              const inputEl = document.getElementById(name);

              if (inputEl) {
                inputEl.onblur = blurHandler;
              }
            }

            ////jsx
            return (
              <input
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                {...rest}
                onChange={(val) => onChange(val)}
                className={`group-focus:border-b-2 transition-all ease-out duration-200 min-w-full ml-2 p-2 bg-appMainBackground dark:bg-appMainDarkBackground outline-none rounded-sm border-b-2 border-[#fafbfb] dark:border-[#555] ${
                  isFocused ? "border-appInFocus" : ""
                } ${
                  isErrorPresent && isTouched
                    ? "bg-appError text-black dark:bg-red-700 dark:text-white"
                    : ""
                }`}
                onFocus={focusInHandler}
                onBlur={onBlur}
              />
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

export default InputFormik;

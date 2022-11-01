import React, {
  ComponentType,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import { Field, ErrorMessage, FormikProps } from "formik";
import TextErrorFormik from "./TextErrorFormik";

interface Props {
  label: string;
  name: string;
  placeholder: string;
  additionalClass: string;
  isFocusOn?: boolean;
  formik: FormikProps<any>;
}

const InputFormik = (props: Props) => {
  ////vars
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    label,
    name,
    // errors,
    placeholder,
    // touched,
    additionalClass,
    isFocusOn,
    formik,

    ...rest
  } = props;
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocusOn) inputRef?.current?.focus();
  }, [isFocusOn]);

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
                ref={inputRef}
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

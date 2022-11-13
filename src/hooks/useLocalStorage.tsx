// import { useState, useEffect } from "react";

// const getLocalValue = (key: string, initValue: any) => {
//   //SSR Next.js
//   if (typeof window === "undefined") return initValue;

//   //if there is a value
//   if (localStorage.getItem(key) === null || undefined) {
//     return initValue;
//   }
//   const localValue = JSON.parse(localStorage.getItem(key)!);
//   if (localValue) return localValue;

//   //return result of a function
//   if (initValue instanceof Function) return initValue();

//   return initValue;
// };

// const useLocalStorage = (key: string, initValue: any) => {
//   const [value, setValue] = useState(() => {
//     return getLocalValue(key, initValue);
//   });

//   useEffect(() => {
//     localStorage.setItem(key, JSON.stringify(value));
//   }, [key, value]);

//   return [value, setValue];
// };

// export default useLocalStorage;

import { type } from "@testing-library/user-event/dist/type";
import React, { useState, useEffect } from "react";

type ReturnType<T> = [
  T | undefined,
  React.Dispatch<React.SetStateAction<T | undefined>>
];

const useLocalStorage = <T,>(key: string, initValue?: T): ReturnType<T> => {
  const [state, setState] = useState<T | undefined>(() => {
    if (!initValue) return;
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : initValue;
    } catch (err) {
      return initValue;
    }
  });

  useEffect(() => {
    if (state) {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (err) {
        console.error(err);
      }
    }
  }, [state]);

  return [state, setState];
};

export default useLocalStorage;

import React, { Fragment } from "react";
import { useAuthentication } from "./hooks/useAuthentication";
import Login from "./components/login/Login";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
  ////vars
  const { isLoggedIn } = useAuthentication();

  ////jsx
  return (
    <QueryClientProvider client={queryClient}>
      <Fragment>
        {!isLoggedIn && <Login />}
        <ReactQueryDevtools initialIsOpen={false} position="bottom-left" />
      </Fragment>
    </QueryClientProvider>
  );
}

export default App;

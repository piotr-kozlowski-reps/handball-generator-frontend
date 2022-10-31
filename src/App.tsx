import React, { Fragment } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Layout from "./components/Layout";
import Unauthorized from "./components/Unauthorized";
import Missing from "./components/Missing";

function App() {
  ////vars

  ////jsx
  // return <Fragment>{!isLoggedIn && <Login />}</Fragment>;
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* free accessed routes */}
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        {/* we want to protect these routes */}
        {/* <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
            <Route path="editor" element={<Editor />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="admin" element={<Admin />} />
          </Route>

          <Route
            element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}
          >
            <Route path="lounge" element={<Lounge />} />
          </Route>
        </Route> */}

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;

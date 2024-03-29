import React, { Fragment } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Layout from "./components/Layout";
import Unauthorized from "./components/Unauthorized";
import Missing from "./components/Missing";
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import Home from "./components/Home";
import Teams from "./pages/Teams/index";
import BackgroundImage from "./pages/BackgroundImage";
import Sponsors from "./pages/SponsorsBar";
import GameName from "./pages/GameName";
import MatchDay from "./pages/MatchDay";
import MatchConfig from "./components/MatchConfig";

const ROLES = {
  Admin: 2001,
  User: 2002,
};

const App: React.FC = () => {
  ////vars

  ////jsx
  // return <Fragment>{!isLoggedIn && <Login />}</Fragment>;
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* free accessed routes */}
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* protected these routes */}
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.User]} />}
          >
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Teams />} />
            <Route path="/background-image" element={<BackgroundImage />} />
            <Route path="/game-name" element={<GameName />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/match-day" element={<MatchDay />} />
            <Route path="/match-config" element={<MatchConfig />} />
          </Route>
        </Route>

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
};

export default App;

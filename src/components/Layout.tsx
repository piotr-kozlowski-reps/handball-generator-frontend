import { Link, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Layout = () => {
  ////vars
  const { auth } = useAuth();

  ////jsx
  return (
    <main>
      <section>
        <h1>
          <div>
            <Link to="/" className="bg-appInFocus p-2 m-1 rounded-md shadow-md">
              Home
            </Link>
          </div>
        </h1>
        <p className="text-xs mt-3">{`Jesteś zalogowany, jako: ${
          auth?.roles?.includes(2001) ? "Admin" : "User"
        }`}</p>
        <br />
      </section>
      <Outlet />
    </main>
  );
};

export default Layout;

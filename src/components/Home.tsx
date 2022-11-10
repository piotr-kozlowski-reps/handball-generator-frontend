import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";

const Home = () => {
  ////vars
  const logout = useLogout();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const singOutHandler = async () => {
    await logout();
    navigate("/login");
  };

  ////jsx
  return (
    <section>
      <p className="mb-5 ">config:</p>
      <div>
        <Link to="/team" className="bg-appInFocus p-2 m-1 rounded-md shadow-md">
          wprowadź drużynę
        </Link>
      </div>
      <br />
      <div>
        <Link
          to="/game-name"
          className="bg-appInFocus p-2 m-1 rounded-md shadow-md"
        >
          wprowadź rodzaj rozgrywek
        </Link>
      </div>
      <br />
      <div>
        <Link
          to="/background-image"
          className="bg-appInFocus p-2 m-1 rounded-md shadow-md"
        >
          dodaj grafikę tła
        </Link>
      </div>
      <br />
      <div>
        <Link
          to="/sponsors"
          className="bg-appInFocus p-2 m-1 rounded-md shadow-md"
        >
          dodaj belkę sponsorów
        </Link>
      </div>
      <p className="mb-5 mt-8">generator:</p>
      <div className="mb-9">
        <Link
          to="/match-config"
          className="bg-appInFocus p-2 m-1 rounded-md shadow-md"
        >
          konfiguracja meczu:
        </Link>
      </div>
      <hr />
      <div className="mt-4">
        <Link
          to="/match-day"
          className="bg-appInFocus p-2 m-1 rounded-md shadow-md"
        >
          dzień meczowy
        </Link>
      </div>
      <br />
      <br />
      <p className="mb-5 ">logout:</p>
      <div>
        <button
          onClick={singOutHandler}
          className="bg-appInFocus p-2 m-1 rounded-md shadow-md"
        >
          wyloguj
        </button>
      </div>
    </section>
  );
};

export default Home;

import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";

const Home = () => {
  ////vars
  const logout = useLogout();
  const navigate = useNavigate();
  const { auth } = useAuth();

  console.log(auth);

  const singOutHandler = async () => {
    await logout();
    navigate("/login");
  };

  ////jsx
  return (
    <section>
      <h1>
        <Link to="/">Home</Link>
      </h1>
      <p className="text-xs">{`Jesteś zalogowany, jako: ${
        auth?.roles?.includes(2001) ? "Admin" : "User"
      }`}</p>
      <br />
      <Link to="/team">wprowadź drużynę</Link>
      <br />
      <Link to="/match-kind">wprowadź rodzaj meczu</Link>
      <br />
      <Link to="/background-image">dodaj grafikę tła</Link>
      <br />
      <Link to="/sponsors">dodaj belkę sponsorów</Link>
      <br />
      <br />
      <button onClick={singOutHandler}>wyloguj</button>
    </section>
  );
};

export default Home;

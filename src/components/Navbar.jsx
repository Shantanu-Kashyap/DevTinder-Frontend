import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import "./Navbar.css";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          {/* PASTE THE SVG CODE BELOW */}
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" fill="#66FCF1"/>
              <path d="M11.9997 19.34L6.99974 15.17C3.99974 12.33 2.50001 10.92 2.50001 8.5C2.50001 6.08 4.08998 4.5 7.50001 4.5C9.07001 4.5 10.59 5.38 11.9997 7.07C13.4094 5.38 14.9294 4.5 16.5001 4.5C19.9101 4.5 21.5 6.08 21.5 8.5C21.5 10.92 20.0101 12.33 17.0101 15.17L11.9997 19.34Z" stroke="#0B0C10" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10.5 8H13.5V11H10.5V8Z" fill="#0B0C10"/>
              <path d="M10.5 8H13.5V11H10.5V8Z" stroke="#0B0C10" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {/* PASTE THE SVG CODE ABOVE */}
          DevTinder
        </Link>
      </div>
      {user && (
        <div className="navbar-right">
          <span className="welcome-message">Welcome, {user.firstName}</span>
          <div className="dropdown">
            <button className="avatar-btn" aria-label="User menu" aria-haspopup="true">
              <img alt="user photo" src={user.photoURL} className="avatar-img" />
            </button>
            <ul className="dropdown-menu">
              <li>
                <Link to="/profile" className="menu-link">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/connections" className="menu-link">Connections</Link>
              </li>
              <li>
                <Link to="/requests" className="menu-link">Requests</Link>
              </li>
              <li>
                <Link to="/premium" className="menu-link">Premium</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="menu-link logout-btn">Logout</button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
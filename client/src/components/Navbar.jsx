import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/dashboard" className="brand">
          <span className="brand__mark" aria-hidden="true" />
          SubTrack
        </NavLink>

        <nav className="navbar__links" aria-label="Main">
          <NavLink to="/dashboard" className={({ isActive }) => "navlink" + (isActive ? " navlink--active" : "")}>
            Dashboard
          </NavLink>
          {/* Add more links as pages get built: Upload, Subscriptions, Settings... */}
        </nav>

        <div className="navbar__user">
          {user?.name && <span className="navbar__name">{user.name}</span>}
          <button type="button" className="btn btn--ghost" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

import { Link, useLocation } from "react-router-dom";

const NavLinkItem = ({ path, children }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link to={path} className={`navbar-link ${isActive ? "active" : ""}`}>
      {children}
    </Link>
  );
};

export default NavLinkItem;

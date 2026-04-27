import { Link } from "react-router-dom";

import logoAFB from "../../assets/logo_AFB.png";

import "./navbar.scss";
import ProfileDropdown from "./profileDropdown";
import NavDropdown from "./navDropdown";
import NavLinkItem from "./navLinkItem";

const navigationConfig = [
  { type: "link", name: "Dashboard", path: "/" },
  { type: "link", name: "Data Extraction", path: "/data-extraction" },
  {
    type: "dropdown",
    name: "Text Preprocessing",
    items: [
      { name: "HTML Element Cleansing", path: "/html-element-cleansing" },
      { name: "Normalize Text", path: "/normalize-text" },
      { name: "Vader Labeling", path: "/vader-labeling" },
      { name: "Data Balancing", path: "/data-balancing" },
    ],
  },
  {
    type: "dropdown",
    name: "Analysis",
    items: [
      { name: "Single-text Analysis", path: "/single-text-analysis" },
      { name: "File-based Analysis", path: "/file-based-analysis" },
      { name: "Model-builder Simulation", path: "/roberta-builder-simulator" },
    ],
  },
];

// 5. Komponen Navbar utama yang sekarang jauh lebih bersih
const Navbar = () => {
  return (
    <nav className="navbar-container">
      <Link to="/">
        <img src={logoAFB} width={250} height={80} alt="logo" />
      </Link>
      <div className="navbar-links">
        {navigationConfig.map((item) => {
          if (item.type === "link") {
            return (
              <NavLinkItem key={item.name} path={item.path}>
                {item.name}
              </NavLinkItem>
            );
          }
          if (item.type === "dropdown") {
            return (
              <NavDropdown
                key={item.name}
                name={item.name}
                items={item.items}
              />
            );
          }
          return null;
        })}
        <ProfileDropdown />
      </div>
    </nav>
  );
};

export default Navbar;

import { Box, Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import NavLinkItem from "./navLinkItem";

const NavDropdown = ({ name, items }) => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  const childPaths = items.map((item) => item.path);
  const isParentActive = childPaths.includes(location.pathname);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box>
      <Button
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        className={`navbar-link ${isParentActive ? "active" : ""}`}
        sx={{ textTransform: "none", fontFamily: "Segoe UI" }}
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : undefined}
      >
        {name}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        sx={{ mt: 1.5 }}
      >
        {items.map((item) => (
          <MenuItem key={item.path} onClick={handleClose}>
            <Link
              to={item.path}
              className={`dropdown-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.name}
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default NavDropdown;

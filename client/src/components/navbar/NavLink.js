import React, { Link, useLocation } from "react-router-dom";
import styles from "./NavLink.module.scss";

const NavLink = ({ url, icon, title }) => {
  const location = useLocation();

  return (
    <Link
      className={`
            ${location.pathname === url ? styles.active : ""}
            ${styles.navLink}
          `}
      to={url}
    >
      <i className={icon}></i>
      <span>{title}</span>
    </Link>
  );
};

export default NavLink;

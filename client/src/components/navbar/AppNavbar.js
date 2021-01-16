import React, { useContext } from "react";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
} from "reactstrap";
import Logout from "../auth/Logout";
import { AuthContext } from "../auth/AuthContext";
import styles from "./AppNavbar.module.scss";
import NavLink from "./NavLink";
import { ModalContext } from "../generic/ModalContainer";

const AppNavbar = (props) => {
  const { auth } = useContext(AuthContext);
  const changeModal = useContext(ModalContext);
  const { isAuthenticated, user } = auth;

  const userDropdown = (
    <DropdownMenu right>
      <DropdownItem disabled>
        <span className="mr-3">
          <strong>{user ? `${user.name}` : ""}</strong>
        </span>
      </DropdownItem>
      <DropdownItem divider />
      <Logout />
      <DropdownItem divider />
      <DropdownItem onClick={() => changeModal("Invitation")}>
        Invitations
      </DropdownItem>
    </DropdownMenu>
  );

  const guestDropdown = (
    <DropdownMenu right>
      <DropdownItem onClick={() => changeModal("Register")}>
        Register
      </DropdownItem>
      <DropdownItem divider />
      <DropdownItem onClick={() => changeModal("Login")}>Login</DropdownItem>
    </DropdownMenu>
  );

  return (
    <div className={styles.navbar}>
      <div className="d-flex">
        <div className={styles.logo}>復習</div>
        <NavLink url="/" title="List" icon="fas fa-list" />
        <NavLink url="/add" title="Add" icon="fas fa-plus" />
        <NavLink url="/review" title="Review" icon="fas fa-book-reader" />
      </div>
      <div>
        <UncontrolledDropdown inNavbar>
          <DropdownToggle tag="a" className={`${styles.navLink} mr-n2`}>
            <i className="fas fa-user"></i>
            <span>User</span>
          </DropdownToggle>
          {isAuthenticated ? userDropdown : guestDropdown}
        </UncontrolledDropdown>
      </div>
    </div>
  );
};

export default AppNavbar;

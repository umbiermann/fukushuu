import React, { useContext } from "react";
import { DropdownItem } from "reactstrap";
import { AuthContext } from "./AuthContext";

export const Logout = () => {
  const { dispatchAuth } = useContext(AuthContext);

  const onClick = () => {
    dispatchAuth({
      type: "LOGOUT_SUCCESS",
    });
  };

  return <DropdownItem onClick={onClick}>Logout</DropdownItem>;
};

export default Logout;

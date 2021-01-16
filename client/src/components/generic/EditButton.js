import React from "react";
import { Button } from "reactstrap";
import styles from "./EditButton.module.scss";

const EditButton = (props) => {
  return (
    <Button
      className={`${props.className} ${styles.editButton}`}
      outline
      color="primary"
      size="sm"
      href={props.href}
      onClick={props.onClick}
    >
      <i className="far fa-edit"></i>
    </Button>
  );
};

export default EditButton;

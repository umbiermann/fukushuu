import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import styles from "./HelpModal.module.scss";

const HelpModal = (props) => {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  return (
    <>
      <i
        onClick={toggle}
        className={`fas fa-info-circle ${styles.infoIcon}`}
      ></i>

      <Modal isOpen={modal} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>{props.name}</ModalHeader>
        <ModalBody>{props.children}</ModalBody>
      </Modal>
    </>
  );
};

export default HelpModal;

import { createContext, useState } from "react";
import { Modal } from "reactstrap";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import DeleteCardModal from "../cards/edit/DeleteCardModal";
import AddCollectionModal from "../collections/AddCollectionModal";
import EditCollectionModal from "../collections/EditCollectionModal";
import InvitationModal from "../collections/InvitationModal";

export const ModalContext = createContext();

const ModalContainer = ({ children }) => {
  const [modal, setModal] = useState(null);
  const [modalProps, setModalProps] = useState(null);

  const changeModal = (name, newModalProps) => {
    setModal(name);
    setModalProps(newModalProps);
  };

  const renderModal = () => {
    switch (modal) {
      case "Register":
        return <RegisterModal {...modalProps} />;
      case "Login":
        return <LoginModal {...modalProps} />;
      case "AddCollection":
        return <AddCollectionModal {...modalProps} />;
      case "EditCollection":
        return <EditCollectionModal {...modalProps} />;
      case "Invitation":
        return <InvitationModal {...modalProps} />;
      case "DeleteCard":
        return <DeleteCardModal {...modalProps} />;
      default:
        return null;
    }
  };

  return (
    <ModalContext.Provider value={changeModal}>
      <Modal isOpen={modal != null} toggle={() => changeModal()}>
        {renderModal()}
      </Modal>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContainer;

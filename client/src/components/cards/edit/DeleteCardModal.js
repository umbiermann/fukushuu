import { useContext } from "react";
import { Button, ModalFooter, ModalHeader } from "reactstrap";
import { ModalContext } from "../../generic/ModalContainer";

const DeleteCardModal = ({ cardName, confirmDelete }) => {
  const changeModal = useContext(ModalContext);

  return (
    <>
      <ModalHeader toggle={() => changeModal()}>
        Really delete {cardName}?
      </ModalHeader>
      <ModalFooter>
        <Button color="success" onClick={confirmDelete}>
          Confirm
        </Button>
      </ModalFooter>
    </>
  );
};

export default DeleteCardModal;

import React, { useState, useContext } from "react";
import { Button, Form, Label, Input, ModalHeader, ModalBody } from "reactstrap";
import axios from "axios";
import { ErrorContext } from "../errors/ErrorContext";
import { AuthContext } from "../auth/AuthContext";
import { ModalContext } from "../generic/ModalContainer";

const AddCollectionModal = (props) => {
  const [newCollectionName, setNewCollectionName] = useState("");

  const { dispatchError } = useContext(ErrorContext);
  const { auth, tokenConfig } = useContext(AuthContext);
  const changeModal = useContext(ModalContext);

  const addCollection = (e) => {
    if (!auth.isAuthenticated) {
      changeModal("Register", { demoExplanation: true });
      return;
    }

    e.preventDefault();
    axios
      .post("/api/collections/", { name: newCollectionName }, tokenConfig())
      .then((res) => {
        const collection = res.data;
        axios
          .post(
            "/api/users/addcollection",
            { userId: auth.user._id, collectionId: collection._id },
            tokenConfig()
          )
          .then((res) => {
            props.addToCollections(collection);
            setNewCollectionName("");
            changeModal();
          })
          .catch((err) => dispatchError({ msg: err.data, status: err.status }));
      })
      .catch((err) => dispatchError({ msg: err.data, status: err.status }));
  };

  return (
    <>
      <ModalHeader toggle={() => changeModal()}>Add Collection</ModalHeader>
      <ModalBody>
        <Form onSubmit={addCollection}>
          <Label for="name">Name</Label>
          <Input
            type="text"
            name="name"
            required={true}
            placeholder="名前"
            value={newCollectionName}
            autoComplete="off"
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
          <Button color="dark" className="mt-3" block={true}>
            Add
          </Button>
        </Form>
      </ModalBody>
    </>
  );
};

export default AddCollectionModal;

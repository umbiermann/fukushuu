import React, { useState, useContext, useEffect, Fragment } from "react";
import {
  Button,
  Form,
  Label,
  Input,
  ModalHeader,
  ModalBody,
  ListGroup,
  ListGroupItem,
  Alert,
  Container,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
import { ErrorContext } from "../errors/ErrorContext";
import { AuthContext } from "../auth/AuthContext";
import EditButton from "../generic/EditButton";
import { ModalContext } from "../generic/ModalContainer";

const EditCollectionModal = (props) => {
  const [newCollectionName, setNewCollectionName] = useState(
    props.collection.name
  );
  const [collectionName, setCollectionName] = useState(props.collection.name);
  const [invite, setInvite] = useState("");
  const [invitations, setInvitations] = useState([]);
  const [msg, setMsg] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { dispatchError } = useContext(ErrorContext);
  const { auth, tokenConfig, dispatchAuth } = useContext(AuthContext);
  const changeModal = useContext(ModalContext);

  useEffect(() => {
    if (auth.isAuthenticated) {
      axios
        .get(`/api/users/invitations/${props.collection._id}`, tokenConfig())
        .then((res) => {
          setInvitations(res.data.invitations);
        });
    }
  }, [auth.isAuthenticated, props.collection._id, tokenConfig]);

  const editCollectionName = (e) => {
    e.preventDefault();

    if (!auth.isAuthenticated) {
      changeModal("Register", { demoExplanation: true });
      return;
    }

    axios
      .post(
        `/api/collections/${props.collection._id}`,
        { name: newCollectionName },
        tokenConfig()
      )
      .then((res) => {
        props.editCollections(res.data);
        setCollectionName(newCollectionName);
        setMsg({ success: true, msg: "Name changed to " + newCollectionName });
      })
      .catch((err) => dispatchError({ msg: err.data, status: err.status }));
  };

  const addInvitation = (e) => {
    e.preventDefault();

    if (!auth.isAuthenticated) {
      changeModal("Register", { demoExplanation: true });
      return;
    }

    axios
      .post(
        `/api/users/invite/`,
        { userMail: invite, collectionId: props.collection._id },
        tokenConfig()
      )
      .then((res) => {
        setInvitations([...invitations, res.data]);
        setMsg({ success: true, msg: invite + " invited" });
        setInvite("");
      })
      .catch((err) => {
        setMsg({ success: false, msg: "Cannot invite " + invite });
        dispatchError({ msg: err.data, status: err.status });
      });
  };

  const onClickDelete = (user) => {
    if (!auth.isAuthenticated) {
      changeModal("Register", { demoExplanation: true });
      return;
    }

    axios
      .post(
        `/api/users/invitation/`,
        { userId: user._id, collectionId: props.collection._id },
        tokenConfig()
      )
      .then((res) => {
        setInvitations(
          invitations.filter((invitation) => invitation._id !== user._id)
        );
        setMsg({ success: true, msg: user.email + " removed" });
      })
      .catch((err) => dispatchError({ msg: err.data, status: err.status }));
  };

  const checkLastUser = (e) => {
    e.preventDefault();

    if (!auth.isAuthenticated) {
      changeModal("Register", { demoExplanation: true });
      return;
    }

    axios
      .get(`/api/users/lastUser/${props.collection._id}`, tokenConfig())
      .then((res) => {
        if (res.data.lastUser) {
          setConfirmDelete(true);
        } else {
          leaveCollection();
          props.setEditCollectionModal(false);
        }
      })
      .catch((err) => dispatchError({ msg: err.data, status: err.status }));
  };

  const onClickAccept = () => {
    axios
      .delete(`/api/collections/${props.collection._id}`, tokenConfig())
      .then((res) => {
        leaveCollection();
      })
      .catch((err) => dispatchError({ msg: err.data, status: err.status }));
    props.setEditCollectionModal(false);
  };

  const onClickReject = () => {
    setConfirmDelete(false);
  };

  const leaveCollection = () => {
    axios
      .post(
        `/api/users/leavecollection/`,
        { userId: auth.user._id, collectionId: props.collection._id },
        tokenConfig()
      )
      .then((res) => {
        props.removeCollection(props.collection._id);
        dispatchAuth({
          type: "UPDATE_USER",
          payload: res.data,
        });
      })
      .catch((err) => dispatchError({ msg: err.data, status: err.status }));
  };

  return (
    <>
      <ModalHeader toggle={() => changeModal()}>Edit Collection</ModalHeader>
      <ModalBody>
        {confirmDelete ? (
          <Alert color="danger">
            <Container fluid>
              <Row>
                <Col className="px-0">
                  User are the last user in {collectionName}. If you leave it
                  the Collection and all of it's cards will be deleted.
                </Col>
                <Col className="px-0 my-auto" xs="auto">
                  <Button
                    className="mr-0 float-right align-middle"
                    outline
                    color="danger"
                    size="sm"
                    onClick={onClickReject}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                  <EditButton className="mr-2" onClick={onClickAccept} />
                </Col>
              </Row>
            </Container>
          </Alert>
        ) : null}
        {msg ? (
          <Alert color={msg.success ? "success" : "danger"}>{msg.msg}</Alert>
        ) : null}
        <Form onSubmit={editCollectionName}>
          <Label className="mt-2 mb-1" for="name">
            Change Name
          </Label>
          <Input
            type="text"
            name="name"
            required={true}
            placeholder="名前"
            value={newCollectionName}
            autoComplete="off"
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
          <Button color="dark" style={{ marginTop: "1rem" }} block>
            Edit
          </Button>
        </Form>
        <hr />
        <Form onSubmit={addInvitation}>
          <Label className="mt-2 mb-1" for="invite">
            Invite to Deck
          </Label>
          <Input
            type="email"
            name="invite"
            required={true}
            placeholder="E-Mail"
            autoComplete="off"
            value={invite}
            onChange={(e) => setInvite(e.target.value)}
          />
          <Button color="dark" style={{ marginTop: "1rem" }} block>
            Invite
          </Button>
        </Form>
        <ListGroup>
          {invitations.map((invitation, index) => (
            <ListGroupItem key={index}>
              {invitation.email}
              <Button
                className="mr-0 float-right align-middle"
                outline
                color="danger"
                size="sm"
                onClick={() => onClickDelete(invitation)}
              >
                <i className="far fa-trash-alt"></i>
              </Button>
            </ListGroupItem>
          ))}
        </ListGroup>
        <hr />
        <Button color="danger" onClick={checkLastUser} block>
          <i className="fas fa-sign-out-alt"></i> Leave Collection
        </Button>
      </ModalBody>
    </>
  );
};

export default EditCollectionModal;

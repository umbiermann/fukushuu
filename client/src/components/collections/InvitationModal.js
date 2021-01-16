import React, { Fragment, useEffect, useContext, useState } from "react";
import {
  ListGroup,
  ModalHeader,
  ModalBody,
  Alert,
  ListGroupItem,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import { ErrorContext } from "../errors/ErrorContext";
import EditButton from "../generic/EditButton";
import { ModalContext } from "../generic/ModalContainer";

const InvitationModal = () => {
  const [invitations, setInvitations] = useState([]);
  const [msg, setMsg] = useState(null);

  const { auth, tokenConfig, dispatchAuth } = useContext(AuthContext);
  const { dispatchError } = useContext(ErrorContext);
  const changeModal = useContext(ModalContext);

  useEffect(() => {
    if (auth.isAuthenticated) {
      axios
        .get(`/api/collections/invitations/${auth.user._id}`, tokenConfig())
        .then((res) => {
          setInvitations(res.data.invitations);
        });
    }
  }, [auth.isAuthenticated, auth.user._id, tokenConfig]);

  const onClickAccept = (collection) => {
    axios
      .post(
        `/api/users/addcollection`,
        { userId: auth.user._id, collectionId: collection._id },
        tokenConfig()
      )
      .then((res) => {
        axios
          .post(
            `/api/users/invitation/`,
            { userId: auth.user._id, collectionId: collection._id },
            tokenConfig()
          )
          .then((res) => {
            setMsg({
              success: true,
              msg: "Invitation for " + collection.name + " accepted",
            });
            dispatchAuth({
              type: "UPDATE_USER",
              payload: res.data,
            });
          })
          .catch((err) => dispatchError({ msg: err.data, status: err.status }));
      })
      .catch((err) => dispatchError({ msg: err.data, status: err.status }));
  };

  const onClickReject = (collection) => {
    axios
      .post(
        `/api/users/invitation/`,
        { userId: auth.user._id, collectionId: collection._id },
        tokenConfig()
      )
      .then((res) => {
        setInvitations(
          invitations.filter((invitation) => invitation._id !== collection._id)
        );
        setMsg({
          success: true,
          msg: "Invitation for " + collection.name + " rejected",
        });
      })
      .catch((err) => dispatchError({ msg: err.data, status: err.status }));
  };

  const acceptExampleCollection = () => {
    axios
      .post(
        `/api/users/examplecollection/`,
        { userId: auth.user._id },
        tokenConfig()
      )
      .then((res) => {
        setMsg({
          success: true,
          msg: "Invitation for ExampleCollection accepted",
        });
        dispatchAuth({
          type: "UPDATE_USER",
          payload: res.data,
        });
      })
      .catch((err) => dispatchError({ msg: err.data, status: err.status }));
  };

  return (
    <>
      <ModalHeader toggle={() => changeModal()}>Invitations</ModalHeader>
      <ModalBody>
        {msg ? (
          <Alert color={msg.success ? "success" : "danger"}>{msg.msg}</Alert>
        ) : null}
        {!invitations.length && auth.user.exampleCollection ? (
          <Alert>No Invitations</Alert>
        ) : null}
        <ListGroup>
          {invitations.map((invitation, key) => (
            <ListGroupItem key={key}>
              <Container fluid>
                <Row>
                  <Col className="px-0">{invitation.name}</Col>
                  <Col className="px-0 my-auto" xs="auto">
                    <Button
                      className="mr-0 float-right align-middle"
                      outline
                      color="danger"
                      size="sm"
                      onClick={() => {
                        onClickReject(invitation);
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                    <EditButton
                      className="mr-2"
                      onClick={() => {
                        onClickAccept(invitation);
                      }}
                    />
                  </Col>
                </Row>
              </Container>
            </ListGroupItem>
          ))}
          {!auth.user.exampleCollection ? (
            <ListGroupItem>
              <Container fluid>
                <Row>
                  <Col className="px-0">ExampleCollection</Col>
                  <Col className="px-0 my-auto" xs="auto">
                    <Button
                      className="mr-0 float-right align-middle"
                      outline
                      color="success"
                      size="sm"
                      onClick={acceptExampleCollection}
                    >
                      <i className="fas fa-check"></i>
                    </Button>
                  </Col>
                </Row>
              </Container>
            </ListGroupItem>
          ) : null}
        </ListGroup>
      </ModalBody>
    </>
  );
};

export default InvitationModal;

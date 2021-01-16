import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import { AuthContext } from "./AuthContext";
import { ErrorContext } from "../errors/ErrorContext";
import axios from "axios";
import { ModalContext } from "../generic/ModalContainer";

const demoExplanationMessage =
  "To edit and review cards and collections, please create an account.";

const RegisterModal = ({ demoExplanation }) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState(
    demoExplanation ? demoExplanationMessage : null
  );

  const { dispatchAuth } = useContext(AuthContext);
  const { error, dispatchError } = useContext(ErrorContext);
  const changeModal = useContext(ModalContext);

  useEffect(() => {
    // Check for register error
    if (error.id === "REGISTER_FAIL") {
      setMsg(error.msg);
    } else {
      if (msg !== demoExplanationMessage) {
        setMsg(null);
      }
    }
  }, [error, msg]);

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Request body
    const body = JSON.stringify(data);

    axios
      .post("/api/users", body, config)
      .then((res) => {
        dispatchAuth({
          type: "REGISTER_SUCCESS",
          payload: res.data,
        });
        changeModal();
      })
      .catch((err) => {
        dispatchError({
          type: "GET_ERRORS",
          payload: {
            msg: err.response.data.msg,
            status: err.response.status,
            id: "REGISTER_FAIL",
          },
        });
        dispatchAuth({
          type: "REGISTER_FAIL",
        });
      });
  };

  return (
    <>
      <ModalHeader toggle={() => changeModal()}>Register</ModalHeader>
      <ModalBody>
        {msg ? <Alert color="danger">{msg}</Alert> : null}
        <Form onSubmit={onSubmit}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              className="mb-3"
              onChange={onChange}
            />
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="mb-3"
              onChange={onChange}
            />
            <Label for="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="mb-3"
              onChange={onChange}
            />
            <Button color="dark" className="mt-4" block>
              Register
            </Button>
          </FormGroup>
        </Form>
      </ModalBody>
    </>
  );
};

export default RegisterModal;

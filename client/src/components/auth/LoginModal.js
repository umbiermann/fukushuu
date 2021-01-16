import React, { Fragment, useEffect, useState, useContext } from "react";
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

const LoginModal = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState(null);

  const { dispatchAuth } = useContext(AuthContext);
  const { error, dispatchError } = useContext(ErrorContext);
  const changeModal = useContext(ModalContext);

  useEffect(() => {
    if (error.id === "LOGIN_FAIL") {
      setMsg(error.msg);
    } else {
      setMsg(null);
    }
  }, [error]);

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const user = data;

    // Attempt to login
    dispatchAuth({ type: "LOGIN", payload: user });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Request body
    const body = JSON.stringify(data);

    axios
      .post("/api/auth", body, config)
      .then((res) => {
        dispatchAuth({
          type: "LOGIN_SUCCESS",
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
            id: "LOGIN_FAIL",
          },
        });
        dispatchAuth({
          type: "LOGIN_FAIL",
        });
      });
  };

  return (
    <>
      <ModalHeader toggle={() => changeModal(null)}>Login</ModalHeader>
      <ModalBody>
        {msg ? <Alert color="danger">{msg}</Alert> : null}
        <Form onSubmit={onSubmit}>
          <FormGroup>
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
              Login
            </Button>
          </FormGroup>
        </Form>
      </ModalBody>
    </>
  );
};

export default LoginModal;

import React, { useState, useContext } from "react";
import {
  ListGroupItem,
  Collapse,
  Badge,
  Form,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";
import TextareaAutosize from "react-textarea-autosize";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import { ErrorContext } from "../errors/ErrorContext";
import styles from "./LogListItem.module.scss";
import { ModalContext } from "../generic/ModalContainer";

const LogListItem = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  const { tokenConfig, auth } = useContext(AuthContext);
  const { dispatchError } = useContext(ErrorContext);
  const changeModal = useContext(ModalContext);

  var log = props.log;

  const getColor = (success) => {
    if (success === "good") {
      return "success";
    } else if (success === "avg") {
      return "secondary";
    } else {
      return "danger";
    }
  };

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const onChange = (e) => {
    setNewComment(e.target.value);
  };

  const onClickCardName = (e) => {
    props.setSearch(log.cardName);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!auth.isAuthenticated) {
      changeModal("Register", { demoExplanation: true });
      return;
    }

    if (newComment !== "") {
      const addComment = {
        userName: auth.user.name,
        comment: newComment,
      };
      axios
        .post(
          `/api/collections/logs/comment/${log._id}`,
          addComment,
          tokenConfig()
        )
        .then((res) => {
          log.comment.push(addComment);
          setNewComment("");
        })
        .catch((err) =>
          dispatchError({ msg: err.data, status: err.response.status })
        );
    }
  };

  return (
    <ListGroupItem className="px-2 py-1" color={getColor(log.success)}>
      <Container fluid className="px-2">
        <Row className="px-1 clickable" onClick={toggle}>
          <Col className={`px-0 ${isOpen ? styles.comment : styles.original}`}>
            <Badge color="dark" className="m-1">
              {log.userName}
            </Badge>
            {log.original}
          </Col>
          <Col className="px-0 my-auto" xs="auto">
            {log.comment.length > 0 && !isOpen ? (
              <Badge className="m-1" color="secondary">
                {log.comment.length}
              </Badge>
            ) : null}
          </Col>
        </Row>
      </Container>
      <Collapse isOpen={isOpen}>
        <Container fluid>
          <Row className="px-1 my-1">
            <Col className="px-0 align-self-center">
              <Button size="sm" color="secondary" onClick={onClickCardName}>
                <i className="fas fa-search fa-sm"></i>
                {log.cardName}
              </Button>
            </Col>
            <Col className={`px-0 ${styles.time}`} xs="auto">
              <div>{new Date(log.date).toLocaleDateString()}</div>
              <div>
                at{" "}
                {new Date(log.date).toLocaleTimeString([], {
                  hour12: false,
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            </Col>
          </Row>
          {log.comment.map((comment, index) => (
            <Row
              key={index}
              className={`px-1 ${index % 2 === 0 ? styles.oddComment : null}`}
            >
              <Col className={`px-0 ${styles.comment}`}>
                <Badge color="dark" className="m-1">
                  {comment.userName}
                </Badge>
                {comment.comment}
              </Col>
            </Row>
          ))}
          <Row className="px-1">
            <Col className="px-0">
              <Form onSubmit={onSubmit}>
                <TextareaAutosize
                  className="form-control no-resize mt-2"
                  placeholder="New Comment"
                  rows="1"
                  value={newComment}
                  onChange={onChange}
                />
                <Button size="sm" color="dark" className="my-2">
                  Comment
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </Collapse>
    </ListGroupItem>
  );
};

export default LogListItem;

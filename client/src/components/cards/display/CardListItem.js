import React, { useContext, useState } from "react";
import {
  ListGroupItem,
  Button,
  Collapse,
  Badge,
  Container,
  Row,
  Col,
} from "reactstrap";
import { withRouter } from "react-router-dom";
import CardInfoTable from "./CardInfoTable";
import { AuthContext } from "../../auth/AuthContext";
import styles from "./CardListItem.module.scss";
import EditButton from "../../generic/EditButton";
import { ModalContext } from "../../generic/ModalContainer";

const CardListItem = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { auth } = useContext(AuthContext);
  const changeModal = useContext(ModalContext);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const onClickDelete = (e) => {
    e.stopPropagation();
    changeModal("DeleteCard", {
      confirmDelete: confirmDelete,
      cardName: props.card.name,
    });
  };

  const confirmDelete = (e) => {
    e.stopPropagation();

    if (!auth.isAuthenticated) {
      changeModal("Register", { demoExplanation: true });
      return;
    } else {
      changeModal();
    }

    props.deleteCard(props.card._id);
  };

  const reviewCard = (e) => {
    e.stopPropagation();
    props.history.push({
      pathname: "/review",
      state: { card: props.card },
    });
  };

  const ProgressBadge = () => {
    if (props.card.progress > 0) {
      return (
        <Badge className="ml-2 align-middle" color="secondary">
          {props.card.progress}
        </Badge>
      );
    } else if (props.card.progress === -1) {
      return (
        <Badge
          className="ml-2 align-middle"
          color="success"
          onClick={reviewCard}
        >
          <i className="fas fa-book-reader"></i>
        </Badge>
      );
    } else {
      return (
        <Badge className="ml-2 align-middle" color="info" onClick={reviewCard}>
          <i className="fas fa-book-reader"></i>
        </Badge>
      );
    }
  };

  return (
    <ListGroupItem className={styles.listItem}>
      <Container fluid>
        <Row className="clickable" onClick={toggle}>
          <Col className="px-0">
            <span className="card-name align-middle">{props.card.name}</span>
            <ProgressBadge />
          </Col>
          {isOpen ? (
            <Col className="px-0 my-auto" xs="auto">
              <Button
                className="mr-0 float-right align-middle"
                outline
                color="danger"
                size="sm"
                onClick={onClickDelete}
              >
                <i className="far fa-trash-alt"></i>
              </Button>
              <EditButton
                className="mr-2"
                href={auth.isAuthenticated ? "/card/" + props.card._id : null}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!auth.isAuthenticated)
                    changeModal("Register", { demoExplanation: true });
                }}
              />
            </Col>
          ) : null}
        </Row>
      </Container>
      <Collapse isOpen={isOpen}>
        <CardInfoTable card={props.card} />
      </Collapse>
    </ListGroupItem>
  );
};
/**

  <br/>
  <div><b>形:</b> {card.form}</div>
  <div><b>説明:</b> {card.explanation}</div>
  <div><b>例:</b> {card.examples}</div>
  */

export default withRouter(CardListItem);

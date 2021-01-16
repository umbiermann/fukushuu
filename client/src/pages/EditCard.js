import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Container,
} from "reactstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import InfoInput from "../components/cards/edit/InfoInput";
import { ErrorContext } from "../components/errors/ErrorContext";
import { AuthContext } from "../components/auth/AuthContext";
import SectionHeader from "../components/generic/SectionHeader";

const EditCard = (props) => {
  const [alert, setAlert] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);

  const { dispatchError } = useContext(ErrorContext);
  const { tokenConfig } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`/api/cards/${props.match.params._id}`)
      .then((res) => {
        setCurrentCard(res.data);
      })
      .catch((err) => dispatchError({ msg: err.data, status: err.status }));
  }, [dispatchError, props.match.params._id]);

  const onChange = (e) => {
    setCurrentCard({ ...currentCard, [e.target.name]: e.target.value });
  };

  const onChangeInfo = (e) => {
    setCurrentCard({
      ...currentCard,
      info: { ...currentCard.info, [e.target.name]: e.target.value },
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const id = props.match.params._id;

    // Add grammar via addGrammar action
    const newCard = {
      name: currentCard.name,
      type: currentCard.type,
      info: currentCard.info,
    };
    axios
      .post(`/api/cards/${id}`, newCard, tokenConfig())
      .then((res) => {
        setAlert(true);
      })
      .catch((err) => dispatchError({ msg: err.data, status: err.status }));
  };

  if (alert) {
    return <Redirect to="/" />;
  }
  if (currentCard) {
    return (
      <Container className="limit-width">
        <SectionHeader>Edit Card</SectionHeader>
        <Alert
          className="successAlert"
          color="success"
          isOpen={alert}
          fade={true}
        >
          {currentCard.name} edited successfully!
        </Alert>
        <Form onSubmit={onSubmit} action="/">
          <FormGroup>
            <Label className="mt-2 mb-1" for="name">
              Name
            </Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="名前"
              autoComplete="off"
              defaultValue={currentCard.name}
              onChange={onChange}
            />
            <InfoInput
              cardType={currentCard.type}
              cardInfo={currentCard.info}
              onChangeInfo={onChangeInfo}
            />
          </FormGroup>
          <Button color="dark" className="mt-4" block>
            Save
          </Button>
        </Form>
      </Container>
    );
  } else {
    return null;
  }
};

export default EditCard;

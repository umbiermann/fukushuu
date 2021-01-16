import React, { Fragment, useState, useContext, useEffect } from "react";
import {
  Container,
  Input,
  Button,
  ButtonGroup,
  Alert,
  Badge,
} from "reactstrap";
import axios from "axios";
import { useHistory, useLocation } from "react-router";
import { AuthContext } from "../components/auth/AuthContext";
import { ErrorContext } from "../components/errors/ErrorContext";
import ReviewHelp from "../components/info/ReviewHelp";
import CardInfoTable from "../components/cards/display/CardInfoTable";
import SectionHeader from "../components/generic/SectionHeader";
import { ModalContext } from "../components/generic/ModalContainer";
import CollectionFilter from "../components/collections/CollectionFilter";
import LoadingSpinner from "../components/generic/LoadingSpinner";

const Review = (props) => {
  const [original, setOriginal] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cardNew, setCardNew] = useState(false);
  const [filterCollection, setFilterCollection] = useState("");
  const [collections, setCollections] = useState(null);

  const { auth, tokenConfig } = useContext(AuthContext);
  const { dispatchError } = useContext(ErrorContext);
  const changeModal = useContext(ModalContext);

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const changeCard = (nextCard) => {
      if (nextCard) {
        if (nextCard.progress === 0) {
          nextCard.progress = 0;
          setCardNew(true);
        } else {
          setCardNew(false);
        }
        setCard(nextCard);
        setLoading(false);
      } else {
        setCard(null);
        setLoading(false);
      }
    };

    if (!isAnswered && collections) {
      if (!location.state) {
        if (auth.isAuthenticated) {
          axios
            .get(
              `/api/cards/next/${auth.user._id}/${filterCollection}`,
              tokenConfig()
            )
            .then((res) => {
              changeCard(res.data);
            })
            .catch((err) =>
              dispatchError({ msg: err.data, status: err.status })
            );
        } else {
          axios
            .get(`/api/cards/next`)
            .then((res) => {
              changeCard(res.data);
            })
            .catch((err) =>
              dispatchError({ msg: err.data, status: err.status })
            );
        }
      } else {
        const nextCard = location.state.card;
        changeCard(nextCard);
      }
    }
  }, [
    auth.isAuthenticated,
    isAnswered,
    collections,
    filterCollection,
    auth.user,
    dispatchError,
    location.state,
    tokenConfig,
  ]);

  useEffect(() => {
    setLoading(true);

    if (auth.isAuthenticated) {
      setFilterCollection(auth.user.selectOptions.filterCollection);
      axios
        .get(`/api/collections/${auth.user._id}`, tokenConfig())
        .then((res) => {
          setCollections(res.data);
        })
        .catch((err) => dispatchError({ msg: err.data, status: err.status }));
    } else {
      setCollections([]);
    }
  }, [auth.isAuthenticated, auth.user, tokenConfig, dispatchError]);

  const onChange = (e) => {
    setOriginal(e.target.value);
  };

  const uploadLog = (res) => {
    if (original !== "") {
      const log = {
        userId: auth.user._id,
        userName: auth.user.name,
        cardName: card.name,
        original: original,
        success: res,
      };
      axios
        .post(`/api/collections/log/${card._id}`, log, tokenConfig())
        .then((res) => {
          if (!props.location.state) {
            setOriginal("");
            setIsAnswered(false);
          } else {
            history.push("/");
          }
        })
        .catch((err) => dispatchError({ msg: err.data, status: err.status }));
    } else {
      if (!props.location.state) {
        setIsAnswered(false);
      } else {
        history.push("/");
      }
    }
  };

  const onRate = (e) => {
    if (!auth.isAuthenticated) {
      changeModal("Register", { demoExplanation: true });
      return;
    }

    setLoading(true);

    const result = e.target.value;
    var newLevel = 0;
    if (card.progress !== 0) {
      newLevel = card.level;
    }
    if (e.target.value === "bad") {
      newLevel = 0;
    } else if (result === "avg") {
      newLevel = newLevel + 1;
    } else {
      newLevel = newLevel + 2;
    }
    const date = new Date();
    const newProgress = {
      userId: auth.user._id,
      cardId: card._id,
      level: newLevel,
      lastDate: date,
    };
    if (card.progress !== 0) {
      axios
        .post("/api/users/updateprogress", newProgress, tokenConfig())
        .then((res) => {
          uploadLog(result);
        })
        .catch((err) => dispatchError({ msg: err.data, status: err.status }));
    } else {
      axios
        .post("/api/users/addprogress", newProgress, tokenConfig())
        .then((res) => {
          uploadLog(result);
        })
        .catch((err) => dispatchError({ msg: err.data, status: err.status }));
    }
  };

  const onSubmit = () => {
    setIsAnswered(true);
    setCardNew(false);
  };

  const changeFilter = (e) => {
    setFilterCollection(e.target.value);
    axios
      .post(
        `/api/users/cardselectoptions/${auth.user._id}`,
        { ...auth.user.selectOptions, filterCollection: e.target.value },
        tokenConfig()
      )
      .catch((err) =>
        dispatchError({ msg: err.data, status: err.response.status })
      );
  };

  return (
    <Container className="limit-width">
      {!loading ? (
        <>
          <SectionHeader>
            Review Cards
            <ReviewHelp />
          </SectionHeader>
          <CollectionFilter
            collections={collections}
            selectedCollection={filterCollection}
            onChange={changeFilter}
          />
          <div className="my-3">
            {card ? (
              <>
                {cardNew ? (
                  <Badge className="ml-2" color="info">
                    New!
                  </Badge>
                ) : null}
                <h1 className="mb-3 text-center">{card.name}</h1>
                <Input
                  type="text"
                  name="original"
                  placeholder="Original sentence"
                  autoComplete="off"
                  value={original}
                  onChange={onChange}
                />
                {!isAnswered ? (
                  <Button
                    color="dark"
                    className="my-4"
                    onClick={onSubmit}
                    block={true}
                  >
                    Check Answer
                  </Button>
                ) : (
                  <>
                    <ButtonGroup className="btn-group d-flex my-4" block={true}>
                      <Button color="danger" value="bad" onClick={onRate}>
                        Forgot
                      </Button>
                      <Button color="secondary" value="avg" onClick={onRate}>
                        Good
                      </Button>
                      <Button color="success" value="good" onClick={onRate}>
                        Easy
                      </Button>
                    </ButtonGroup>
                    <CardInfoTable card={card} />
                  </>
                )}
              </>
            ) : (
              <Alert className="successAlert" color="success" fade={true}>
                Nothing to review!
              </Alert>
            )}
          </div>
        </>
      ) : (
        <LoadingSpinner />
      )}
    </Container>
  );
};

export default Review;

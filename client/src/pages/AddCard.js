import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Container,
  Row,
  Col,
} from "reactstrap";
import { ErrorContext } from "../components/errors/ErrorContext";
import { AuthContext } from "../components/auth/AuthContext";
import axios from "axios";
import AddCardHelp from "../components/info/AddCardHelp";
import InfoInput from "../components/cards/edit/InfoInput";
import SectionHeader from "../components/generic/SectionHeader";
import { ModalContext } from "../components/generic/ModalContainer";
import LoadingSpinner from "../components/generic/LoadingSpinner";
import CollectionFilter from "../components/collections/CollectionFilter";

const AddCard = () => {
  const [alert, setAlert] = useState(false);
  const [collections, setCollections] = useState(null);
  const [cardData, setCardData] = useState({
    name: "",
    collection: null,
  });
  const [cardType, setCardType] = useState("Grammar");
  const [cardInfo, setCardInfo] = useState({
    形: "",
    説明: "",
    例: "",
  });
  const [lastAdded, setLastAdded] = useState("");
  const [loading, setLoading] = useState(true);

  const { dispatchError } = useContext(ErrorContext);
  const { auth, tokenConfig } = useContext(AuthContext);
  const changeModal = useContext(ModalContext);

  useEffect(() => {
    setLoading(true);
    if (auth.isAuthenticated) {
      axios
        .get(`/api/collections/${auth.user._id}`, tokenConfig())
        .then((res) => {
          setCollections(res.data);
        })
        .catch((err) => dispatchError({ msg: err.data, status: err.status }));
    } else {
      setCollections([{ name: "Demo Collection", _id: 1 }]);
    }
  }, [auth.isAuthenticated, auth.user, dispatchError, tokenConfig]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      if (auth.user.selectOptions.cardType) {
        setCardType(auth.user.selectOptions.cardType);
      }
    }
  }, [auth.isAuthenticated, auth.user]);

  useEffect(() => {
    if (collections) {
      if (collections.length && !cardData.collection) {
        var defaultCollection = collections[0];
        if (auth.user?.selectOptions.addCollection) {
          defaultCollection = collections.find(
            (collection) =>
              collection._id === auth.user.selectOptions.addCollection
          );
        }
        setCardData({ ...cardData, collection: defaultCollection });
      } else if (!collections.length && cardData.collection) {
        setCardData({ ...cardData, collection: null });
      }
      setLoading(false);
    }
  }, [collections, lastAdded, cardData, auth]);

  const openAddCollectionModal = (e) => {
    e.preventDefault();
    changeModal("AddCollection", { addToCollections: addToCollections });
  };

  const addToCollections = (collection) => {
    setCollections([collection, ...collections]);
  };

  const editCollections = (collectionNew) => {
    setCollections([
      collectionNew,
      ...collections.filter(
        (collection) => collection._id !== collectionNew._id
      ),
    ]);
  };

  const removeCollection = (collectionId) => {
    if (!auth.isAuthenticated) {
      changeModal("Register", { demoExplanation: true });
      return;
    }

    setCollections(
      collections.filter((collection) => collection._id !== collectionId)
    );
  };

  const openEditCollectionModal = (e) => {
    e.preventDefault();
    changeModal("EditCollection", {
      collection: cardData.collection,
      editCollections: editCollections,
      removeCollection: removeCollection,
    });
  };

  const onChangeData = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const onChangeCollection = (e) => {
    setCardData({
      ...cardData,
      collection: collections.find(
        (collection) => collection._id === e.target.value
      ),
    });
  };

  const onChangeInfo = (e) => {
    setCardInfo({ ...cardInfo, [e.target.name]: e.target.value });
  };
  const onChangeType = (e) => {
    if (e.target.value === "Grammar") {
      setCardType("Grammar");
      setCardInfo({
        形: "",
        説明: "",
        例: "",
      });
    } else {
      setCardType("Vocabulary");
      setCardInfo({
        読み方: "",
        意味: "",
        例: "",
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!auth.isAuthenticated) {
      changeModal("Register", { demoExplanation: true });
      return;
    }

    setLoading(true);

    const newCard = {
      name: cardData.name,
      collection: cardData.collection._id,
      info: cardInfo,
      type: cardType,
    };
    axios
      .post("/api/cards", newCard, tokenConfig())
      .then((res) => {
        axios
          .post(
            `/api/collections/card/${cardData.collection._id}`,
            { cardId: res.data._id },
            tokenConfig()
          )
          .catch((err) =>
            dispatchError({ msg: err.data, status: err.response.status })
          );
        axios
          .post(
            `/api/users/cardselectoptions/${auth.user._id}`,
            {
              ...auth.user.selectOptions,
              addCollection: cardData.collection._id,
              cardType: cardType,
            },
            tokenConfig()
          )
          .catch((err) =>
            dispatchError({ msg: err.data, status: err.response.status })
          );
        setLastAdded(cardData.name);
        setAlert(true);
        setCardData({
          ...cardData,
          name: "",
        });

        if (cardType === "Grammar") {
          setCardInfo({
            形: "",
            説明: "",
            例: "",
          });
        } else {
          setCardInfo({
            読み方: "",
            意味: "",
            例: "",
          });
        }
        setLoading(false);
      })
      .catch((err) =>
        dispatchError({ msg: err.data, status: err.response.status })
      );
  };

  return (
    <Container className="limit-width">
      {!loading ? (
        <div>
          <SectionHeader>
            Add Card <AddCardHelp />
          </SectionHeader>
          <Alert
            className="successAlert"
            color="success"
            isOpen={alert}
            fade={true}
          >
            {lastAdded} added successfully!
          </Alert>
          <Label className="mt-2 mb-1" for="typeSelect">
            Type
          </Label>
          <Input
            className="pl-1"
            type="select"
            name="select"
            onChange={onChangeType}
          >
            <option
              value={"Grammar"}
              selected={cardType === "Grammar" ? "selected" : ""}
            >
              文法
            </option>
            <option
              value={"Vocabulary"}
              selected={cardType === "Vocabulary" ? "selected" : ""}
            >
              単語
            </option>
          </Input>
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label className="mt-2 mb-1" for="collectionSelect">
                Collection
              </Label>
              <Container fluid>
                <Row className="px-1">
                  <Col className="px-0">
                    <CollectionFilter
                      collections={collections}
                      selectedCollection={cardData.collection}
                      onChange={onChangeCollection}
                      forceSelect={true}
                    />
                  </Col>
                  <Col xs="auto" className="px-0">
                    <Button
                      color="dark"
                      className="float-right"
                      type="button"
                      onClick={openAddCollectionModal}
                    >
                      <i className="fas fa-plus"></i>
                    </Button>
                    {cardData.collection ? (
                      <Button
                        color="secondary"
                        type="button"
                        onClick={openEditCollectionModal}
                      >
                        <i className="fas fa-cog"></i>
                      </Button>
                    ) : null}
                  </Col>
                </Row>
              </Container>
              <Label className="mt-2 mb-1" for="name">
                Name
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                required={true}
                placeholder="名前"
                autoComplete="off"
                value={cardData.name}
                onChange={onChangeData}
              />
              <InfoInput
                cardType={cardType}
                cardInfo={cardInfo}
                onChangeInfo={onChangeInfo}
              />
            </FormGroup>
            <Button color="dark" className="mt-4" block={true}>
              Add
            </Button>
          </Form>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </Container>
  );
};

export default AddCard;

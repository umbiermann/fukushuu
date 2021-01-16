import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, ListGroup } from "reactstrap";
import { AuthContext } from "../../auth/AuthContext";
import { ErrorContext } from "../../errors/ErrorContext";
import LoadingSpinner from "../../generic/LoadingSpinner";
import CardListItem from "./CardListItem";

const CardList = ({ filterCollection, search, sort }) => {
  const [cardList, setCardList] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const { auth, tokenConfig } = useContext(AuthContext);
  const { dispatchError } = useContext(ErrorContext);

  useEffect(() => {
    setLoading(true);
    if (auth.isAuthenticated) {
      axios
        .get(`/api/cards/list/${auth.user._id}`, {
          params: {
            filterCollection: filterCollection,
            search: search,
            sort: sort,
          },
          ...tokenConfig(),
        })
        .then((res) => {
          setCardList(res.data);
          setLoading(false);
        })
        .catch((err) => dispatchError({ msg: err.data, status: err.status }));
    } else {
      axios
        .get(`/api/cards/listdemo`, {
          params: { search: search, sort: sort },
        })
        .then((res) => {
          setCardList(res.data);
          setLoading(false);
        })
        .catch((err) => dispatchError({ msg: err.data, status: err.status }));
    }
  }, [filterCollection, search, sort, auth, tokenConfig, dispatchError]);

  const deleteCard = (id) => {
    axios
      .delete(`/api/cards/${id}`, tokenConfig())
      .then((res) => {
        setCardList(cardList.filter((oldCard) => oldCard._id !== id));
      })
      .catch((err) => dispatchError({ msg: err.data, status: err.status }));
  };

  return (
    <div>
      {!loading ? (
        !cardList.length ? (
          <Alert color="secondary">
            You don't have any Cards.
            <br /> Go to <i className="fas fa-plus"></i> to add a Card, or to
            <i className="fas fa-user"></i> -&gt; Invitations to join a
            Collection.
            <br /> For testing purposes you find an example collection there.
          </Alert>
        ) : (
          <>
            <ListGroup>
              {cardList
                .slice(0, showAll ? cardList.length : 20)
                .map((card, id) => (
                  <CardListItem key={id} card={card} deleteCard={deleteCard} />
                ))}
            </ListGroup>
            {!showAll && cardList.length > 20 ? (
              <Button
                color="light"
                style={{ marginBottom: "2rem" }}
                block
                onClick={() => setShowAll(true)}
              >
                Show All
              </Button>
            ) : null}
          </>
        )
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default CardList;

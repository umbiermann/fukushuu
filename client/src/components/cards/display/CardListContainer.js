import React, { useState, useEffect, useContext } from "react";
import { Row, Col } from "reactstrap";
import { AuthContext } from "../../auth/AuthContext";
import { ErrorContext } from "../../errors/ErrorContext";
import axios from "axios";
import SectionHeader from "../../generic/SectionHeader";
import CardListHelp from "../../info/CardListHelp";
import SearchInput from "../../generic/SearchInput";
import CollectionFilter from "../../collections/CollectionFilter";
import SortInput from "../../generic/SortInput";
import LoadingSpinner from "../../generic/LoadingSpinner";
import CardList from "./CardList";

const CardListContainer = ({ search, setSearch }) => {
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [filterCollection, setFilterCollection] = useState("");
  const [sort, setSort] = useState("Newest");

  const { auth, tokenConfig } = useContext(AuthContext);
  const { dispatchError } = useContext(ErrorContext);

  useEffect(() => {
    setLoading(true);

    if (auth.isAuthenticated) {
      setSort(auth.user.selectOptions.sort);
      setFilterCollection(auth.user.selectOptions.filterCollection);
      axios
        .get(`/api/collections/${auth.user._id}`, tokenConfig())
        .then((res) => {
          setCollections(res.data);
          setLoading(false);
        })
        .catch((err) => dispatchError({ msg: err.data, status: err.status }));
    } else {
      setLoading(false);
    }
  }, [auth, dispatchError, tokenConfig]);

  const changeFilter = (e) => {
    setFilterCollection(e.target.value);

    if (auth.isAuthenticated) {
      axios
        .post(
          `/api/users/cardselectoptions/${auth.user._id}`,
          {
            ...auth.user.selectOptions,
            filterCollection: e.target.value,
            sort: sort,
          },
          tokenConfig()
        )
        .catch((err) =>
          dispatchError({ msg: err.data, status: err.response.status })
        );
    }
  };

  const changeSort = (e) => {
    setSort(e.target.value);

    if (auth.isAuthenticated) {
      axios
        .post(
          `/api/users/cardselectoptions/${auth.user._id}`,
          {
            ...auth.user.selectOptions,
            filterCollection: filterCollection,
            sort: e.target.value,
          },
          tokenConfig()
        )
        .catch((err) =>
          dispatchError({ msg: err.data, status: err.response.status })
        );
    }
  };

  return (
    <div>
      {!loading ? (
        <>
          <SectionHeader>
            Cards <CardListHelp />
          </SectionHeader>
          <SearchInput search={search} setSearch={setSearch} />
          <Row className="mb-3">
            <Col className="pr-1">
              <CollectionFilter
                collections={collections}
                selectedCollection={filterCollection}
                onChange={changeFilter}
              />
            </Col>
            <Col className="pl-1">
              <SortInput
                options={["Newest", "Review"]}
                selectedOption={sort}
                onChange={changeSort}
              />
            </Col>
          </Row>
          <CardList
            filterCollection={filterCollection}
            search={search}
            sort={sort}
          />
        </>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default CardListContainer;

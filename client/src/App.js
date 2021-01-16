import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import AddCard from "./pages/AddCard";
import EditCard from "./pages/EditCard";
import Review from "./pages/Review";
import { Container } from "reactstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthContext } from "./components/auth/AuthContext";
import { ErrorContext } from "./components/errors/ErrorContext";

import styles from "./App.module.scss";
import AppNavbar from "./components/navbar/AppNavbar";

import "./watchForHover";
import ListPage from "./pages/ListPage";
import LoadingSpinner from "./components/generic/LoadingSpinner";

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const { auth, tokenConfig, dispatchAuth } = useContext(AuthContext);
  const { dispatchError } = useContext(ErrorContext);

  useEffect(() => {
    dispatchAuth({ type: "USER_LOADING" });
    axios
      .get("/api/auth/user", tokenConfig())
      .then((res) => {
        dispatchAuth({
          type: "USER_LOADED",
          payload: res.data,
        });
        setLoaded(true);
      })
      .catch((err) => {
        dispatchError({
          type: "GET_ERRORS",
          payload: { msg: err.data, status: err.status, id: null },
        });
        dispatchError({
          type: "AUTH_ERROR",
        });
        setLoaded(true);
      });
  }, [auth.isAuthenticated, dispatchAuth, dispatchError]);

  return (
    <div className="App">
      {loaded ? (
        <Router>
          <AppNavbar />
          <Container className={styles.mainContainer}>
            <Switch>
              <Route exact path="/" component={ListPage} />
              <Route exact path="/add" component={AddCard} />
              <Route exact path="/card/:_id" component={EditCard} />
              <Route exact path="/review" component={Review} />
            </Switch>
          </Container>
        </Router>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default App;

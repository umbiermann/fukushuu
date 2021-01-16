import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./styles/global.scss";
import AuthContextProvider from "./components/auth/AuthContext";
import ErrorContextProvider from "./components/errors/ErrorContext";
import ModalContainer from "./components/generic/ModalContainer";

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ErrorContextProvider>
        <ModalContainer>
          <App />
        </ModalContainer>
      </ErrorContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

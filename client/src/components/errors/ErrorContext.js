import React, { createContext, useReducer } from "react";

export const ErrorContext = createContext();

const errorReducer = (state, action) => {
  switch (action.type) {
    case "GET_ERRORS":
      return {
        msg: action.payload.msg,
        status: action.payload.status,
        id: action.payload.id,
      };
    case "CLEAR_ERRORS":
      return {
        msg: {},
        status: null,
        id: null,
      };
    default:
      return state;
  }
};

const ErrorContextProvider = (props) => {
  const [error, dispatchError] = useReducer(errorReducer, {
    msg: {},
    status: null,
    id: null,
  });
  return (
    <ErrorContext.Provider value={{ error, dispatchError }}>
      {props.children}
    </ErrorContext.Provider>
  );
};

export default ErrorContextProvider;

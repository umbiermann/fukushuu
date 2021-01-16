import React, { useState, useContext, useEffect, Fragment } from "react";
import axios from "axios";
import {
  ListGroup,
  Pagination,
  PaginationItem,
  PaginationLink,
  Alert,
} from "reactstrap";
import LogListItem from "./LogListItem";
import { AuthContext } from "../auth/AuthContext";
import { ErrorContext } from "../errors/ErrorContext";
import SectionHeader from "../generic/SectionHeader";
import LogListHelp from "../info/LogListHelp.";

const LogList = (props) => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [pageupd, setPageupd] = useState(0);
  const [pages, setPages] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const { auth, tokenConfig } = useContext(AuthContext);
  const { dispatchError } = useContext(ErrorContext);

  useEffect(() => {
    if (auth.isAuthenticated) {
      axios
        .get(`/api/collections/logs/${auth.user._id}/${page}`, tokenConfig())
        .then((res) => {
          setLogs(res.data.logs);
          setPages(res.data.pages);
          setPageupd(page);
          setLoaded(true);
        })
        .catch((err) => dispatchError({ msg: err.data, status: err.status }));
    } else {
      axios
        .get(`/api/collections/examplelogs`)
        .then((res) => {
          setLogs(res.data);
          setPages(1);
          setPageupd(0);
          setLoaded(true);
        })
        .catch((err) => dispatchError({ msg: err.data, status: err.status }));
    }
  }, [auth.isAuthenticated, page, auth.user, dispatchError, tokenConfig]);

  const setPageNull = () => {
    setPage(0);
  };

  const setPagePrev = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const setPageNext = () => {
    if (page < pages) {
      setPage(page + 1);
    }
  };

  const setPageLast = () => {
    setPage(pages);
  };

  if (loaded) {
    return (
      <>
        <SectionHeader>
          Logs <LogListHelp />
        </SectionHeader>
        {!logs.length ? <Alert color="secondary">No logs</Alert> : null}
        <ListGroup>
          {logs.map((log, index) => (
            <LogListItem key={index} log={log} setSearch={props.setSearch} />
          ))}
        </ListGroup>
        <Pagination className="d-flex justify-content-center align-items-center">
          <PaginationItem>
            <PaginationLink first onClick={setPageNull} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink previous onClick={setPagePrev} />
          </PaginationItem>
          <PaginationItem disabled>
            <PaginationLink>{pageupd + 1}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink next onClick={setPageNext} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink last onClick={setPageLast} />
          </PaginationItem>
        </Pagination>
      </>
    );
  } else return null;
};

export default LogList;

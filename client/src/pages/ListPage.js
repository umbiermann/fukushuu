import { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import LogList from "../components/logs/LogList";
import CardListContainer from "../components/cards/display/CardListContainer";

const ListPage = () => {
  const [search, setSearch] = useState("");

  return (
    <Container>
      <Row>
        <Col lg="5">
          <LogList setSearch={setSearch} />
        </Col>
        <Col lg="7">
          <CardListContainer search={search} setSearch={setSearch} />
        </Col>
      </Row>
    </Container>
  );
};

export default ListPage;

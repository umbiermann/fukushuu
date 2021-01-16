import React from "react";
import { Table } from "reactstrap";
import CardInfoTableElement from "./CardInfoTableElement";

const CardInfoTable = (props) => {
  return (
    <Table className="mb-0 mt-2" striped bordered>
      <tbody>
        {Object.keys(props.card.info).map((key, index) => (
          <CardInfoTableElement
            key={index}
            index={index}
            row={key}
            text={props.card.info[key]}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default CardInfoTable;

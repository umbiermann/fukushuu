import React, { useState, useContext } from "react";
import axios from "axios";
import linkifyHtml from "linkifyjs/html";
import { ErrorContext } from "../../errors/ErrorContext";
import styles from "./CardInfoTableElement.module.scss";
import { Button } from "reactstrap";

const CardInfoTableElement = (props) => {
  const [output, setOutput] = useState(props.text);
  const [showFurigana, setShowFurigana] = useState(false);
  const [furiganaLoading, setShowFuriganaLoading] = useState(false);

  const { dispatchError } = useContext(ErrorContext);

  const toggleFurigana = () => {
    if (!furiganaLoading) {
      setShowFuriganaLoading(true);
      if (!showFurigana) {
        const req = encodeURIComponent(props.text);
        axios
          .get(`/api/romaji/${req}`)
          .then((res) => {
            setOutput(res.data);
            setShowFurigana(true);
            setShowFuriganaLoading(false);
          })
          .catch((err) =>
            dispatchError({ msg: err.data, status: err.response.status })
          );
      } else {
        setOutput(props.text);
        setShowFurigana(false);
        setShowFuriganaLoading(false);
      }
    }
  };
  return (
    <tr key={props.index}>
      <th scope="row" width="60px" className="text-center">
        <div className={styles.rowName}>{props.row}</div>
        <Button
          className={`${styles.furiganaButton} ${
            furiganaLoading ? styles.loading : null
          }`}
          color={showFurigana ? "success" : "secondary"}
          onClick={toggleFurigana}
        >
          仮名
        </Button>
      </th>
      <td
        className={styles.infoCell}
        dangerouslySetInnerHTML={{ __html: linkifyHtml(output) }}
      />
    </tr>
  );
};

export default CardInfoTableElement;

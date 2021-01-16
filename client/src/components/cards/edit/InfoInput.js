import React from "react";
import { Label } from "reactstrap";
import TextareaAutosize from "react-textarea-autosize";

const InfoInput = (props) => {
  if (props.cardType === "Grammar") {
    return (
      <>
        <Label className="mt-2 mb-1" for="形">
          Form
        </Label>
        <TextareaAutosize
          className="form-control no-resize"
          name="形"
          id="形"
          placeholder="形"
          rows="1"
          value={props.cardInfo.形}
          onChange={props.onChangeInfo}
        />
        <Label className="mt-2 mb-1" for="説明">
          Explanation
        </Label>
        <TextareaAutosize
          className="form-control no-resize"
          name="説明"
          id="説明"
          placeholder="説明"
          rows="1"
          value={props.cardInfo.説明}
          onChange={props.onChangeInfo}
        />
        <Label className="mt-2 mb-1" for="例">
          Examples
        </Label>
        <TextareaAutosize
          className="form-control no-resize"
          name="例"
          id="例"
          placeholder="例"
          rows="1"
          value={props.cardInfo.例}
          onChange={props.onChangeInfo}
        />
      </>
    );
  } else {
    return (
      <>
        <Label className="mt-2 mb-1" for="読み方">
          Reading
        </Label>
        <TextareaAutosize
          className="form-control no-resize"
          name="読み方"
          id="読み方"
          placeholder="読み方"
          rows="1"
          value={props.cardInfo.読み方}
          onChange={props.onChangeInfo}
        />
        <Label className="mt-2 mb-1" for="意味">
          Meaning
        </Label>
        <TextareaAutosize
          className="form-control no-resize"
          name="意味"
          id="意味"
          placeholder="意味"
          rows="1"
          value={props.cardInfo.意味}
          onChange={props.onChangeInfo}
        />
        <Label className="mt-2 mb-1" for="例">
          Examples
        </Label>
        <TextareaAutosize
          className="form-control no-resize"
          name="例"
          id="例"
          placeholder="例"
          rows="1"
          value={props.cardInfo.例}
          onChange={props.onChangeInfo}
        />
      </>
    );
  }
};

export default InfoInput;

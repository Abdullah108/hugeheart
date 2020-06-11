import React from "react";
import { Button } from "reactstrap";
import { Translation } from "../translation";

const LoadingButton = props => (
  <Button
    type={"button"}
    color={props.color || "primary"}
    disabled
    className={`${props.className || ""} btn-submit btn-link`}
  >
    {props.text || Translation.WAIT_TEXT}
  </Button>
);

export default LoadingButton;

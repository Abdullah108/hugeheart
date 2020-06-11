import React from "react";
import {
  Card,
  CardHeader,
  Button,
  UncontrolledTooltip,
  CardBody,
} from "reactstrap";

const CardContainer = ({
  title,
  icon,
  showBtn,
  buttonText,
  btnRoute,
  buttonTooltip,
  children,
}) => {
  return (
    <Card>
      <CardHeader>
        <h4>
          <i className={icon} /> {title}
        </h4>
        {showBtn ? (
          <>
            <Button
              className={"pull-right theme-btn add-btn btn-link"}
              id={"add-new-pm-tooltip"}
              onClick={() => {
                this.props.history.push(btnRoute);
              }}
            >
              <i className={"fa fa-plus"} />
              &nbsp; {buttonText || "Add New"}
            </Button>
            <UncontrolledTooltip target={"add-new-pm-tooltip"}>
              {buttonTooltip || buttonText || "Add New"}
            </UncontrolledTooltip>
          </>
        ) : null}
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
};

export default CardContainer;

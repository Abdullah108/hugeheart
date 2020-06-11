import React from "react";
import { Row, Col, Card, CardBody, CardFooter, Button } from "reactstrap";
import moment from "moment";
import { AppConfig } from "../../../config";
const PrincipleDetailsView = ({ principleDetails, goToList }) => {
  const {
    answer,
    userRole,
    createdAt,
    updatedAt,
    documents
  } = principleDetails;

  return (
    <>
      <Card className={"mt-0"}>
        <CardBody className={"mt-0"}>
          <Row>
            <Col sm={"12"}>
              <h3>Details: </h3>
              <hr />
            </Col>

            <Col sm={"4"}>
              <div>
                <b>
                  <i className={"fa fa-edit"} />
                  &nbsp;&nbsp; What it means to be HugeHeart
                </b>
                <p>{answer}</p>
              </div>
            </Col>
            <Col sm={"4"}>
              <div>
                <b>
                  <i className={"fa fa-user"} />
                  &nbsp;&nbsp;Principle For
                </b>
                <p className={"text-capitalize"}>{userRole}</p>
              </div>
            </Col>
            <Col sm={"4"}>
              <div>
                <b>
                  <i className={"fa fa-file-text-o"} />
                  &nbsp;&nbsp;Attachment
                </b>
                <br />
                <a
                  href={`${AppConfig.SERVER_FILES_ENDPOINT}/uploads/principle/${documents}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Attachment
                </a>
              </div>
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <p>
            <b>Created At: </b>
            {moment(createdAt).format(AppConfig.DEFAULT_DATE_FORMAT)}
          </p>
          {updatedAt ? (
            <p>
              <b>Last Updated At: </b>
              {moment(updatedAt).format(AppConfig.DEFAULT_DATE_FORMAT)}
            </p>
          ) : null}
          <Button
            type="button"
            color={"primary"}
            className={"pull-right btn-cancel btn-link"}
            onClick={goToList}
          >
            <i className={"fa fa-arrow-left"}></i>&nbsp;&nbsp; Back to list
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default PrincipleDetailsView;

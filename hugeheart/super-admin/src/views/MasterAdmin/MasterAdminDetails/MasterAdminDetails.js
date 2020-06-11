import React from "react";
import { Row, Col, Card, CardBody, CardFooter, Button } from "reactstrap";
import moment from "moment";
import { AppConfig } from "../../../config";
const MasterAdminDetailsView = ({ userDetails, goToList }) => {
  const {
    fullName,
    email,
    exactLocation,
    preferedLocation,
    contactNumber,
    experiance,
    workingWithStudent,
    workingWithStudentExpirationDate,
    liscenceEndDate,
    liscenceStartDate,
    createdAt,
    updatedAt
  } = userDetails;
  return (
    <>
      <Card className={"mt-0"}>
        <CardBody className={"mt-0"}>
          <Row>
            <Col sm={"4"}>
              <div>
                <b>
                  <i className={"fa fa-user"} />
                  &nbsp;&nbsp;Name
                </b>
                <p>{fullName}</p>
              </div>
              <div>
                <b>
                  <i className={"fa fa-envelope"} />
                  &nbsp;&nbsp;Email
                </b>
                <p>{email}</p>
              </div>
              <div>
                <b>
                  <i className={"fa fa-phone"} />
                  &nbsp;&nbsp;Contact Number
                </b>
                <p>{contactNumber}</p>
              </div>
            </Col>
            <Col sm={"4"}>
              <div>
                <b>
                  <i className={"fa fa-briefcase"} />
                  &nbsp;&nbsp;Experiance
                </b>
                <p>{experiance}</p>
              </div>
              <div>
                <b>
                  <i className={"fa fa-briefcase"} />
                  &nbsp;&nbsp;Working with Students
                </b>
                <p>{workingWithStudent}</p>
              </div>
              <div>
                <b>
                  <i className={"fa fa-briefcase"} />
                  &nbsp;&nbsp;Working with Students Expiration
                </b>
                <p>
                  {moment(workingWithStudentExpirationDate).format(
                    AppConfig.DEFAULT_ONLY_DATE_FORMAT
                  )}
                </p>
              </div>
            </Col>
            <Col sm={"4"}>
              <div>
                <b>
                  <i className={"fa fa-map-marker"} />
                  &nbsp;&nbsp;Preferred Location
                </b>
                <p>
                  {preferedLocation.city},{preferedLocation.state},
                  {preferedLocation.country} - {preferedLocation.postalCode}
                </p>
              </div>
              <div>
                <b>
                  <i className={"fa fa-map-marker"} />
                  &nbsp;&nbsp;Exact Location
                </b>
                <p>
                  {exactLocation.streetAddress}, {exactLocation.addressLine1},{" "}
                  {exactLocation.addressLine2
                    ? `${exactLocation.addressLine2}, `
                    : ""}
                  {exactLocation.city},{exactLocation.state},{" "}
                  {exactLocation.country} - {exactLocation.postalCode}
                </p>
              </div>
              <div>
                <b>
                  <i className={"fa fa-money"} />
                  &nbsp;&nbsp;Contract term
                </b>
                <p>
                  {moment(liscenceStartDate).format(
                    AppConfig.DEFAULT_ONLY_DATE_FORMAT
                  )}{" "}
                  to{" "}
                  {moment(liscenceEndDate).format(
                    AppConfig.DEFAULT_ONLY_DATE_FORMAT
                  )}
                </p>
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

export default MasterAdminDetailsView;

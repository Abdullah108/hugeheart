import React, { Component } from "react";
import { Row, Col, Card, CardBody, CardFooter, Button } from "reactstrap";
import moment from "moment";
import { AppConfig } from "../../../config";

class BrandDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { userDetails, goToList } = this.props
    const {
      fullName,
      email,
      title,
      exactLocation,
      contactNumber,
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
                    <i className={"fa fa-user"} />
                    &nbsp;&nbsp;Email
                </b>
                  <p>{email}</p>
                </div>
                <div>
                  <b>
                    <i className={"fa fa-user"} />
                    &nbsp;&nbsp;Contact Number
                </b>
                  <p>{contactNumber}</p>
                </div>
              </Col>
              <Col sm={"4"}>
                <div>
                  <b>
                    <i className={"fa fa-user"} />
                    &nbsp;&nbsp;Title
                </b>
                  <p>{title}</p>
                </div>
                <div>
                  <b>
                    <i className={"fa fa-map-marker"} />
                    &nbsp;&nbsp;Exact Location
                </b>
                  <p>
                    {exactLocation && exactLocation.streetAddress},{" "}
                    {exactLocation && exactLocation.addressLine1},{" "}
                    {exactLocation && exactLocation.addressLine2
                      ? `${exactLocation && exactLocation.addressLine2}, `
                      : ""}
                    {exactLocation && exactLocation.city},
                  {exactLocation && exactLocation.state},{" "}
                    {exactLocation && exactLocation.country} -{" "}
                    {exactLocation && exactLocation.postalCode}
                  </p>
                </div>
              </Col>
            </Row>
            <Button
              type="button"
              color={"primary"}
              className={"pull-right btn-cancel btn-link"}
              onClick={goToList}
            >
              <i className={"fa fa-arrow-left"}></i>&nbsp;&nbsp; Back to list
          </Button>
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
          </CardFooter>
        </Card>
      </>
    );
  }
}

export default BrandDetailsView;


import React from "react";
import { Row, Col, Card, CardBody, CardFooter, Button } from "reactstrap";
import moment from "moment";
import { AppConfig } from "../../../config";
const TeacherDetailsView = ({ userDetails, goToList }) => {
  const { fullName, firstName, lastName, createdAt, updatedAt } = userDetails;
  let { educationDetails, pastExperience, selectedSubjects } = userDetails;
  if (!pastExperience || !pastExperience.map) {
    pastExperience = [];
  }
  if (!educationDetails || !educationDetails.map) {
    educationDetails = [];
  }
  if (!selectedSubjects || !selectedSubjects.map) {
    selectedSubjects = [];
  }
  let Surname = lastName.match(/\b(\w)/g);
  return (
    <>
      <Card className={"mt-0"}>
        <CardBody className={"mt-0"}>
          <Row>
            <Col sm={"12"}>
              <h3>Basic Details: </h3>
              <hr />
            </Col>
            <Col sm={"4"}>
              <div>
                <b>
                  <i className={"fa fa-user"} />
                  &nbsp;&nbsp;Name
                </b>
                <p>
                  {firstName} {Surname}.
                </p>
              </div>
            </Col>
            <Col sm={"2"}>
              <div>
                <b>
                  <i className={"fa fa-calendar"} />
                  &nbsp;&nbsp;Subjects can teach
                </b>
                <p>
                  {selectedSubjects.map((subject, index) => {
                    return (
                      <React.Fragment key={index}>
                        <span className={`day`}>{subject}</span>
                        &nbsp;&nbsp;
                        <br />
                      </React.Fragment>
                    );
                  })}
                </p>
              </div>
            </Col>
            <Col sm={"12"}>
              <br />
              <h3>Past Experience: </h3>
              <hr />
            </Col>
            <Col sm={"12"}>
              {pastExperience.length ? (
                <Row>
                  {pastExperience.map((exp, index) => {
                    return (
                      <Col sm={"4"} key={index}>
                        <p>
                          <i className="fa fa-university"></i> &nbsp;&nbsp;{" "}
                          {exp.center || "N/A"}
                        </p>
                        <p>
                          <i className={"fa fa-graduation-cap"}></i>{" "}
                          &nbsp;&nbsp; {exp.duration || "N/A"}
                        </p>
                      </Col>
                    );
                  })}
                </Row>
              ) : (
                <p className={"text-center"}>
                  <b>{fullName} has no past experience.</b>
                </p>
              )}
            </Col>
            <Col sm={"12"}>
              <br />
              <h3>Education Details: </h3>
              <hr />
            </Col>
            <Col sm={"12"}>
              {educationDetails.length ? (
                <Row>
                  {educationDetails.map((edu, index) => {
                    return (
                      <Col sm={"4"} key={index}>
                        <p>
                          <i className="fa fa-university"></i> &nbsp;&nbsp;{" "}
                          {edu.university || "N/A"}
                        </p>
                        <p>
                          <i className={"fa fa-graduation-cap"}></i>{" "}
                          &nbsp;&nbsp; {edu.degree || "N/A"}
                        </p>
                      </Col>
                    );
                  })}
                </Row>
              ) : (
                <p className={"text-center"}>
                  <b>{fullName} has no past experience.</b>
                </p>
              )}
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <Row>
            <Col sm={"8"}>
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
            </Col>
            <Col sm={"4"} className={"text-right"}>
              <Button
                type="button"
                color={"primary"}
                className={"pull-right btn-cancel btn-link"}
                onClick={goToList}
              >
                <i className={"fa fa-arrow-left"}></i>&nbsp;&nbsp; Back to list
              </Button>
            </Col>
          </Row>
        </CardFooter>
      </Card>
    </>
  );
};

export default TeacherDetailsView;

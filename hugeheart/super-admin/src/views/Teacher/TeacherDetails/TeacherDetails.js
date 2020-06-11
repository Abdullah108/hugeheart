import React from "react";
import { Row, Col, Card, CardBody, CardFooter, Button } from "reactstrap";
import moment from "moment";
import { AppConfig } from "../../../config";
import { daysOptions } from "../AddTeacher";
const TeacherDetailsView = ({ userDetails, goToList }) => {
  const {
    fullName,
    email,
    contactNumber,
    currentAddress,
    emergencyEmail,
    emergencyContactNumber,
    createdAt,
    updatedAt,
    availibility
  } = userDetails;
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
                  <i className={"fa fa-map-marker"} />
                  &nbsp;&nbsp;Current Address
                </b>
                <p>{currentAddress}</p>
              </div>
              <div>
                <b>
                  <i className={"fa fa-envelope"} />
                  &nbsp;&nbsp;Emergency Email
                </b>
                <p>{emergencyEmail}</p>
              </div>
              <div>
                <b>
                  <i className={"fa fa-phone"} />
                  &nbsp;&nbsp;Emergency Contact Number
                </b>
                <p>{emergencyContactNumber}</p>
              </div>
            </Col>
            <Col sm={"2"}>
              <div>
                <b>
                  <i className={"fa fa-calendar"} />
                  &nbsp;&nbsp;Availiblity
                </b>
                <p>
                  {daysOptions.map((day, index) => {
                    const isAvailable =
                      availibility.findIndex(d => d.value === day.value) > -1;

                    return (
                      <React.Fragment key={index}>
                        <span
                          className={`day ${isAvailable ? "selected" : ""}`}
                        >
                          {day.label}
                        </span>
                        &nbsp;&nbsp;
                        {isAvailable ? (
                          <i className={"fa fa-check text-success"}></i>
                        ) : (
                          <i className={"fa fa-times text-danger"}></i>
                        )}
                        <br />
                      </React.Fragment>
                    );
                  })}
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
                          {edu.percentage ? `${edu.percentage}%` : null}
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

export default TeacherDetailsView;

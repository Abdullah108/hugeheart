import React, { Component } from "react";
import CardContainer from "../../../containers/CardContainer";
import { logger } from "../../../helpers";
import { getStudentDetails } from "../../../methods";
import { Card, CardBody, Row, Col, Button, CardFooter } from "reactstrap";
import moment from "moment";
import { AppConfig, AppRoutes } from "../../../config";
import Loader from "../../../containers/Loader/Loader";
import StudentSchedule from "./StudentSchedule";
class ViewStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      studentDetails: {},
      studentId: "",
    };
  }
  /**
   *
   */
  componentDidMount() {
    const { match } = this.props;
    const { params } = match;
    const { id } = params;
    logger(params);
    this.setState(
      {
        studentId: id,
      },
      this.getStudentDetails
    );
  }
  /**
   *
   */
  getStudentDetails = async () => {
    try {
      const { studentId } = this.state;
      const { isSuccess, data } = await getStudentDetails(studentId);
      if (isSuccess) {
        this.setState({
          isLoading: false,
          studentDetails: data.data,
        });
        return;
      }
      this.setState({
        isLoading: false,
        studentDetails: {},
      });
      logger(isSuccess, data);
    } catch (error) {
      this.setState({
        isLoading: false,
      });
    }
  };
  /**
   *
   */
  render() {
    const { isLoading, studentDetails, studentId } = this.state;
    const {
      fullName,
      email,
      contactNumber,
      createdAt,
      updatedAt,
      parentFirstName,
      parentLastName,
      address,
      studyProblems,
      year,
      selectedSubjects,
      trialClass,
    } = studentDetails;
    return (
      <>
        <CardContainer
          title={isLoading ? "Please wait.." : fullName || "-"}
          icon={"fa fa-user"}
        >
          <Card className={"mt-0"}>
            <CardBody className={"mt-0"}>
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  <h5>
                    <i className={"fa fa-info-circle"}></i>&nbsp;&nbsp;Student
                    Details
                  </h5>
                  <br />
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
                          &nbsp;&nbsp;Parent's Name
                        </b>
                        <p>
                          {parentFirstName} {parentLastName}
                        </p>
                      </div>
                      <div>
                        <b>
                          <i className={"fa fa-clock-o"} />
                          &nbsp;&nbsp;Year
                        </b>
                        <p className={"textarea"}> Year {year}</p>
                      </div>
                      {selectedSubjects && selectedSubjects.map ? (
                        <div>
                          <b>
                            <i className={"fa fa-file"} />
                            &nbsp;&nbsp;Subject
                          </b>
                          {selectedSubjects.map((subject, index) => {
                            return (
                              <p key={index} className={"textarea"}>
                                {subject}
                              </p>
                            );
                          })}
                        </div>
                      ) : null}
                    </Col>
                    <Col sm={"4"}>
                      <div>
                        <b>
                          <i className={"fa fa-map-marker"} />
                          &nbsp;&nbsp;Address
                        </b>
                        <p className={"textarea"}> {address}</p>
                      </div>
                      <div>
                        <b>
                          <i className={"fa fa-times text-danger"} />
                          &nbsp;&nbsp;Study Problems
                        </b>
                        <p className={"textarea"}> {studyProblems}</p>
                      </div>
                    </Col>

                    <Col sm={"12"}>
                      <br />
                      <h5>
                        <i className={"fa fa-calendar"}></i>&nbsp;&nbsp;Prefered
                        Date and time
                      </h5>
                      <br />
                      {trialClass && trialClass.map
                        ? trialClass.map((dateTime, index) => (
                            <div key={index} className={"text-bold"}>
                              <b>
                                {moment(dateTime).format(
                                  AppConfig.DEFAULT_DATE_FORMAT
                                )}
                              </b>
                            </div>
                          ))
                        : null}
                    </Col>
                  </Row>
                </>
              )}
            </CardBody>
            <CardFooter>
              <Row>
                <Col sm={"6"}>
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
                <Col sm={"6"}>
                  <Button
                    type="button"
                    color={"primary"}
                    className={"pull-right btn-cancel btn-link"}
                    onClick={() => this.props.history.push(AppRoutes.STUDENTS)}
                  >
                    <i className={"fa fa-arrow-left"}></i>&nbsp;&nbsp; Back to
                    list
                  </Button>
                </Col>
              </Row>
            </CardFooter>
          </Card>
        </CardContainer>
        {studentId ? <StudentSchedule studentId={studentId} /> : null}
      </>
    );
  }
}

export default ViewStudent;

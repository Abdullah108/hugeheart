import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  CardImg,
  CardTitle,
  CardText,
  Button,
  UncontrolledTooltip
} from "reactstrap";
import { getAssignedTeachers, unassignNewTeacher } from "../../../methods";
import { logger } from "../../../helpers";
import UserImage from "./../../../assets/avatars/user-default.svg";
import Loader from "../../../containers/Loader/Loader";
import AssignTeachers from "../AssignTeachers";
class AssignedTeachers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      users: [],
      showTeachers: false
    };
  }
  /**
   *
   */
  componentDidMount() {
    this.getAssignedTeachers();
  }
  /**
   *
   */
  getAssignedTeachers = async () => {
    this.setState({
      isLoading: true
    });
    const { masterAdminId } = this.props;
    const { isSuccess, data } = await getAssignedTeachers(masterAdminId);
    logger(data, isSuccess);
    this.setState({
      isLoading: false,
      users: isSuccess ? data.data : []
    });
  };
  /**
   *
   */
  unassignTeacher = teacherId => {
    const { masterAdminId } = this.props;
    const { users } = this.state;
    const index = users.findIndex(d => d.teacherId === teacherId);
    users.splice(index, 1);
    this.setState({
      users
    });
    unassignNewTeacher({
      teacherId,
      masterAdminId
    });
  };
  /**
   *
   */
  hideModal = () => {
    this.setState({
      showTeachers: false
    });
    this.getAssignedTeachers();
  };
  /**
   *
   */
  render() {
    const { isLoading, users, showTeachers } = this.state;
    const { masterAdminId } = this.props;
    return (
      <>
        {" "}
        <Card>
          <CardHeader>
            <h4>
              <i className="fa fa-graduation-cap" /> Assigned Teachers
            </h4>
            {!isLoading ? (
              <>
                <Button
                  className={"pull-right theme-btn add-btn btn-link"}
                  id={"assign-teacher-tooltip"}
                  onClick={() => this.setState({ showTeachers: true })}
                >
                  <i className={"fa fa-graduation-cap"} />
                  &nbsp; Assign new teacher
                </Button>
                <UncontrolledTooltip target={"assign-teacher-tooltip"}>
                  Assign new teacher
                </UncontrolledTooltip>
              </>
            ) : null}
          </CardHeader>
          <CardBody>
            <Row>
              {!isLoading ? (
                users.length ? (
                  users.map(user => {
                    const teacher = user.teacherId;
                    return (
                      <Col sm={"4"} key={teacher._id}>
                        <Card>
                          <CardImg
                            top
                            height="80"
                            src={teacher.profileImageURL}
                            onError={e => (e.target.src = UserImage)}
                            alt="Tacher's profile image"
                          />
                          <CardBody className={"text-center"}>
                            <CardTitle>
                              <h4>{teacher.fullName}</h4>
                            </CardTitle>
                            <CardText>
                              <i className={"fa fa-map-marker"}></i>&nbsp;&nbsp;
                              {teacher.currentAddress || "N/A"}
                            </CardText>
                            <div className={"text-center"}>
                              <Button
                                type="button"
                                color={"danger"}
                                className={"btn-cancel btn-submit btn-link"}
                                onClick={() =>
                                  this.unassignTeacher(teacher._id)
                                }
                              >
                                Unassign
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    );
                  })
                ) : (
                  <Col sm={"12"}>
                    <Card>
                      <CardBody
                        className={"text-center"}
                        style={{ marginTop: 0 }}
                      >
                        <CardText>No teacher found</CardText>
                      </CardBody>
                    </Card>
                  </Col>
                )
              ) : (
                <Col sm={"12"}>
                  <Loader />
                </Col>
              )}
            </Row>
          </CardBody>
        </Card>
        <AssignTeachers
          showTeachers={showTeachers}
          selectedMasterAdmin={masterAdminId}
          hideModal={this.hideModal}
        />
      </>
    );
  }
}

export default AssignedTeachers;

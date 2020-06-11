import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  ModalFooter,
  Row,
  Col,
  Input,
  UncontrolledTooltip,
  FormGroup,
  Label
} from "reactstrap";
import React, { Component } from "react";
import UserImage from "./../../assets/avatars/user-default.svg";
import { getAllTeachers, assignTeacherToStudent } from "../../methods";
import { logger } from "../../helpers";
import Loader from "../../containers/Loader/Loader";
import PaginationHelper from "../../helpers/Pagination";
import { AppRoutes, AppConfig } from "../../config";
import moment from "moment";
import { Form } from "react-bootstrap";
import Flatpickr from "react-flatpickr";

class AssignTeacherModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isLoading: false,
      totalCount: 0,
      selectedPage: 1,
      selectedTeachers: [],
      trialClass: [],
      selectedTrialClass: "",
      changeMode: false,
      newDate: new Date()
    };
  }
  /**
   *
   */
  componentDidMount() {
    this.getTeachers();
  }
  /**
   *
   */
  componentDidUpdate({
    selectedId: oldSelectedId,
    selectedStudent: oldSelectedStudent
  }) {
    const {
      selectedId,
      trialClass,
      selectedStudent,
      showTeachers
    } = this.props;
    const { _id: id } = selectedStudent;
    const { _id: oldId } = oldSelectedStudent;
    if (selectedId !== oldSelectedId) {
      this.setState({
        trialClass,
        selectedTrialClass: trialClass[0]
      });
    }
    if (id !== oldId) {
      this.setState({
        changeMode: showTeachers
      });
    }
  }
  /**
   *
   */
  getTeachers = async () => {
    try {
      const { search, selectedPage } = this.state;
      this.setState({
        isLoading: true,
        users: []
      });
      const { data: resp } = await getAllTeachers({
        skip: (selectedPage - 1) * 9,
        limit: 9,
        search
      });
      const { totalUsers, data: users } = resp;
      this.setState({
        users,
        totalCount: totalUsers,
        isLoading: false
      });
    } catch (error) {
      logger(error);
      this.setState({
        isLoading: false,
        users: []
      });
    }
  };
  /**
   *
   */
  onPageChanged = selectedPage => {
    this.setState(
      {
        selectedPage
      },
      () => {
        this.getTeachers();
      }
    );
  };
  /**
   *
   */
  onInputChange = e => {
    this.setState(
      {
        search: e.target.value
      },
      () => {
        this.getTeachers();
      }
    );
  };
  /**
   *
   */
  assignTeacher = async teacherId => {
    const { selectedId: studentId, refreshList, hideModal } = this.props;
    const {
      selectedTeachers,
      selectedTrialClass,
      newDate,
      changeMode
    } = this.state;
    selectedTeachers.push({
      teacherId: {
        _id: teacherId
      },
      studentId
    });
    this.setState({
      selectedTeachers
    });
    await assignTeacherToStudent({
      teacherId,
      studentId,
      dateTime: selectedTrialClass,
      newDate,
      changeMode
    });
    refreshList();
    hideModal();
  };
  /**
   *
   */
  render() {
    const { showTeachers, hideModal } = this.props;
    const {
      users,
      isLoading,
      totalCount,
      selectedPage,
      trialClass,
      selectedTrialClass,
      changeMode,
      newDate
    } = this.state;
    return (
      <Modal centered size={"lg"} isOpen={showTeachers} toggle={hideModal}>
        <ModalHeader toggle={hideModal}>Assign Teacher to Student</ModalHeader>
        <ModalBody>
          <Row>
            {changeMode ? (
              <Col sm={"6"}>
                <br />
                <FormGroup>
                  <Flatpickr
                    onChange={date => {
                      logger(date[0]);
                      this.setState({
                        newDate: date[0].toString()
                      });
                    }}
                    options={{
                      altInput: true,
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d",
                      minDate: new Date()
                    }}
                    id={`trialClass-new-date`}
                    className={"floating-input"}
                    value={[new Date(newDate)]}
                  />
                  <Label
                    className="floating-label form-label"
                    for={`trialClass-new-date`}
                  >
                     Choose Date(From which student teacher detail will be
                    updated)
                  </Label>
                </FormGroup>
              </Col>
            ) : trialClass && trialClass.map ? (
              trialClass.map((classTime, index) => (
                <Col sm={"4"} key={index}>
                  <div className="mb-30">
                    <Form.Check
                      type={"radio"}
                      id={`lable-${index}`}
                      label={moment(classTime).format(
                        AppConfig.DEFAULT_DATE_FORMAT
                      )}
                      name={"type"}
                      value={selectedTrialClass}
                      checked={classTime === selectedTrialClass}
                      inline
                      onChange={() =>
                        this.setState({ selectedTrialClass: classTime })
                      }
                      className="ml-3"
                    />
                  </div>
                </Col>
              ))
            ) : null}
          </Row>
          <br />
          <br />
          <Row>
            <Col sm={"6"}>
              <Input
                type="text"
                name="teacher-name-search"
                id="teacher-name-search"
                className={"floating-input"}
                onChange={this.onInputChange}
                placeholder={"Seach by name "}
              />
            </Col>
          </Row>
          <Row>
            {!isLoading ? (
              users.length ? (
                users.map(teacher => {
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
                          <div className={"text-center action-btn-wrap"}>
                            <>
                              <button
                                type="button"
                                className="btn btn-sm"
                                onClick={() => this.assignTeacher(teacher._id)}
                                id={`tooltip-assign-${teacher._id}`}
                              >
                                <i className="fa fa-handshake-o" />
                              </button>
                              <UncontrolledTooltip
                                target={`tooltip-assign-${teacher._id}`}
                              >
                                {`Assign ${teacher.fullName}`}
                              </UncontrolledTooltip>
                            </>
                            <>
                              <a
                                href={`${
                                  AppConfig.FRONTEND_URL
                                }${AppRoutes.TEACHER_CALENDAR.replace(
                                  ":id",
                                  teacher._id
                                )}`}
                                target={"_blank"}
                              >
                                <button
                                  type="button"
                                  className="btn btn-sm"
                                  id={`tooltip-view-${teacher._id}`}
                                >
                                  <i className="fa fa-calendar" />
                                </button>
                              </a>
                              <UncontrolledTooltip
                                target={`tooltip-view-${teacher._id}`}
                              >
                                {`View calendar/schedule of ${teacher.fullName}`}
                              </UncontrolledTooltip>
                            </>
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
            <Col sm={"12"}>
              {!isLoading ? (
                <PaginationHelper
                  totalRecords={totalCount}
                  onPageChanged={this.onPageChanged}
                  currentPage={selectedPage}
                  pageLimit={9}
                />
              ) : null}
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            color={"danger"}
            className={"btn-cancel btn-submit btn-link"}
            onClick={hideModal}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default AssignTeacherModel;

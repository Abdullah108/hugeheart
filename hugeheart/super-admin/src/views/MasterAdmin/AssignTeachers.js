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
  Input
} from "reactstrap";
import React, { Component } from "react";
import UserImage from "./../../assets/avatars/user-default.svg";
import {
  getAllTeachers,
  getAssignedTeachers,
  assignNewTeacher,
  unassignNewTeacher
} from "../../methods";
import { logger } from "../../helpers";
import Loader from "../../containers/Loader/Loader";
import PaginationHelper from "../../helpers/Pagination";

class AssignTeachers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isLoading: false,
      totalCount: 0,
      selectedPage: 1,
      selectedTeachers: []
    };
  }
  /**
   *
   */
  componentDidMount() {
    this.getTeachers();
    const { selectedMasterAdmin } = this.props;
    if (selectedMasterAdmin) {
      this.getAssignedTeachers();
    }
  }
  /**
   *
   */
  componentDidUpdate({ selectedMasterAdmin: oldSelectedMasterAdmin }) {
    const { selectedMasterAdmin } = this.props;
    if (selectedMasterAdmin !== oldSelectedMasterAdmin) {
      this.getAssignedTeachers();
    }
  }
  /**
   *
   */
  getAssignedTeachers = async () => {
    const { selectedMasterAdmin } = this.props;
    this.setState({
      isLoading: true
    });
    const { isSuccess, data } = await getAssignedTeachers(selectedMasterAdmin);
    let selectedTeachers = [];
    if (isSuccess) {
      selectedTeachers = data.data;
    }
    this.setState({
      selectedTeachers,
      isLoading: false
    });
    logger(isSuccess, data);
  };
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
    const { selectedMasterAdmin: masterAdminId } = this.props;
    const { selectedTeachers } = this.state;
    selectedTeachers.push({
      teacherId: {
        _id: teacherId
      },
      masterAdminId
    });
    this.setState({
      selectedTeachers
    });
    await assignNewTeacher({
      teacherId,
      masterAdminId
    });
  };
  /**
   *
   */
  unassignTeacher = teacherId => {
    const { selectedMasterAdmin: masterAdminId } = this.props;
    const { selectedTeachers } = this.state;
    const index = selectedTeachers.findIndex(
      d => d.teacherId._id === teacherId
    );
    selectedTeachers.splice(index, 1);
    this.setState({
      selectedTeachers
    });
    unassignNewTeacher({
      teacherId,
      masterAdminId
    });
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
      selectedTeachers
    } = this.state;
    return (
      <Modal centered size={"lg"} isOpen={showTeachers} toggle={hideModal}>
        <ModalHeader toggle={hideModal}>
          Assign Teacher to Master Admin
        </ModalHeader>
        <ModalBody>
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
                  const isAlreadyAssigned =
                    selectedTeachers.findIndex(
                      d => d.teacherId._id === teacher._id
                    ) > -1;
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
                            {isAlreadyAssigned ? (
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
                            ) : (
                              <Button
                                type="submit"
                                color={"primary"}
                                className={"btn-submit btn-link"}
                                onClick={() => this.assignTeacher(teacher._id)}
                              >
                                Assign
                              </Button>
                            )}
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

export default AssignTeachers;

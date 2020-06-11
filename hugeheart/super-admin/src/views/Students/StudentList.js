import * as moment from "moment";
import React, { Component } from "react";
import { Table, UncontrolledTooltip } from "reactstrap";
import { AppConfig, AppRoutes } from "../../config";
import Loader from "../../containers/Loader/Loader";
import { logger, toast, ConfirmBox } from "../../helpers";
import { updateStatusBrand } from "../../methods/BrandAmbassador";
import { deleteStudent, proxyLogin } from "../../methods";
import AssignTeacherModel from "./AssignTeacherModel";
// import Feedbacks from "./Feedbacks";
import EnrollStudent from "./EnrollStudent";

class StudentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: [],
      users: [],
      showAssignModel: false,
      selectedId: "",
      trialClass: [],
      selectedStudent: {},
      isOpen: false
    };
  }
  componentDidUpdate({ isLoading: prevIsLoading }) {
    const { isLoading, data } = this.props;
    if (!isLoading && prevIsLoading !== isLoading) {
      this.setState({
        users: data
      });
    }
  }
  /**
   *
   */
  handleCheckboxChange = e => {
    const { target } = e;
    const { checked, value } = target;
    const { ids } = this.state;
    if (checked) {
      ids.push(value);
    } else {
      var index = ids.indexOf(value);
      if (index !== -1) {
        ids.splice(index, 1);
      }
    }
    this.setState({
      ids
    });
  };
  /**
   *
   */
  handleCheckAllCheckBox = e => {
    const { target } = e;
    const { checked } = target;
    const { users } = this.props;
    if (!checked) {
      this.setState({
        ids: []
      });
    } else {
      const ids = [];
      for (let i = 0; i < users.length; i++) {
        const element = users[i];
        ids.push(element._id);
      }
      this.setState({
        ids: ids
      });
    }
  };
  /**
   *
   */
  handleActionChange = e => {
    const { ids } = this.state;
    if (!ids.length) {
      toast("Please select at least one brand ambassador.", "info");
      return;
    }
    const value = e.target.value;
    if (value.toLowerCase() === "active") {
      this.activeBrand(ids, true);
    } else if (value.toLowerCase() === "deactive") {
      this.activeBrand(ids, false);
    } else if (value.toLowerCase() === "Delete") {
      this.delete();
    } else if (value.toLowerCase() === "training") {
      this.setState({
        selectedBrand: ids,
        showTrainingModal: true
      });
    }
  };
  /**
   *
   */
  activeBrand = async (id, isActive) => {
    try {
      const { value } = await ConfirmBox({
        title: "Are you sure?",
        text:
          isActive === true
            ? "Do you want to activate this brand ambassador."
            : "Do you want to deactivate this brand ambassador."
      });
      if (!value) {
        return;
      }
      const { isSuccess, message } = await updateStatusBrand(id, isActive);

      if (!isSuccess) {
        toast(message, "error");
        return;
      }
      toast(message, "success");
      this.setState({
        ids: []
      });
      this.props.refreshList();
    } catch (error) {
      logger(error);
    }
  };
  /**
   *
   */
  delete = async id => {
    const { value } = await ConfirmBox({
      title: "Are you sure?",
      text: "Do you want to delete this student!"
    });
    if (!value) {
      return;
    }
    const { isSuccess, message } = await deleteStudent(id);

    if (!isSuccess) {
      toast(message, "error");
      return;
    }
    toast(message, "success");
    this.setState({
      ids: []
    });
    this.props.refreshList();
  };
  /**
   *
   */
  handleAssignTeacherModel = (e, data) => {
    e.preventDefault();
    logger(data);
    this.setState({
      selectedId: data._id,
      showAssignModel: true,
      trialClass: data.trialClass
    });
  };
  /**
   *
   */
  endrollStudent = async (id, selectedStudent) => {
    this.setState({
      selecteStudentId: id,
      isOpen: true,
      selectedStudent
    });
    logger(id);
  };
  /**
   *
   */
  render() {
    const { isLoading, page, limit, priceData, refreshList } = this.props;
    logger(this.props);
    const {
      users,
      selectedId,
      showAssignModel,
      trialClass,
      selectedStudent,
      isOpen
    } = this.state;
    const skip = (page - 1) * limit;
    return (
      <>
        <Table responsive bordered hover className="mt-3">
          <thead>
            <tr>
              <th width="90px"></th>
              <th>Master Admin</th>
              <th>Details</th>
              <th className="text-center">Assigned Teacher</th>
              <th className="text-center">Address</th>
              {/* <th className="text-center">Trial Date and Time</th> */}
              <th className="text-center">Created Date</th>
              <th className="text-center">Enrollment Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className={"table-loader"} colSpan={12}>
                  <Loader />
                </td>
              </tr>
            ) : users.length ? (
              users.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <label htmlFor={Math.random()}>{skip + index + 1}.</label>
                    </td>
                    <td>
                      <span
                        className={"view-link"}
                        onClick={() =>
                          item.masterAdminId
                            ? this.props.history.push(
                                AppRoutes.USER_DETAILS.replace(
                                  ":id",
                                  item.masterAdminId._id
                                )
                              )
                            : undefined
                        }
                      >
                        {item.masterAdminId
                          ? item.masterAdminId.fullName ||
                            `${item.masterAdminId.firstName} ${item.masterAdminId.lastName}`.trim() ||
                            "-"
                          : "-"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={"view-link"}
                        onClick={() => {
                          logger("Open User details");
                          this.props.history.push(
                            AppRoutes.VIEW_STUDENT.replace(":id", item._id)
                          );
                        }}
                      >
                        <i className={"fa fa-graduation-cap"}></i>{" "}
                        {item.fullName ||
                          (item.firstName || item.lastName
                            ? `${item.firstName} ${item.lastName}`
                            : "-")}
                      </span>

                      <br />
                      <span>
                        <i className={"fa fa-user"}></i>&nbsp;&nbsp;
                        {item.parentFirstName || item.parentLastName ? (
                          <>
                            {item.parentFirstName} {item.parentLastName}
                          </>
                        ) : (
                          "-"
                        )}
                      </span>
                      <br />
                      <span>{item.email}</span>
                      <br />
                      <span>{`Year ${item.year}`}</span>
                      <br />
                      <span>
                        {item.selectedSubjects ? (
                          <b>{item.selectedSubjects.join(", ")}</b>
                        ) : (
                          "-"
                        )}
                      </span>
                    </td>
                    <td>
                      {item.assignedTeacher ? (
                        <>
                          <span
                            className={"view-link"}
                            onClick={() =>
                              this.props.history.push(
                                AppRoutes.TEACHER_DETAILS.replace(
                                  ":id",
                                  item.assignedTeacher._id
                                )
                              )
                            }
                          >
                            {item.assignedTeacher.fullName}
                          </span>
                          &nbsp;&nbsp; (
                          <a
                            href={"/"}
                            onClick={e => {
                              this.setState({ selectedStudent: item });
                              this.handleAssignTeacherModel(e, item);
                            }}
                          >
                            <b>Change</b>
                          </a>
                          )
                        </>
                      ) : (
                        <>
                          Not Assigned{" "}
                          <a
                            href={"/"}
                            onClick={e =>
                              this.handleAssignTeacherModel(e, item)
                            }
                          >
                            <b>(Assign)</b>
                          </a>
                        </>
                      )}
                    </td>
                    <td className={"textarea"}>{item.address}</td>
                    <td>
                      {moment(item.createdAt).format(
                        AppConfig.DEFAULT_DATE_FORMAT
                      )}
                    </td>
                    <td className="text-center status-btn-wrap">
                      {item.enrollmentStatus === "enrolled" ? (
                        <React.Fragment>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            id={`tooltip-active-${item._id}`}
                          >
                            Enrolled
                          </button>
                          <UncontrolledTooltip
                            target={`tooltip-active-${item._id}`}
                          >
                            {`This student is enrolled on ${moment(
                              item.enrollmentDate
                            ).format(AppConfig.DEFAULT_DATE_FORMAT)}`}
                          </UncontrolledTooltip>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            id={`tooltip-deactive-${item._id}`}
                            onClick={() => this.endrollStudent(item._id, item)}
                          >
                            Not Enrolled
                          </button>
                          <UncontrolledTooltip
                            target={`tooltip-deactive-${item._id}`}
                          >
                            {`Click to enroll this student.`}
                          </UncontrolledTooltip>
                        </React.Fragment>
                      )}
                    </td>
                    <td className="text-center action-btn-wrap">
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() =>
                          this.props.history.push(
                            AppRoutes.VIEW_STUDENT.replace(":id", item._id)
                          )
                        }
                        id={`tooltip-view-${item._id}`}
                      >
                        <i className="fa fa-eye" />
                      </button>
                      <UncontrolledTooltip target={`tooltip-view-${item._id}`}>
                        {`View details of ${item.fullName}`}
                      </UncontrolledTooltip>

                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() =>
                          this.props.history.push(
                            AppRoutes.UPDATE_STUDENT.replace(":id", item._id)
                          )
                        }
                        id={`tooltip-edit-${item._id}`}
                      >
                        <i className="fa fa-edit" />
                      </button>
                      <UncontrolledTooltip target={`tooltip-edit-${item._id}`}>
                        {`Edit details of ${item.fullName}`}
                      </UncontrolledTooltip>
                      <button
                        type="button"
                        className="btn login-icon "
                        onClick={() => {
                          if (item._id) {
                            proxyLogin({
                              id: item._id
                            });
                          }
                        }}
                        id={`tooltip-proxy-${item._id}`}
                      >
                        <i className="icon-lock-open" />
                      </button>
                      <UncontrolledTooltip target={`tooltip-proxy-${item._id}`}>
                        {`Proxy Login of ${item.fullName}`}
                      </UncontrolledTooltip>
                      {/* <button
                        type="button"
                        className="btn btn-sm"
                        id={`tooltip-assign-${item._id}`}
                      >
                        <i className="fa fa-graduation-cap" />
                      </button>
                      <UncontrolledTooltip
                        target={`tooltip-assign-${item._id}`}
                      >
                        {`Assign teacher to ${item.fullName}`}
                      </UncontrolledTooltip> */}
                      {/* <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() =>
                          this.setState({
                            selectedBrand: item._id,
                            showTask: true
                          })
                        }
                        id={`tooltip-assign-task-${item._id}`}
                      >
                        <i className="fa fa-tasks" />
                      </button>
                      <UncontrolledTooltip
                        target={`tooltip-assign-task-${item._id}`}
                      >
                        {`Assign task to ${item.fullName}`}
                      </UncontrolledTooltip>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => {
                          this.setState({
                            selectedBrand: [item._id],
                            showTrainingModal: true,
                            selectedFullName: item.fullName
                          });
                        }}
                        id={`tooltip-training-schedule-${item._id}`}
                      >
                        <i className="fa fa-clock-o" />
                      </button>
                      <UncontrolledTooltip
                        target={`tooltip-training-schedule-${item._id}`}
                      >
                        {`Schedule training for ${item.fullName}`}
                      </UncontrolledTooltip>*/}

                      <button
                        type="button"
                        className="btn btn-sm red"
                        onClick={() => {
                          this.delete(item._id, true);
                        }}
                        id={`tooltip-delete-${item._id}`}
                      >
                        <i className="fa fa-trash" />
                      </button>
                      <UncontrolledTooltip
                        target={`tooltip-delete-${item._id}`}
                      >
                        {`Delete ${item.fullName}`}
                      </UncontrolledTooltip>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={"12"} className={"text-center"}>
                  No Student Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <AssignTeacherModel
          showTeachers={showAssignModel}
          hideModal={() =>
            this.setState({ showAssignModel: false, selectedStudent: {} })
          }
          selectedId={selectedId}
          trialClass={trialClass}
          refreshList={refreshList}
          selectedStudent={selectedStudent}
        />
        <EnrollStudent
          isOpen={isOpen}
          hideModal={() =>
            this.setState({
              isOpen: false
            })
          }
          priceData={priceData}
          refreshList={refreshList}
          selecteStudentId={selectedStudent._id}
          selectedItem={selectedStudent}
        />
        {/* <Feedbacks
          isOpen={showFeedbackModal}
          selectedItem={selectedItem}
          hideModal={() =>
            this.setState({
              showFeedbackModal: false
            })
          }
        /> */}
      </>
    );
  }
}

export default StudentList;

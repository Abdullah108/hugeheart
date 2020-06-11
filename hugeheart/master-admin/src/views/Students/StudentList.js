import * as moment from "moment";
import React, { Component, Fragment } from "react";
import { Table, UncontrolledTooltip } from "reactstrap";
import { AppConfig, AppRoutes } from "../../config";
import Loader from "../../containers/Loader/Loader";
import { logger, toast, ConfirmBox } from "../../helpers";
import { updateStatusBrand } from "../../methods/BrandAmbassador";
import { deleteStudent } from "../../methods";
import EnrollStudent from "./EnrollStudent";
import LeaveFeedback from "./LeaveFeedback";
import Feedbacks from "./Feedbacks";

class StudentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: [],
      users: [],
      selecteStudentId: "",
      selecteScheduleId: "",
      isOpen: false,
      selectedItem: {},
    };
  }
  componentDidUpdate({ isLoading: prevIsLoading }) {
    const { isLoading, data } = this.props;
    if (!isLoading && prevIsLoading !== isLoading) {
      this.setState({
        users: data,
      });
    }
  }
  /**
   *
   */
  handleCheckboxChange = (e) => {
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
      ids,
    });
  };
  /**
   *
   */
  handleCheckAllCheckBox = (e) => {
    const { target } = e;
    const { checked } = target;
    const { users } = this.props;
    if (!checked) {
      this.setState({
        ids: [],
      });
    } else {
      const ids = [];
      for (let i = 0; i < users.length; i++) {
        const element = users[i];
        ids.push(element._id);
      }
      this.setState({
        ids: ids,
      });
    }
  };
  /**
   *
   */
  handleActionChange = (e) => {
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
        showTrainingModal: true,
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
            : "Do you want to deactivate this brand ambassador.",
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
        ids: [],
      });
      this.props.refreshList();
    } catch (error) {
      logger(error);
    }
  };
  /**
   *
   */
  delete = async (id) => {
    const { value } = await ConfirmBox({
      title: "Are you sure?",
      text: "Do you want to delete this brand ambassador!",
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
      ids: [],
    });
    this.props.refreshList();
  };
  /**
   *
   */
  endrollStudent = async (id, selectedItem) => {
    this.setState({
      selecteStudentId: id,
      isOpen: true,
      selectedItem,
    });
    logger(id);
  };
  /**
   *
   */
  render() {
    const { isLoading, page, limit, refreshList, priceData } = this.props;
    const {
      users,
      isOpen,
      selecteStudentId,
      showTrialFeedback,
      selecteScheduleId,
      showFeedbackModal,
      selectedItem,
    } = this.state;
    const skip = (page - 1) * limit;
    const { userDetails } = this.props;
    const { userRole } = userDetails || {};
    const isNoTeacher = userRole !== "teacher";
    const isMaster = userRole === "masteradmin";
    return (
      <>
        <Table responsive bordered hover className="mt-3">
          <thead>
            <tr>
              <th width="90px"></th>
              <th>Student Details</th>
              {isNoTeacher ? <th>Parent's Details</th> : null}
              {isNoTeacher ? <th className="text-center">Address</th> : null}
              <th>Trial Date and Time</th>
              <th>Feedbacks</th>
              <th>Created Date</th>
              <th>Enrollment Status</th>
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
                        onClick={() => {
                          logger("Open User details");
                          this.props.history.push(
                            AppRoutes.VIEW_STUDENT.replace(":id", item._id)
                          );
                        }}
                      >
                        {item.fullName ||
                          (item.firstName || item.lastName
                            ? `${item.firstName} ${item.lastName}`
                            : "-")}
                      </span>
                      <br />
                      {isNoTeacher ? (
                        <>
                          <span>{item.email}</span>
                          <br />
                        </>
                      ) : null}
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

                    {isNoTeacher ? (
                      <td style={{ maxWidth: 150 }}>
                        {item.parentFirstName || item.parentLastName
                          ? `${item.parentFirstName} ${item.parentLastName}`
                          : "-"}
                        <br />
                        <span>{item.contactNumber}</span>
                      </td>
                    ) : null}
                    {isNoTeacher ? (
                      <td className={"textarea"}>{item.address}</td>
                    ) : null}
                    <td>
                      {item.trialClass && item.trialClass.map
                        ? item.trialClass.map((trialClass, ind) => {
                            return (
                              <Fragment key={ind}>
                                {" "}
                                {moment(trialClass).format(
                                  AppConfig.DEFAULT_DATE_FORMAT
                                )}
                                <br />
                              </Fragment>
                            );
                          })
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={"view-link"}
                        onClick={() => {
                          this.setState({
                            showFeedbackModal: true,
                            selectedItem: item,
                          });
                        }}
                      >
                        {item.teacherId && item.teacherId.feedbacks
                          ? item.teacherId.feedbacks.length || 0
                          : 0}
                      </span>
                    </td>
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
                            onClick={() =>
                              isMaster
                                ? this.endrollStudent(item._id, item)
                                : undefined
                            }
                          >
                            Not Enrolled
                          </button>
                          <UncontrolledTooltip
                            target={`tooltip-deactive-${item._id}`}
                          >
                            {isMaster
                              ? `This student is not enrolled yet. Click here to enroll.`
                              : `This student is not enrolled yet.`}
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
                      {isNoTeacher ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() =>
                              this.props.history.push(
                                AppRoutes.UPDATE_STUDENT.replace(
                                  ":id",
                                  item._id
                                )
                              )
                            }
                            id={`tooltip-edit-${item._id}`}
                          >
                            <i className="fa fa-edit" />
                          </button>
                          <UncontrolledTooltip
                            target={`tooltip-edit-${item._id}`}
                          >
                            {`Edit details of ${item.fullName}`}
                          </UncontrolledTooltip>
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
                        </>
                      ) : null}
                      {!isNoTeacher &&
                      item.teacherId &&
                      item.teacherId.isTrialClass ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() =>
                              this.setState({
                                showTrialFeedback: true,
                                selecteScheduleId: item.teacherId._id,
                              })
                            }
                            id={`tooltip-assign-task-${item._id}`}
                          >
                            <i className="fa fa-comment-o" />
                          </button>
                          <UncontrolledTooltip
                            target={`tooltip-assign-task-${item._id}`}
                          >
                            {`Leave feedback for trial class`}
                          </UncontrolledTooltip>
                        </>
                      ) : null}
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
        <EnrollStudent
          isOpen={isOpen}
          hideModal={() =>
            this.setState({
              isOpen: false,
            })
          }
          priceData={priceData}
          refreshList={refreshList}
          selecteStudentId={selecteStudentId}
          selectedItem={selectedItem}
        />

        <LeaveFeedback
          isOpen={showTrialFeedback}
          hideModal={() =>
            this.setState({
              showTrialFeedback: false,
            })
          }
          scheduleId={selecteScheduleId}
          refreshList={refreshList}
        />
        <Feedbacks
          isOpen={showFeedbackModal}
          selectedItem={selectedItem}
          hideModal={() =>
            this.setState({
              showFeedbackModal: false,
            })
          }
        />
      </>
    );
  }
}

export default StudentList;

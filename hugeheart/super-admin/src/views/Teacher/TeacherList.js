import * as moment from "moment";
import React, { Component } from "react";
import { Table, UncontrolledTooltip, Input } from "reactstrap";
import { AppConfig, AppRoutes, TokenKey } from "../../config";
import Loader from "../../containers/Loader/Loader";
import { logger, toast, ConfirmBox } from "../../helpers";
import { deleteTeacher, updateStatusTeacher, proxyLogin } from "../../methods";
import UserImage from "./../../assets/avatars/user-default.svg";
import ScheduleTraining from "./ScheduleTraining";
import AssignMaterials from "./AssignMaterials";
class TeacherList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: [],
      selectedOption: "",
      selectedTeacher: "",
      showTrainingModal: false,
      selectedFullName: "",
      showMaterialsModal: false
    };
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
      toast("Please select at least one master admin.", "info");
      return;
    }
    const value = e.target.value;
    if (value.toLowerCase() === "active") {
      this.activeTeacher(ids, true);
    } else if (value.toLowerCase() === "deactive") {
      this.activeTeacher(ids, false);
    } else if (value.toLowerCase() === "Delete") {
      this.delete();
    } else if (value.toLowerCase() === "training") {
      this.setState({
        selectedTeachers: ids,
        showTrainingModal: true
      });
    }
  };
  /**
   *
   */
  activeTeacher = async (id, isActive) => {
    try {
      const { value } = await ConfirmBox({
        title: "Are you sure?",
        text:
          isActive === true
            ? "Do you want to activate this master admin."
            : "Do you want to deactivate this master admin."
      });
      if (!value) {
        return;
      }
      const { isSuccess, message } = await updateStatusTeacher(id, isActive);

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
  hideModal = () => {
    this.setState({
      showTrainingModal: false,
      selectedTeachers: [],
      selectedFullName: ""
    });
  };
  /**
   *
   */
  hideAssignMaterialModal = () => {
    this.setState({
      showMaterialsModal: false,
      selectedTeachers: [],
      selectedFullName: ""
    });
  };
  /**
   *
   */
  delete = async id => {
    const { value } = await ConfirmBox({
      title: "Are you sure?",
      text: "Do you want to delete this teacher!"
    });
    if (!value) {
      return;
    }
    const { isSuccess, message } = await deleteTeacher(id);

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
  render() {
    const { users, isLoading, skip, redirect } = this.props;
    const {
      ids,
      selectedOption,
      selectedTeachers,
      showTrainingModal,
      selectedFullName,
      showMaterialsModal
    } = this.state;
    return (
      <>
        <Table responsive bordered hover className="mt-3">
          <thead>
            <tr>
              <th width="90px">
                {users.length ? (
                  <div className="table-checkbox-wrap">
                    <span className="checkboxli checkbox-custom checkbox-default">
                      <Input
                        type="checkbox"
                        name="checkbox"
                        id="checkAll"
                        checked={ids.length === users.length}
                        onChange={this.handleCheckAllCheckBox}
                      />
                      <label className="" htmlFor="checkAll" />
                    </span>
                    <Input
                      className="commonstatus"
                      type="select"
                      id="exampleSelect"
                      value={selectedOption}
                      onChange={this.handleActionChange}
                    >
                      <option>Select Status</option>
                      <option value={"active"}>Active</option>
                      <option value={"deactive"}>Deactive</option>
                      <option value={"delete"}>Delete</option>
                      <option value={"training"}>Schedule Training</option>
                    </Input>
                  </div>
                ) : null}
              </th>
              <th>Profile Image</th>
              <th>Details</th>
              <th>Current Address</th>
              <th>Created At</th>
              <th className="text-center">Status</th>
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
                      <div className="checkbox-custom checkbox-default coloum-checkbox">
                        <Input
                          type="checkbox"
                          value={item._id}
                          checked={this.state.ids.indexOf(item._id) > -1}
                          name="checkbox"
                          onChange={this.handleCheckboxChange}
                        />
                        <label htmlFor={Math.random()}>
                          {skip + index + 1}.
                        </label>
                      </div>
                    </td>
                    <td>
                      <img
                        src={`${AppConfig.SERVER_FILES_ENDPOINT}${item.profileImageURL}`}
                        onError={e => (e.target.src = UserImage)}
                        alt={"User profile"}
                        width={50}
                      />
                    </td>
                    <td>
                      <span
                        className={"view-link"}
                        onClick={() => {
                          logger("Open User details");
                          redirect(
                            AppRoutes.TEACHER_DETAILS.replace(":id", item._id)
                          );
                        }}
                      >
                        {item.fullName}
                      </span>
                      <br />
                      <span
                        className={"view-link"}
                        onClick={() => {
                          logger("Open User details");
                          redirect(AppRoutes.TEACHERS);
                        }}
                      >
                        {item.email}
                      </span>
                      <br />
                      <span
                        className={"view-link"}
                        onClick={() => {
                          logger("Open User details");
                        }}
                      >
                        {item.contactNumber}
                      </span>
                    </td>
                    <td>{item.currentAddress || "-"}</td>
                    <td>
                      {moment(item.createdAt).format(
                        AppConfig.DEFAULT_DATE_FORMAT
                      )}
                    </td>
                    <td className="text-center status-btn-wrap">
                      {item.isActive ? (
                        <React.Fragment>
                          <button
                            type="button"
                            onClick={() => {
                              this.activeTeacher(item._id, false);
                            }}
                            className="btn btn-primary btn-sm"
                            id={`tooltip-active-${item._id}`}
                          >
                            Active
                          </button>
                          <UncontrolledTooltip
                            target={`tooltip-active-${item._id}`}
                          >
                            {`Click to deactive ${item.fullName}`}
                          </UncontrolledTooltip>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <button
                            type="button"
                            onClick={() => {
                              this.activeTeacher(item._id, true);
                            }}
                            className="btn btn-danger btn-sm"
                            id={`tooltip-deactive-${item._id}`}
                          >
                            Deactive
                          </button>
                          <UncontrolledTooltip
                            target={`tooltip-deactive-${item._id}`}
                          >
                            {`Click to activate ${item.fullName}`}
                          </UncontrolledTooltip>
                        </React.Fragment>
                      )}
                    </td>
                    <td className="text-center action-btn-wrap">
                      <>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() =>
                            redirect(
                              AppRoutes.TEACHER_DETAILS.replace(":id", item._id)
                            )
                          }
                          id={`tooltip-view-${item._id}`}
                        >
                          <i className="fa fa-eye" />
                        </button>
                        <UncontrolledTooltip
                          target={`tooltip-view-${item._id}`}
                        >
                          {`View details of ${item.fullName}`}
                        </UncontrolledTooltip>
                      </>
                      <>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() =>
                            redirect(
                              AppRoutes.TEACHER_CALENDAR.replace(
                                ":id",
                                item._id
                              )
                            )
                          }
                          id={`tooltip-calendar-${item._id}`}
                        >
                          <i className="fa fa-calendar" />
                        </button>
                        <UncontrolledTooltip
                          target={`tooltip-calendar-${item._id}`}
                        >
                          {`View Schedule of ${item.fullName}`}
                        </UncontrolledTooltip>
                      </>
                      <>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() =>
                            redirect(
                              AppRoutes.TEACHER_DETAILS_EDIT.replace(
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
                      </>
                      <>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => {
                            this.setState({
                              selectedTeachers: [item._id],
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
                        </UncontrolledTooltip>
                      </>

                       <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() =>
                        window.open(
                          `${AppConfig.SERVER_FILES_ENDPOINT}${
                            item.resume
                          }?token=${localStorage.getItem(TokenKey)}`
                        )
                      }
                      id={`tooltip-file-${item._id}`}
                    >
                      <i className="fa fa-file" />
                    </button>
                    <UncontrolledTooltip target={`tooltip-file-${item._id}`}>
                      {`View Resume`}
                    </UncontrolledTooltip>
                      <>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => {
                            this.setState({
                              selectedTeachers: [item._id],
                              showMaterialsModal: true,
                              selectedFullName: item.fullName
                            });
                          }}
                          id={`tooltip-material-${item._id}`}
                        >
                          <i className="fa fa-database" />
                        </button>
                        <UncontrolledTooltip
                          target={`tooltip-material-${item._id}`}
                        >
                          {`Assign Material to ${item.fullName}`}
                        </UncontrolledTooltip>
                      </>
                      <>
                      <button
                                    type='button'
                                    className='btn login-icon '
                                    onClick={() => {
                                      if (item._id) {
                                        proxyLogin({
                                          id: item._id,
                                        });
                                      }
                                    }}
                                    id={`tooltip-proxy-${item._id}`}
                                  >
                                    <i className='icon-lock-open' />
                                  </button>
                                  <UncontrolledTooltip target={`tooltip-proxy-${item._id}`}>
                        {`Proxy Login of ${item.fullName}`}
                      </UncontrolledTooltip>
                      </>
                      <>
                        <button
                          type="button"
                          className="btn btn-sm red"
                          onClick={() => {
                            this.delete(item._id);
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
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={"12"} className={"text-center"}>
                  No Teacher Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <ScheduleTraining
          showTraining={showTrainingModal}
          fullName={selectedFullName}
          hideModal={this.hideModal}
          selectedTeachers={selectedTeachers}
        />
        <AssignMaterials
          showMaterial={showMaterialsModal}
          fullName={selectedFullName}
          hideModal={this.hideAssignMaterialModal}
          selectedTeachers={selectedTeachers ? selectedTeachers[0] : undefined}
        />
      </>
    );
  }
}

export default TeacherList;

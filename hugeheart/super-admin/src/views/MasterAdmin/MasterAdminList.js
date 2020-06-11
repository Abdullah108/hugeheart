import * as moment from "moment";
import React, { Component } from "react";
import { Table, UncontrolledTooltip, Input } from "reactstrap";
import { AppConfig, AppRoutes } from "../../config";
import Loader from "../../containers/Loader/Loader";
import { logger, toast, ConfirmBox } from "../../helpers";
import {
  deleteMasterAdmin,
  updateStatusMasterAdmin,
  proxyLogin
} from "../../methods";
import AssignTeachers from "./AssignTeachers";

class MasterAdminList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: [],
      selectedOption: "",
      showTeachers: false,
      selectedMasterAdmin: ""
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
      this.activeMasterAdmin(ids, true);
    } else if (value.toLowerCase() === "deactive") {
      this.activeMasterAdmin(ids, false);
    } else if (value.toLowerCase() === "Delete") {
      this.delete();
    }
  };
  /**
   *
   */
  activeMasterAdmin = async (id, isActive) => {
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
      const { isSuccess, message } = await updateStatusMasterAdmin(
        id,
        isActive
      );

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
      text: "Do you want to delete this master admin!"
    });
    if (!value) {
      return;
    }
    const { isSuccess, message } = await deleteMasterAdmin(id);

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
  hideModal = () => {
    this.setState({
      showTeachers: false
    });
  };
  /**
   *
   */
  render() {
    const { users, isLoading, skip, redirect } = this.props;
    const {
      ids,
      selectedOption,
      showTeachers,
      selectedMasterAdmin
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
                    </Input>
                  </div>
                ) : null}
              </th>
              <th>Details</th>
              <th>Experience</th>
              {/* <th>Prefered Location</th> */}
              <th>Exact Location</th>
              <th>Liscense Period</th>
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
                      <span
                        className={"view-link"}
                        onClick={() => {
                          logger("Open User details");
                          redirect(
                            AppRoutes.USER_DETAILS.replace(":id", item._id)
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
                          redirect(AppRoutes.USERS);
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
                    <td>{item.experiance || "-"}</td>
                    <td style={{ maxWidth: 150 }}>
                      {`${item.exactLocation.streetAddress}, ${item.exactLocation.addressLine1}, ${item.exactLocation.addressLine1} ${item.exactLocation.city}, ${item.exactLocation.state} ${item.exactLocation.country} - ${item.exactLocation.postalCode}` ||
                        "-"}
                    </td>
                    <td>
                      {`${moment(item.liscenceStartDate).format(
                        AppConfig.DEFAULT_ONLY_DATE_FORMAT
                      )} to ${moment(item.liscenceEndDate).format(
                        AppConfig.DEFAULT_ONLY_DATE_FORMAT
                      )}`}
                    </td>
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
                              this.activeMasterAdmin(item._id, false);
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
                              this.activeMasterAdmin(item._id, true);
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
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() =>
                          redirect(
                            AppRoutes.USER_DETAILS.replace(":id", item._id)
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
                          this.setState({
                            selectedMasterAdmin: item._id,
                            showTeachers: true
                          })
                        }
                        id={`tooltip-assign-teacher-${item._id}`}
                      >
                        <i className="fa fa-users" />
                      </button>
                      <UncontrolledTooltip
                        target={`tooltip-assign-teacher-${item._id}`}
                      >
                        {`View or Assign teacher to ${item.fullName}`}
                      </UncontrolledTooltip>

                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() =>
                          redirect(
                            AppRoutes.USER_DETAILS_EDIT.replace(":id", item._id)
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
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={"12"} className={"text-center"}>
                  No Master Admin Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <AssignTeachers
          showTeachers={showTeachers}
          selectedMasterAdmin={selectedMasterAdmin}
          hideModal={this.hideModal}
        />
      </>
    );
  }
}

export default MasterAdminList;

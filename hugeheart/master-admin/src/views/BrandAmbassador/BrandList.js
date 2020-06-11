import * as moment from "moment";
import React, { Component } from "react";
import { Table, UncontrolledTooltip, Input } from "reactstrap";
import { AppConfig, AppRoutes } from "../../config";
import Loader from "../../containers/Loader/Loader";
import { logger, toast, ConfirmBox } from "../../helpers";
import { updateStatusBrand, deleteBrand } from "../../methods/BrandAmbassador";
import AssignTaskToBrand from "./AssignTaskToBrand";
import ScheduleTraining from "./ScheduleTraning";

class BrandList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: [],
      selectedOption: "",
      showTask: false,
      showTrainingModal: false,
      selectedBrand: "",
      selectedFullName: ""
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
  delete = async (id, fullName) => {
    const { value } = await ConfirmBox({
      title: "Are you sure?",
      text: "Do you want to delete this brand ambassador!"
    });
    if (!value) {
      return;
    }
    const { isSuccess, message } = await deleteBrand(id, fullName);

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
      showTask: false,
      selectedBrand: []
    });
  };

  hideTrainingModal = () => {
    this.setState({
      showTrainingModal: false,
      selectedBrand: []
    });
  };

  render() {
    const { users, isLoading, skip } = this.props;
    const {
      ids,
      showTask,
      selectedBrand,
      showTrainingModal,
      selectedFullName
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
                      <label className="" for="checkAll" />
                    </span>
                    <Input
                      className="commonstatus"
                      type="select"
                      id="exampleSelect"
                      value={ids}
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
              <th>Details</th>
              <th>Exact Location</th>
              <th>Assigned Task</th>
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
                        <label for={Math.random()}>{skip + index + 1}.</label>
                      </div>
                    </td>
                    <td>
                      <span
                        className={"view-link"}
                        onClick={() => {
                          logger("Open User details");
                          this.props.history.push(
                            AppRoutes.VIEW_BRAND_AMBASSADOR.replace(
                              ":id",
                              item._id
                            )
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
                          this.props.history.push(
                            AppRoutes.VIEW_BRAND_AMBASSADOR.replace(
                              ":id",
                              item._id
                            )
                          );
                        }}
                      >
                        {item.email}
                      </span>
                      <br />
                      <span
                        className={"view-link"}
                        onClick={() => {
                          logger("Open User details");
                          this.props.history.push(
                            AppRoutes.VIEW_BRAND_AMBASSADOR.replace(
                              ":id",
                              item._id
                            )
                          );
                        }}
                      >
                        {item.contactNumber}
                      </span>
                      <br />
                      <span
                        className={"view-link"}
                        onClick={() => {
                          logger("Open User details");
                          this.props.history.push(
                            AppRoutes.VIEW_BRAND_AMBASSADOR.replace(
                              ":id",
                              item._id
                            )
                          );
                        }}
                      >
                        {item.title}
                      </span>
                    </td>

                    <td style={{ maxWidth: 150 }}>
                      {`${item.exactLocation.streetAddress || ""}, ${
                        item.exactLocation.addressLine1
                      }, ${item.exactLocation.addressLine1} ${
                        item.exactLocation.city
                      }, ${item.exactLocation.state} ${
                        item.exactLocation.country
                      } - ${item.exactLocation.postalCode}` || "-"}
                    </td>

                    <td style={{ maxWidth: 150 }}>{item.assignTask || ""}</td>

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
                              this.activeBrand(item._id, false);
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
                              this.activeBrand(item._id, true);
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
                          this.props.history.push(
                            AppRoutes.VIEW_BRAND_AMBASSADOR.replace(
                              ":id",
                              item._id
                            )
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
                            AppRoutes.UPDATE_BRAND_AMBASSADOR.replace(
                              ":id",
                              item._id
                            )
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
                      </UncontrolledTooltip>

                      <button
                        type="button"
                        className="btn btn-sm red"
                        onClick={() => {
                          this.delete(item._id, item.fullName, true);
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
                  No Brand Ambassador Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <AssignTaskToBrand
          showTask={showTask}
          selectedBrand={selectedBrand}
          hideModal={this.hideModal}
        />
        <ScheduleTraining
          showTraining={showTrainingModal}
          fullName={selectedFullName}
          hideTrainingModal={this.hideTrainingModal}
          selectedBrand={selectedBrand}
        />
      </>
    );
  }
}

export default BrandList;

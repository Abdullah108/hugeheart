import * as moment from "moment";
import React, { Component } from "react";
import { Table, UncontrolledTooltip, Input } from "reactstrap";
import { AppConfig, AppRoutes } from "../../config";
import Loader from "../../containers/Loader/Loader";
import { toast, ConfirmBox } from "../../helpers";
import { deletePrinciple } from "../../methods";
class PrincipleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: []
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
    const { principles } = this.props;
    if (!checked) {
      this.setState({
        ids: []
      });
    } else {
      const ids = [];
      for (let i = 0; i < principles.length; i++) {
        const element = principles[i];
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
    if (value.toLowerCase() === "delete") {
      this.delete(ids);
    }
  };

  /**
   *
   */
  delete = async id => {
    const { value } = await ConfirmBox({
      title: "Are you sure?",
      text: "Do you want to delete this principle!"
    });
    if (!value) {
      return;
    }
    const { isSuccess, message } = await deletePrinciple(id);
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
    const { principles, isLoading, skip, redirect } = this.props;
    const { ids, selectedOption } = this.state;
    const types = {
      marketmaterial: "Marketing Material",
      principle: "Principle"
    };
    return (
      <>
        <Table responsive bordered hover className="mt-3">
          <thead>
            <tr>
              <th width="90px">
                {principles.length ? (
                  <div className="table-checkbox-wrap">
                    <span className="checkboxli checkbox-custom checkbox-default">
                      <Input
                        type="checkbox"
                        name="checkbox"
                        id="checkAll"
                        checked={ids.length === principles.length}
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
                      <option value={"delete"}>Delete</option>
                    </Input>
                  </div>
                ) : null}
              </th>
              <th>Type</th>
              <th style={{ width: "350px" }}> What it means to be HugeHeart</th>
              <th>Assigned to </th>
              <th>Created At</th>
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
            ) : principles.length ? (
              principles.map((item, index) => {
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
                    <td>{types[item.type] || "-"}</td>
                    <td>{item.answer || "-"}</td>
                    <td className={"text-capitalize"}>
                      {item.userRole.join(", ") || "-"}
                    </td>

                    <td>
                      {moment(item.createdAt).format(
                        AppConfig.DEFAULT_DATE_FORMAT
                      )}
                    </td>
                    <td className="text-center action-btn-wrap">
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() =>
                          redirect(
                            AppRoutes.PRINCIPLE_DETAILS.replace(":id", item._id)
                          )
                        }
                        id={`tooltip-view-${item._id}`}
                      >
                        <i className="fa fa-eye" />
                      </button>
                      <UncontrolledTooltip target={`tooltip-view-${item._id}`}>
                        {`View details of ${item.question}`}
                      </UncontrolledTooltip>

                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() =>
                          redirect(
                            AppRoutes.PRINCIPLE_DETAILS_EDIT.replace(
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
                        {`Edit details of ${item.question}`}
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
                        {`Delete ${item.question}`}
                      </UncontrolledTooltip>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={"12"} className={"text-center"}>
                  No Principle Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </>
    );
  }
}

export default PrincipleList;

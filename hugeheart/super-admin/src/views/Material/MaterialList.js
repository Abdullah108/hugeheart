import React, { Component } from "react";
import { Table, UncontrolledTooltip, Badge, Input } from "reactstrap";
import Loader from "../../containers/Loader/Loader";
import { toast, ConfirmBox } from "../../helpers";
import { AppConfig, TokenKey } from "./../../config/AppConfig";
import { deleteMaterial } from "./../../methods";
import { logger } from "../../helpers";
import * as moment from "moment";
import { AppRoutes } from "../../config/AppRoutes";


class MaterialList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: [],
      selectedOption: ""
    };
  }




  /**
   * @description delete material/s method
   */
  delete = async id => {
    const { value } = await ConfirmBox({
      title: "Are you sure?",
      text: "Do you want to delete this material!"
    });
    if (!value) {
      return;
    }
    const { isSuccess, message } = await deleteMaterial(id);

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
   *@description method is use for handling multiple checkbox in material list
   */
  handleCheckAllCheckBox = e => {
    const { target } = e;
    const { checked } = target;
    const { materials } = this.props;
    if (!checked) {
      this.setState({
        ids: []
      });
    } else {
      let ids = materials.map(material => material._id);
      this.setState({
        ids: ids
      });
    }
  };

  /**
   * @description check or uncheck particualr material
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
   * @description multiple delete method
   */
  handleActionChange = e => {
    const { ids } = this.state;
    if (!ids.length) {
      toast("Please select at least one Material.", "info");
      return;
    }
    this.delete(ids);
  };

  /**
   *
   */
  activateMaterial = id => {
    logger("?fasdfasdf");
  };

  render() {
    const { materials, isLoading, skip, currentUserId, folderId, redirect } = this.props;
    const { ids, selectedOption } = this.state;
    return (
      <Table responsive bordered hover className="mt-3">
        <thead>
          <tr>
            <th width="90px">
              {materials.length ? (
                <div className="table-checkbox-wrap">
                  <span className="checkboxli checkbox-custom checkbox-default">
                    <Input
                      type="checkbox"
                      name="checkbox"
                      id="checkAll"
                      checked={ids.length === materials.length}
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
                    <option value="">Select Status</option>
                    <option value={"delete"}>Delete</option>
                  </Input>
                </div>
              ) : null}
            </th>
            <th>Material Name</th>
            <th>Year</th>
            <th>Subject</th>
            <th>Topic</th>
            <th>Subtopic</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td className={"table-loader"} colSpan={12}>
                <Loader />
              </td>
            </tr>
          ) : materials.length ? (
            materials.map((item, index) => {
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
                      <label htmlFor={Math.random()}>{skip + index + 1}.</label>
                    </div>
                  </td>
                  <td>
                    {item.materialName}
                    <br />
                    {item.createdBy && item.createdBy._id !== currentUserId ? (
                      <h6>
                        {item.status === "active" ? (
                          <Badge color={"success"}>Updated By</Badge>
                        ) : (
                          <Badge color={"warning"}>
                            Requested By{" "}
                            <a
                              href={`${AppConfig.FRONTEND_URL}/teacher/view/${item.createdBy._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {" "}
                              {item.createdBy.fullName}
                            </a>
                          </Badge>
                        )}
                      </h6>
                    ) : null}
                  </td>
                  <td>Year {item.class}</td>
                  <td>{item.subject}</td>
                  <td>{item.topic ? item.topic.name : "-"}</td>
                  <td>{item.subTopic ? item.subTopic.name : "-"}</td>
                  <td>
                    {moment(item.createdAt).format(
                      AppConfig.DEFAULT_DATE_FORMAT
                    )}
                  </td>
                  <td>
                    {item.status === "active" ? (
                      <React.Fragment>
                        <h5>
                          <Badge color={"success"}>Active</Badge>
                        </h5>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <h5 onClick={() => this.activateMaterial(item._id)}>
                          <Badge color={"warning"}>Pending</Badge>
                        </h5>
                      </React.Fragment>
                    )}
                  </td>
                  <td className="text-center action-btn-wrap">
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() =>
                        window.open(
                          `${AppConfig.SERVER_FILES_ENDPOINT}${
                            item.fileURL
                          }?token=${localStorage.getItem(TokenKey)}`
                        )
                      }
                      id={`tooltip-view-${item._id}`}
                    >
                      <i className="fa fa-eye" />
                    </button>
                    <UncontrolledTooltip target={`tooltip-view-${item._id}`}>
                      {`View Material File`}
                    </UncontrolledTooltip>

                    <button
                      type="button"
                      className="btn btn-sm "
                        onClick={() =>
                          redirect(
                            AppRoutes.MATERIAL_DETAILS_EDIT.replace(":folderId", folderId).replace(":id", item._id)
                        )
                      }
                      id={`tooltip-edit-${item._id}`}
                    >
                      <i className="fa fa-edit" />
                    </button>
                    <UncontrolledTooltip target={`tooltip-edit-${item._id}`}>
                      {`Edit ${item.materialName}`}
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
                    <UncontrolledTooltip target={`tooltip-delete-${item._id}`}>
                      {`Delete ${item.materialName}`}
                    </UncontrolledTooltip>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={"9"} className={"text-center"}>
                No Material Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  }
}

export default MaterialList;

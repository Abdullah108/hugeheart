import React, { Component } from "react";
import { Table, UncontrolledTooltip, Input } from "reactstrap";
import Loader from "../../containers/Loader/Loader";
import { toast } from "../../helpers";
import { AppConfig, TokenKey } from "../../config/AppConfig";
import { logger } from "../../helpers";
import * as moment from "moment";

class CurriculumList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: [],
      selectedOption: ""
    };
  }

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
    const { materials, isLoading, skip } = this.props;
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
            <th>Curriculum Name</th>
            <th>Country</th>
            <th>State</th>
            <th>Year</th>
            <th>Subject</th>
            <th>Created At</th>
            <th className={"text-center"}>Action</th>
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
                  <td>{item.curriculumName}</td>
                  <td>{item.country || "-"}</td>
                  <td>{item.state || "-"}</td>
                  <td>{item.class ? `Year ${item.class}` : "-"}</td>
                  <td>{item.subject || "-"}</td>
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
                      {`View Curriculum File`}
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
                      {`Delete ${item.curriculumName}`}
                    </UncontrolledTooltip>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={"9"} className={"text-center"}>
                No Curriculum Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  }
}

export default CurriculumList;

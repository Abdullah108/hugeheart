import React, { Component } from "react";
import { Table, UncontrolledTooltip } from "reactstrap";
import Loader from "../../containers/Loader/Loader";
import moment from "moment";
import { AppConfig } from "../../config";
import StatusModal from "./StatusModal";

class TasksList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatusUpdate: false,
      hideModal: true,
      selectedId: ""
    };
  }
  /**
   *
   */
  hideModal = () => {
    this.setState({
      showStatusUpdate: false
    });
    setTimeout(() => {
      this.setState({
        hideModal: true
      });
    }, 1000);
  };
  /**
   *
   */
  render() {
    const { isLoading, data, refreshList } = this.props;
    const {
      showStatusUpdate,
      hideModal,
      selectedId,
      selectedStatus
    } = this.state;
    return (
      <>
        <Table responsive bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Task</th>
              <th>Description</th>
              <th>Assignment Date</th>
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
            ) : data.length ? (
              data.map((d, index) => {
                return (
                  <tr key={index}>
                    <td>{d.assignTask}</td>
                    <td>{d.additionalNote}</td>
                    <td>
                      {moment(d.assignDate).format(
                        AppConfig.DEFAULT_ONLY_DATE_FORMAT
                      )}
                    </td>
                    <td className={"text-center"}>
                      <React.Fragment>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm text-capitalize"
                        >
                          {d.markAs || "Pending"}
                        </button>
                      </React.Fragment>
                    </td>
                    <td className={"text-center action-btn-wrap"}>
                      <React.Fragment>
                        <button
                          type="button"
                          className="btn btn-sm"
                          id={`tooltip-active-${d._id}`}
                          onClick={() =>
                            this.setState({
                              showStatusUpdate: true,
                              hideModal: false,
                              selectedId: d._id,
                              selectedStatus: d.markAs || "Pending"
                            })
                          }
                        >
                          <i className="fa fa-repeat" />
                        </button>
                        <UncontrolledTooltip target={`tooltip-active-${d._id}`}>
                          Click here to change status of task
                        </UncontrolledTooltip>
                      </React.Fragment>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className={"text-center"} colSpan={5}>
                  No task found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {!hideModal ? (
          <StatusModal
            showStatusUpdate={showStatusUpdate}
            hideModal={this.hideModal}
            id={selectedId}
            status={selectedStatus}
            refreshList={refreshList}
          />
        ) : null}
      </>
    );
  }
}

export default TasksList;

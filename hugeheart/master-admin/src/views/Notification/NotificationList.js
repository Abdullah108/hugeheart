import * as moment from "moment";
import React, { Component } from "react";
import { Table } from "reactstrap";
import { AppConfig } from "../../config";
import Loader from "../../containers/Loader/Loader";
class NotificationList extends Component {
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
    const { notifications } = this.props;
    if (!checked) {
      this.setState({
        ids: []
      });
    } else {
      const ids = [];
      for (let i = 0; i < notifications.length; i++) {
        const element = notifications[i];
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
  render() {
    const { notifications, isLoading } = this.props;

    return (
      <>
        <Table responsive bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Notification</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className={"table-loader"} colSpan={12}>
                  <Loader />
                </td>
              </tr>
            ) : notifications.length ? (
              notifications.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <a className={"view-link"} href={item.url}>
                        <b>{item.title}</b>
                        <br />
                        {item.content}
                      </a>
                      <br/>
                      {moment(item.createdAt).format(
                        AppConfig.DEFAULT_DATE_FORMAT
                      )}
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={"12"} className={"text-center"}>
                  No Notification Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </>
    );
  }
}

export default NotificationList;

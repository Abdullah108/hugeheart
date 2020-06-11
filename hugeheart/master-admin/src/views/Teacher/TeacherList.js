import * as moment from "moment";
import React, { Component } from "react";
import { Table, UncontrolledTooltip } from "reactstrap";
import { AppConfig, AppRoutes } from "../../config";
import Loader from "../../containers/Loader/Loader";
import { logger } from "../../helpers";

import UserImage from "./../../assets/avatars/user-default.svg";
class TeacherList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: [],
      selectedOption: "",
      selectedTeacher: "",
      showTrainingModal: false,
      selectedFullName: ""
    };
  }

  /**
   *
   */
  hideModal = () => {
    this.setState({
      showTrainingModal: false,
      selectedTeachers: []
    });
  };
  /**
   *
   */
  render() {
    const { users, isLoading, skip, redirect } = this.props;
    return (
      <>
        <Table responsive bordered hover className="mt-3">
          <thead>
            <tr>
              <th width="90px">#</th>
              <th>Profile Image</th>
              <th>Details</th>
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
            ) : users.length ? (
              users.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{skip + index + 1}</td>
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
                            AppRoutes.GET_TEACHER_DETAILS.replace(
                              ":id",
                              item.teacherId._id
                            )
                          );
                        }}
                      >
                        {item && item.teacherId && item.teacherId.firstName}{" "}
                        {item &&
                          item.teacherId &&
                          item.teacherId.lastName.match(/\b(\w)/g)}
                      </span>
                    </td>
                    {/* <td>{item && item.teacherId[0] && item.teacherId[0].currentAddress || "-"}</td> */}
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
                            AppRoutes.GET_TEACHER_DETAILS.replace(
                              ":id",
                              item.teacherId._id
                            )
                          )
                        }
                        id={`tooltip-view-${item.teacherId._id}`}
                      >
                        <i className="fa fa-eye" />
                      </button>
                      <UncontrolledTooltip
                        target={`tooltip-view-${item.teacherId._id}`}
                      >
                        {`View details of ${item.teacherId.fullName}`}
                      </UncontrolledTooltip>
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
      </>
    );
  }
}

export default TeacherList;

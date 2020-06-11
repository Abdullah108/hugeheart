import TeacherCalendar from "../TeacherDetails/TeacherCalendar";
import React, { Component } from "react";
import { logger } from "../../../helpers";
import { AppRoutes } from "../../../config";
import { getTeacherDetails } from "../../../methods";
import Loader from "../../../containers/Loader/Loader";

class TeacherSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: {},
      isLoading: true
    };
  }
  /**
   *
   */
  componentDidMount() {
    const { params } = this.props.match;
    const { id } = params;
    logger(id);
    if (id) {
      this.getDetails(id);
    } else {
      this.props.history.push(AppRoutes.NOT_FOUND);
    }
  }
  /**
   *
   */
  getDetails = async id => {
    this.setState({
      isLoading: true
    });
    const { isSuccess, data } = await getTeacherDetails(id);
    if (!isSuccess) {
      this.props.history.push(AppRoutes.NOT_FOUND);
      return;
    }
    this.setState({
      isLoading: false,
      userDetails: data.data
    });
  };
  render() {
    const { isLoading, userDetails } = this.state;
    const { params } = this.props.match;
    const { id } = params;
    return isLoading ? (
      <Loader />
    ) : (
      <TeacherCalendar teacherId={id} availibility={userDetails.availibility} />
    );
  }
}

export default TeacherSchedule;

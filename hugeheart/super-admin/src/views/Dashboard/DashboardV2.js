import React, { Component } from "react";
import moment from "moment";
import { Row, Col, Button } from "reactstrap";
import classNames from "classnames";
import { getDashboardTecherSchedule } from "../../methods";

import Loader from "../../containers/Loader/Loader";
import _ from "lodash";
const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];
export default class DashboardV2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teacherId: "",
      startDate: moment()
        .startOf("isoWeek")
        .format("YYYY-MM-DD"),
      endDate: moment()
        .endOf("isoWeek")
        .format("YYYY-MM-DD"),
      events: [],
      isLoading: true,
      weekNumber: 0
    };
  }
  /**
   *
   */
  componentDidMount() {
    const { teacherId } = this.props;
    this.setState(
      {
        teacherId
      },
      this.getSchedule
    );
  }
  /**
   *
   */
  getSchedule = async () => {
    this.setState({
      isLoading: true
    });
    const { startDate, endDate } = this.state;
    const { isSuccess, data } = await getDashboardTecherSchedule({
      startDate,
      endDate
    });
    if (isSuccess) {
      this.setState({
        isLoading: false,
        events: data.data
      });
      return;
    }
    this.setState({
      isLoading: false,
      events: []
    });
  };
  /**
   *
   */
  renderEvents = events => {
    const { weekNumber } = this.state;
    const eventData = [];
    events.forEach(event => {
      const date = moment(event.date).format("YYYY-MM-DD");
      eventData.push({
        ...event,
        date
      });
    });
    const data = _.chain(eventData)
      .groupBy("date")
      .map((value, key) => ({ date: key, classes: value }))
      .value();
    return weekDays.map(day => {
      const currentDay = moment()
        .isoWeekday(day)
        // just for test needs to remove
        .add(weekNumber, "week")
        .format("YYYY-MM-DD");
      const evIndex = data.findIndex(d => d.date === currentDay);
      const ev = data[evIndex] || {};
      const classes = ev.classes || [];
      return classes.length ? (
        <td key={day}>
          {classes.map((classDetails, ind) => {
            const student = classDetails.studentId || {};
            return (
              <React.Fragment key={ind}>
                {student.fullName ? (
                  <div
                    className={classNames({
                      "student-details": true,
                      "trial-class": (classDetails || {}).isTrialClass,
                      "completed-class": (classDetails || {}).isCompleted
                    })}
                  >
                    <span className="text-capitalize">
                      {student.fullName || "-"}
                    </span>
                    <br />
                    <span>
                      Time:{" "}
                      {classDetails.startDateTime
                        ? moment(classDetails.startDateTime).format("hh:mm a")
                        : "-"}
                    </span>
                    <br />
                    <span>Year: {student.year || "-"}</span>
                    <br />
                    <span>Study Problem: {student.studyProblems || "N/A"}</span>
                    <br />
                    <span>Subject: {student.subjects || "N/A"}</span>
                  </div>
                ) : (
                  "-"
                )}
                <br />
              </React.Fragment>
            );
          })}
        </td>
      ) : (
        <td key={Math.random()} className="text-center">
          -
        </td>
      );
    });
  };
  /**
   *
   */
  groupTeachers = teachersEvents => {
    return teachersEvents.map(teacher => {
      const { event } = teacher;
      return (
        <tr key={teacher._id}>
          <th className={"text-left"}>{teacher.fullName}</th>
          {this.renderEvents(event)}
        </tr>
      );
    });
  };
  /**
   *
   */
  changeWeek = inc => {
    const isReset = inc === 0;
    const weekNumber = isReset ? inc : this.state.weekNumber + inc;
    this.setState(
      {
        weekNumber,
        startDate: moment()
          .startOf("isoWeek")
          .add(weekNumber, "week")
          .format("YYYY-MM-DD"),
        endDate: moment()
          .endOf("isoWeek")
          .add(weekNumber, "week")
          .format("YYYY-MM-DD")
      },
      this.getSchedule
    );
  };
  /**
   *
   */
  renderControls = () => {
    return (
      <Row>
        <Col sm="4" className="text-left">
          <Button onClick={() => this.changeWeek(-1)} color="primary">
            Previous Week
          </Button>
        </Col>
        <Col sm="4" className="text-center">
          <Button onClick={() => this.changeWeek(0)}>Current Week</Button>
        </Col>
        <Col sm="4" className="text-right">
          <Button onClick={() => this.changeWeek(1)} color="primary">
            Next Week
          </Button>
        </Col>
      </Row>
    );
  };
  /**
   *
   */
  render() {
    const { events, isLoading, weekNumber } = this.state;
    return (
      <>
        {this.renderControls()}
        <br />
        <div id="table-scroll" class="table-scroll">
          <table id="main-table" class="main-table">
            <thead>
              <tr>
                <th className="text-center">Teacher</th>
                {weekDays.map((day, index) => (
                  <th key={index} className="text-center">
                    {day}
                    <br />(
                    {moment()
                      .isoWeekday(day)
                      .add(weekNumber, "week")
                      .format("LL")}
                    )
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center">
                    <Loader />
                  </td>
                </tr>
              ) : (
                this.groupTeachers(events || [])
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

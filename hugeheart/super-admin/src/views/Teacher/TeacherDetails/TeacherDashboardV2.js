import React, { Component } from "react";
import CardContainer from "../../../containers/CardContainer";
import moment from "moment";
import { Row, Col, Button } from "reactstrap";
import classNames from "classnames";
import { getTeacherSchedule } from "../../../methods";
import NoData from "../../../components/NoData";
import Loader from "../../../containers/Loader/Loader";
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
export default class TeacherDashboardV2 extends Component {
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
    const { startDate, endDate, teacherId } = this.state;
    const { isSuccess, data } = await getTeacherSchedule({
      id: teacherId,
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
  groupTeachers = events => {
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
    let highestNumber = 0;
    const row = weekDays.map((day, index) => {
      const currentDay = moment()
        .isoWeekday(day)
        // just for test needs to remove
        .add(weekNumber, "week")
        .format("YYYY-MM-DD");
      const evIndex = data.findIndex(d => d.date === currentDay);
      const ev = data[evIndex] || {};
      const classes = ev.classes || [];
      let newTest = {
        ...ev,
        date: currentDay,
        classes: []
      };
      classes.forEach(cl => {
        if (cl.studentId) {
          newTest.classes.push(cl);
        }
      });
      highestNumber =
        newTest.classes.length > highestNumber
          ? newTest.classes.length
          : highestNumber;
      return newTest;
    });
    const returnData = [];
    for (let i = 0; i < highestNumber; i++) {
      returnData.push(
        <tr key={i}>
          {weekDays.map((d, ik) => {
            const currentDay = moment()
              .isoWeekday(d)
              // just for test needs to remove
              .add(weekNumber, "week")
              .format("YYYY-MM-DD");
            const ind = row.findIndex(d => {
              return d.date === currentDay;
            });
            const classDetails = row[ind].classes[i] ? row[ind].classes[i] : {};
            const student = classDetails.studentId || {};

            return (
              <td key={ik}>
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
              </td>
            );
          })}
        </tr>
      );
    }
    return returnData.length ? (
      returnData
    ) : (
      <tr>
        <td colSpan={8} className="text-center">
          <NoData message={"No classes scheduled for this week"} />
        </td>
      </tr>
    );
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
      <CardContainer title={"Schedule"} icon={"fa fa-calendar"}>
        {this.renderControls()}
        <hr />
        <br />
        <div
          className={classNames({
            "table-responsive": true
          })}
        >
          <table className="table">
            <thead>
              <tr>
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
        <hr />
        {/* {this.renderControls()} */}
      </CardContainer>
    );
  }
}

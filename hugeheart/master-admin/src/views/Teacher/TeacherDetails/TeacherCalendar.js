import React, { Component } from "react";
import CardContainer from "../../../containers/CardContainer";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { logger } from "../../../helpers";
import { getTeacherSchedule } from "../../../methods/Teacher";
import moment from "moment";
import Loader from "../../../containers/Loader/Loader";

class TeacherCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teacherId: "",
      endDate: moment().format("YYYY-MM-DD"),
      startDate: moment()
        .startOf("month")
        .format("YYYY-MM-DD"),
      isLoading: true,
      events: []
    };
  }
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
      isLoading: true,
      events: []
    });
    const { teacherId, startDate, endDate } = this.state;
    const { isSuccess, data } = await getTeacherSchedule({
      id: teacherId,
      startDate,
      endDate
    });
    logger(isSuccess, data);
    this.setState({
      isLoading: false,
      events: isSuccess && data.data ? data.data : []
    });
  };
  /**
   *
   */
  onEventClick = ({ event }) => {
    logger(event);
  };
  /**
   *
   */
  getDays = () => {
    const { availibility } = this.props;
    const dayObj = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 7
    };
    return (availibility || []).map(day => {
      return dayObj[day.value.toLowerCase()] || false;
    });
  };
  /**
   *
   */
  render() {
    const { isLoading, events } = this.state;
    logger(this.props);
    const getEvents = (data, success) => {
      const { startDate, endDate } = this.state;
      const { startStr, endStr } = data;
      const currentStartDate = moment(startStr).format("YYYY-MM-DD");
      const currentEndDate = moment(endStr).format("YYYY-MM-DD");
      if (
        (!isLoading && currentStartDate !== startDate) ||
        endDate !== currentEndDate
      ) {
        this.setState(
          {
            startDate: currentStartDate,
            endDate: currentEndDate
          },
          this.getSchedule
        );
        return;
      }
      success(
        events && events.map
          ? events.map(event => ({
              title: `\n${event.studentId.fullName}`,
              start: new Date(event.startDateTime),
              end: new Date(event.endDateTime),
              color: event.isTrialClass ? "#ff000054" : undefined
            }))
          : []
      );
    };
    return (
      <CardContainer title={"Schedule"} icon={"fa fa-calendar"}>
        {isLoading ? (
          <>
            <Loader />
            <br />
            <br />
          </>
        ) : null}

        <div
          style={{
            display: isLoading ? "none" : "block"
          }}
        >
          <FullCalendar
            defaultView="dayGridMonth"
            header={{
              left: "title",
              center: "prev,next, today",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
            }}
            businessHours={{
              daysOfWeek: this.getDays()
            }}
            plugins={[dayGridPlugin, timeGridPlugin]}
            events={getEvents}
            displayEventTime={true}
            displayEventEnd={true}
            eventClick={this.onEventClick}
            dateClick={this.onDateClick}
            showNonCurrentDates={false}
            fixedWeekCount={false}
            slotLabelFormat={[
              {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              }
            ]}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            }}
          />
        </div>
      </CardContainer>
    );
  }
}

export default TeacherCalendar;

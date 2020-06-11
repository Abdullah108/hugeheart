import React, { Component } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { studentSchedule } from "../../methods";
import moment from "moment";
import Loader from "../../containers/Loader/Loader";

class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment().startOf("month").format("YYYY-MM-DD"),
      endDate: moment().endOf("month").format("YYYY-MM-DD"),
      events: [],
      isLoading: true,
    };
  }
  /**
   *
   */
  componentDidMount() {
    this.getSchedule();
  }
  /**
   *
   */
  getSchedule = async () => {
    this.setState({
      isLoading: true,
    });
    const { startDate, endDate } = this.state;
    const { isSuccess, data } = await studentSchedule({ startDate, endDate });
    if (isSuccess) {
      this.setState({
        isLoading: false,
        events: data.data,
      });
      return;
    }
    this.setState({
      isLoading: false,
      events: [],
    });
  };
  /**
   *
   */
  render() {
    const { isLoading, events } = this.state;
    const getEvents = (data, success) => {
      const { startDate, endDate } = this.state;
      const { startStr, endStr } = data;
      const currentStartDate = moment(startStr).format("YYYY-MM-DD");
      const currentEndDate = moment(endStr).format("YYYY-MM-DD");
      if (
        (!isLoading && currentStartDate !== startDate) ||
        (!isLoading && endDate !== currentEndDate)
      ) {
        this.setState(
          {
            startDate: currentStartDate,
            endDate: currentEndDate,
          },
          this.getSchedule
        );
        return;
      }
      success(
        events && events.map
          ? events.map((event) => ({
              title: `\nClass with ${event.teacherId.fullName}`,
              start: new Date(event.startDateTime),
              end: new Date(event.endDateTime),
              color: event.isTrialClass ? "#ff000054" : undefined,
            }))
          : []
      );
    };
    return (
      <>
        {isLoading ? <Loader /> : null}.
        <div
          style={{
            display: isLoading ? "none" : "block",
          }}
        >
          <FullCalendar
            defaultView="dayGridMonth"
            header={{
              left: "title",
              center: "prev,next, today",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            plugins={[dayGridPlugin, timeGridPlugin]}
            events={getEvents}
            displayEventTime
            displayEventEnd
            showNonCurrentDates={false}
            fixedWeekCount={false}
            slotLabelFormat={[
              {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              },
            ]}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }}
          />
        </div>
      </>
    );
  }
}

export default StudentDashboard;

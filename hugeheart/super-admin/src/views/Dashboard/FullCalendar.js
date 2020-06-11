import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { logger } from "../../helpers";
import { getDashboardTecherSchedule } from "../../methods";
import Loader from "../../containers/Loader/Loader";
import { uniqBy, map } from "lodash";
const localizer = momentLocalizer(moment);

class FullCalendars extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      events: [],
      startDate: moment().startOf("week"),
      endDate: moment().endOf("week")
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
    const { startDate, endDate } = this.state;
    this.setState({
      isLoading: true,
      data: []
    });
    const data = {
      startDate: moment(startDate).format("YYYY-MM-DD"),
      endDate: moment(endDate).format("YYYY-MM-DD")
    };
    const { isSuccess, data: resp } = await getDashboardTecherSchedule(data);
    logger(resp);
    this.setState({
      isLoading: false,
      data: isSuccess ? resp.data : []
    });
  };
  /**
   *
   */
  onRangeChange = date => {
    const startDate = date.start ? date.start : date[0];
    const endDate = date.end ? date.end : date[date.length - 1];
    logger(startDate, endDate);
    this.setState(
      {
        startDate,
        endDate
      },
      this.getSchedule
    );
  };

  /**
   *
   */
  render() {
    const { isLoading, data, startDate } = this.state;
    const teachers = uniqBy(data, "_id");
    const resourceMap = map(teachers, teacher => ({
      resourceId: teacher._id,
      resourceTitle: teacher.fullName
    }));
    const events = [];
    for (const key in teachers) {
      if (teachers.hasOwnProperty(key)) {
        const e = teachers[key];
        e.event.forEach(d => {
          if ("5db5e341d7b87a0ce814c4f2" === e._id)
            console.log(
              d.endDateTime,
              d.startDateTime,
              new Date(
                d.endDateTime || moment(d.startDateTime).add(2, "hours")
              ),
              e._id
            );
          events.push({
            start: new Date(d.startDateTime),
            end: new Date(
              d.endDateTime || moment(d.startDateTime).add(2, "hours")
            ),
            title: d.studentId ? d.studentId.fullName : "Event Schedule",
            resourceId: e._id
          });
        });
      }
    }
    console.log("resourceMap", resourceMap, events);
    const today = new Date();
    return (
      <div className="demo-app">
        {isLoading ? <Loader /> : null}
        <div
          style={{
            display: isLoading ? "none" : "block"
          }}
        >
          <Calendar
            localizer={localizer}
            defaultDate={new Date(startDate)}
            defaultView="week"
            min={
              new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                8
              )
            }
            events={events}
            style={{ height: 400 }}
            views={["day", "week", "month"]}
            popup
            resources={resourceMap}
            resourceIdAccessor="resourceId"
            resourceTitleAccessor="resourceTitle"
            onRangeChange={this.onRangeChange}
            t
          />
        </div>
      </div>
    );
  }
}

export default FullCalendars;

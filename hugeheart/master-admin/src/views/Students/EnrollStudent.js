import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  Row,
  Col,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import { logger, SubjectOptions, toast, gePriceByYear } from "../../helpers";
import Select from "react-select";
import { enrollStudent } from "../../methods";
import LoadingButton from "../../components/LoadingButton";
import Switch from "react-ios-switch";
import TimePicker from "react-time-picker";
import moment from "moment";

export const daysOptions = [
  {
    label: "Monday",
    value: "Monday",
    hours: 2,
  },
  {
    label: "Tuesday",
    value: "Tuesday",
    hours: 2,
  },
  {
    label: "Wednesday",
    value: "Wednesday",
    hours: 2,
  },
  {
    label: "Thursday",
    value: "Thursday",
    hours: 2,
  },
  {
    label: "Friday",
    value: "Friday",
    hours: 2,
  },
  {
    label: "Saturday",
    value: "Saturday",
    hours: 2,
  },
  {
    label: "Sunday",
    value: "Sunday",
    hours: 2,
  },
];

const getTime = (days) => {
  const time = moment().format("HH:mm");
  return days.map((d) => ({ ...d, time }));
};

class EnrollStudent extends Component {
  initialState = {
    numberofweek: "",
    subjects: [],
    days: [],
    subjectOptions: [],
    enrollmentDate: "",
    estimateAmount: 0,
    errors: {},
    cumEstimatedAmount: 0,
    daysOptions: Object.assign([], getTime(daysOptions)),
  };
  constructor(props) {
    super(props);
    this.state = Object.assign({}, this.initialState);
  }
  /**
   *
   */
  componentDidMount() {
    this.setState({
      subjectOptions: SubjectOptions,
    });
  }
  /**
   *
   */
  componentDidUpdate({ studentId: prevStudentId }) {
    const { studentId } = this.props;
    logger(this.initialState);
    if (studentId !== prevStudentId) {
      this.setState(this.initialState);
    }
  }
  /**
   *
   */
  handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: null,
      },
    });
  };
  /**
   *
   */
  onSubjectChange = (subjects) => {
    this.setState({
      subjects: (subjects || []).map((d) => d.value),
      errors: {
        ...this.state.errors,
        subjects: null,
      },
    });
  };
  /**
   *
   */
  onAvailityUpdate = (days) => {
    this.setState({
      days: (days || []).map((d) => d.value),
      errors: {
        ...this.state.errors,
        days: null,
      },
    });
  };
  /**
   *
   */
  onDayChange = ({ value: day, hours, time }) => {
    const { days } = this.state;
    const index = days.findIndex((d) => d.day === day);
    if (index > -1) {
      days.splice(index, 1);
    } else {
      days.push({
        day,
        hours,
        time,
      });
    }
    this.setState({
      days,
    });
  };
  /**
   *
   */
  handleSubmit = async (e) => {
    this.setState({
      isLoading: true,
    });
    e.preventDefault();
    const {
      days,
      subjects,
      enrollmentDate,
      numberofweek,
      estimateAmount,
    } = this.state;
    const { selecteStudentId } = this.props;
    const data = {
      days,
      subjects,
      enrollmentDate: enrollmentDate
        ? enrollmentDate.toString()
        : new Date().toString(),
      numberofweek,
      selectedDays: days && days.length ? days.length : 0,
      selectedSubjects: subjects && subjects.length ? subjects.length : 0,
      estimateAmount,
    };
    logger(data);
    const { isSuccess, data: resp, errors, message } = await enrollStudent(
      data,
      selecteStudentId
    );
    if (!isSuccess) {
      if (errors) {
        this.setState({
          errors,
          isLoading: false,
        });
      } else {
        toast(message, "error");
        this.setState({
          isLoading: false,
        });
      }
      return;
    }
    toast(message, "success");
    console.log(data);
    this.setState({
      isLoading: false,
    });
    this.props.hideModal();
    this.props.refreshList();
    logger(isSuccess, resp, errors);
    console.log("Muhammad");
    console.log(estimateAmount);
  };
  /**
   *
   */
  onDayHourChange = (e, day) => {
    const { value } = e.target;
    const { days } = this.state;
    const index = days.findIndex((d) => d.day === day.value);
    if (index > -1) {
      days[index].hours = value;
    }
    this.setState({
      days,
    });
  };
  /**
   *
   */
  /**
   * Changes By Muhammad
   */
  changeEstimateAmount = (
    priceData,
    days,
    selectedItem,
    estimateAmount,
    numberofweek
  ) => {
    // const selectedDays = days.map(d => ({ label: d, value: d }));
    const { year } = selectedItem || {};
    const price = gePriceByYear(priceData, year);
    //let estimateAmount = 0;
    days.forEach((d) => {
      estimateAmount += Number(d.hours) * price;
    });
    estimateAmount = estimateAmount * numberofweek;
  };
  onChange = (index, date, estimateAmount) => {
    logger(index, date, estimateAmount);
    const { days } = this.state;
    days[index].time = date;
    this.setState({
      days,
    });
  };
  /**
   *
   */
  renderDay = (day, selected = false) => {
    const { days } = this.state;
    const index = days.findIndex((d) => d.day === day.value);
    const hours = index > -1 ? days[index].hours : 2;

    return (
      <Col sm={"12"} style={{ margin: `10px 0px` }}>
        <Row>
          <Col sm={"5"}>
            <Row>
              <Col sm={"6"}>
                <span>
                  <b>{day.label}&nbsp;&nbsp;</b>
                </span>
              </Col>
              <Col sm={"6"}>
                <Switch
                  checked={selected}
                  onChange={() => this.onDayChange(day)}
                />
              </Col>
            </Row>
          </Col>
          <Col sm={"4"}>
            {selected ? (
              <Input
                placeholder={"Number of hours"}
                type={"number"}
                min={1}
                value={hours}
                onChange={(e) => this.onDayHourChange(e, day)}
              />
            ) : null}
          </Col>
          <Col sm={"3"}>
            {selected ? (
              <>
                {console.log(day)}
                <TimePicker
                  onChange={(time) => this.onChange(index, time)}
                  value={day.time}
                />
              </>
            ) : null}
          </Col>
        </Row>
      </Col>
    );
  };
  /**
   *
   */
  render() {
    const { hideModal, isOpen, selectedItem, priceData } = this.props;
    let {
      errors,
      enrollmentDate,
      numberofweek,
      subjectOptions,
      days,
      subjects,
      isLoading,
      daysOptions,
      estimateAmount,
    } = this.state;
    const selectedSubjects = subjects.map((d) => ({ label: d, value: d }));
    // const selectedDays = days.map(d => ({ label: d, value: d }));
    const { year } = selectedItem || {};
    const price = gePriceByYear(priceData, year);
    //let estimateAmount = 0;
    days.forEach((d) => {
      estimateAmount += Number(d.hours) * price;
    });
    estimateAmount = estimateAmount * numberofweek;
    return (
      <Modal centered size={"lg"} isOpen={isOpen} toggle={hideModal}>
        <Form>
          <ModalHeader toggle={hideModal}>Enroll Student</ModalHeader>
          <ModalBody>
            <br />
            <br />
            <Row>
              <Col sm={"6"}>
                <FormGroup>
                  <Input
                    type={"number"}
                    name={"numberofweek"}
                    id={"numberofweek"}
                    value={numberofweek}
                    className={"floating-input"}
                    onChange={this.handleChange}
                    min={1}
                  />
                  <Label
                    className="floating-label form-label"
                    for={"numberofweek"}
                  >
                    Number of weeks
                  </Label>
                  {errors["numberofweek"] ? (
                    <p className={"text-danger"}>{errors["numberofweek"]}</p>
                  ) : null}
                </FormGroup>
              </Col>
              <Col sm={"6"}>
                <FormGroup>
                  <Flatpickr
                    onChange={(date) => {
                      logger(date[0]);
                      this.setState({
                        enrollmentDate: date[0].toString(),
                      });
                    }}
                    options={{
                      altInput: true,
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d",
                      minDate: new Date(),
                    }}
                    name={"enrollmentDate"}
                    id={`trialClass-enrollment-date`}
                    className={"floating-input"}
                    value={
                      enrollmentDate ? new Date(enrollmentDate) : new Date()
                    }
                  />
                  <Label
                    className="floating-label form-label"
                    for={`trialClass-enrollmentDate`}
                  >
                    Enrollment Date
                  </Label>
                  {errors.enrollmentDate ? (
                    <p className={"text-danger"}>{errors.enrollmentDate}</p>
                  ) : null}
                </FormGroup>
              </Col>
              <Col sm={"12"}>
                <FormGroup>
                  <Label className=" form-label" for="subjects">
                    Subjects Enrolled
                  </Label>
                  <Select
                    name="subjects"
                    options={subjectOptions}
                    onChange={this.onSubjectChange}
                    value={selectedSubjects}
                    placeholder={"Choose Subjects"}
                    isMulti
                  />
                  {errors.subjects ? (
                    <p className={"text-danger"}>{errors.subjects}</p>
                  ) : null}
                </FormGroup>
              </Col>
              <Col sm={"12"}>
                <Row>
                  {daysOptions.map((day, index) => (
                    <React.Fragment key={index}>
                      {this.renderDay(
                        day,
                        days.findIndex((d) => d.day === day.value) > -1
                      )}
                    </React.Fragment>
                  ))}
                </Row>
              </Col>
              <Col sm={"12"}>
                <Label className=" form-label" for="subjects">
                  <b>Muhammad Estimate Amount: ${estimateAmount}</b>
                </Label>
                <Input
                  type={"hidden"}
                  name={"estimateAmount"}
                  id={"estimateAmount"}
                  value={estimateAmount}
                  className={"floating-input"}
                  onChange={this.changeEstimateAmount(
                    priceData,
                    days,
                    selectedItem,
                    estimateAmount,
                    numberofweek
                  )}
                  min={1}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              color={"danger"}
              className={"btn-cancel btn-submit btn-link"}
              onClick={hideModal}
            >
              Close
            </Button>
            {isLoading ? (
              <LoadingButton />
            ) : (
                <Button
                  type="submit"
                  onClick={this.handleSubmit}
                  color={"primary"}
                  className={"btn-submit btn-link"}
                >
                  Save
                </Button>
              )}
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

export default EnrollStudent;

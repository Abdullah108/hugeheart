import React, { Component } from "react";
import CardContainer from "../../../containers/CardContainer";
import { Form, Row, Col, FormGroup, Input, Label, Button } from "reactstrap";
import Select from "react-select";
import Async from "react-select/async";
import {
  ClassList,
  SubjectOptions,
  logger,
  toast,
  ErrorMessage
} from "../../../helpers";
import LoadingButton from "../../../components/LoadingButton";
import { AppRoutes } from "../../../config";
import Flatpickr from "react-flatpickr";
import {
  addStudent,
  getStudentDetails,
  getUsers,
  getAllTeachers
} from "../../../methods";
import Loader from "../../../containers/Loader/Loader";
class AddStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      parentFirstName: "",
      parentLastName: "",
      contactNumber: "",
      email: "",
      year: "",
      classOptions: Object.assign([], ClassList),
      subjectOptions: Object.assign([], SubjectOptions),
      studyProblems: "",
      subjects: [],
      trialClass1: "",
      trialClass2: "",
      trialClass3: "",
      address: "",
      errors: {},
      studentId: null,
      isFetchingDetails: false,
      isLoading: false,
      masterAdminId: "",
      masterAdmins: [],
      teacherId: "",
      teachers: []
    };
  }
  componentDidMount() {
    const { match } = this.props;
    const { params } = match;
    const { id } = params;
    if (id) {
      this.setState(
        {
          studentId: id,
          isFetchingDetails: true
        },
        this.getStudentDetails
      );
    } else {
      this.getTeachers();
    }
    this.getMasterAdmins();
  }
  /**
   *
   */
  getTeachers = async () => {
    const { isSuccess, data } = await getAllTeachers();
    logger(isSuccess, data);
    if (isSuccess) {
      this.setState({
        teachers: data.data
      });
    }
  };
  /**
   *
   */
  getMasterAdmins = async () => {
    const { isSuccess, data } = await getUsers();
    logger(isSuccess, data);
    if (isSuccess) {
      this.setState({
        masterAdmins: data.data
      });
    }
  };
  /**
   *
   */
  getStudentDetails = async () => {
    try {
      const { studentId } = this.state;
      const { isSuccess, data } = await getStudentDetails(studentId);
      if (isSuccess) {
        const { data: details } = data;
        const {
          firstName,
          lastName,
          email,
          parentFirstName,
          parentLastName,
          contactNumber,
          year,
          trialClass,
          selectedSubjects,
          studyProblems,
          address,
          masterAdminId,
          enrollmentStatus
        } = details;
        const trialClass1 = trialClass[0] ? new Date(trialClass[0]) : "";
        const trialClass2 = trialClass[1] ? new Date(trialClass[1]) : "";
        const trialClass3 = trialClass[2] ? new Date(trialClass[2]) : "";
        logger(selectedSubjects);
        this.setState({
          isFetchingDetails: false,
          firstName,
          lastName,
          email,
          parentFirstName,
          parentLastName,
          contactNumber,
          year,
          trialClass1,
          trialClass2,
          trialClass3,
          studyProblems,
          address,
          subjects:
            selectedSubjects && selectedSubjects.map
              ? selectedSubjects.map(sub => ({ label: sub, value: sub }))
              : [],
          masterAdminId: masterAdminId._id,
          enrollmentStatus
        });
        return;
      }
      this.props.history.push(AppRoutes.NOT_FOUND);
    } catch (error) {
      this.setState({
        isLoading: false
      });
    }
  };
  /**
   *
   */
  handleChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: null
      }
    });
  };
  /**
   *
   */
  renderInput = (label, name, type = "text") => {
    const { errors } = this.state;
    return (
      <Col sm={"6"}>
        <FormGroup>
          <Input
            type={type}
            name={name}
            id={name}
            value={this.state[name]}
            className={"floating-input"}
            onChange={this.handleChange}
          />
          <Label className="floating-label form-label" for={name}>
            {label}
          </Label>
          {errors[name] ? (
            <p className={"text-danger"}>{errors[name]}</p>
          ) : null}
        </FormGroup>
      </Col>
    );
  };
  /**
   *
   */
  renderFlatpickr = (label, name) => {
    const { errors, studentId } = this.state;
    const id = Math.random();
    return (
      <Col sm={"6"}>
        <FormGroup>
          <Flatpickr
            onChange={date => {
              logger(this.state[name]);
              this.setState({
                [name]: date[0].toString()
              });
            }}
            options={{
              altInput: true,
              altFormat: "F j, Y H:i",
              dateFormat: "Y-m-d",
              minDate:
                studentId && this.state[name]
                  ? new Date(this.state[name])
                  : new Date(),
              enableTime: true
            }}
            name={name}
            id={`trialClass-${id}`}
            className={"floating-input"}
            value={this.state[name] ? new Date(this.state[name]) : undefined}
          />
          <Label className="floating-label form-label" for={`trialClass-${id}`}>
             {label}
          </Label>
          {errors[name] ? (
            <p className={"text-danger"}>{errors[name]}</p>
          ) : null}
        </FormGroup>
      </Col>
    );
  };
  /**
   *
   */
  onYearChange = year => {
    this.setState({
      year: year.value,
      errors: {
        ...this.state.errors,
        year: null
      }
    });
  };
  /**
   *
   */
  onSubjectChange = subjects => {
    this.setState({
      subjects: subjects || [],
      errors: {
        ...this.state.errors,
        subjects: null
      }
    });
  };
  /**
   *
   */
  handleSubmit = async e => {
    e.preventDefault();
    const {
      subjects,
      email,
      firstName,
      lastName,
      parentFirstName,
      parentLastName,
      contactNumber,
      year,
      trialClass1,
      trialClass2,
      trialClass3,
      address,
      studyProblems,
      studentId,
      teacherId,
      masterAdminId
    } = this.state;
    const data = {
      selectedSubjects: subjects.map(d => d.value),
      email,
      firstName,
      lastName,
      parentFirstName,
      parentLastName,
      contactNumber,
      year,
      trialClass1: trialClass1 ? trialClass1.toString() : "",
      trialClass2: trialClass2 ? trialClass2.toString() : "",
      trialClass3: trialClass3 ? trialClass3.toString() : "",
      address,
      studyProblems,
      teacherId,
      masterAdminId
    };
    logger(data);
    this.setState({
      isLoading: true,
      errors: {}
    });
    try {
      const { isSuccess, message, errors } = await addStudent(data, studentId);
      if (!isSuccess) {
        toast(message || ErrorMessage.DEFAULT_EROR_MESSAGE, "error");
        this.setState({
          isLoading: false,
          errors: errors || {}
        });
        return;
      }
      logger(isSuccess, message, errors);
      this.setState({
        isLoading: false
      });
      toast(message || "Student details added successfully.", "success");
      this.props.history.push(AppRoutes.STUDENTS);
    } catch (error) {
      logger(error);
      this.setState({
        isLoading: false
      });
      toast(ErrorMessage.DEFAULT_EROR_MESSAGE, "error");
    }
  };
  /**
   *
   */
  onMasterAdminChange = masterAdmin => {
    this.setState({
      masterAdminId: masterAdmin ? masterAdmin.value : ""
    });
  };
  /**
   *
   */
  onTeacherChange = teacherId => {
    this.setState({
      teacherId: teacherId ? teacherId.value : ""
    });
  };
  /**
   *
   */
  loadMasterAdminOptions = async (e, callback) => {
    const { isSuccess, data } = await getUsers({
      search: e
    });
    if (!isSuccess) {
      callback([]);
      return;
    }
    callback(
      data.data.map(masterAdmin => ({
        label: masterAdmin.fullName,
        value: masterAdmin._id
      }))
    );
  };
  loadTeacherOptions = async (e, callback) => {
    const { isSuccess, data } = await getAllTeachers({
      search: e
    });
    if (!isSuccess) {
      callback([]);
      return;
    }
    callback(
      data.data.map(masterAdmin => ({
        label: masterAdmin.fullName,
        value: masterAdmin._id
      }))
    );
  };
  /**
   *
   */
  render() {
    const {
      studentId,
      errors,
      classOptions,
      year,
      isLoading,
      subjectOptions,
      subjects,
      isFetchingDetails,
      masterAdminId,
      masterAdmins,
      teacherId,
      teachers,
      enrollmentStatus
    } = this.state;
    const masterAdminOption = masterAdmins.map(masterAdmin => ({
      label: masterAdmin.fullName,
      value: masterAdmin._id
    }));
    const indx = masterAdminOption.findIndex(d => d.value === masterAdminId);
    const selectedMasterAdmin = indx > -1 ? masterAdminOption[indx] : null;
    const teacherOption = teachers.map(masterAdmin => ({
      label: masterAdmin.fullName,
      value: masterAdmin._id
    }));
    const ind = teacherOption.findIndex(d => {
      return d.value === teacherId;
    });
    const selectedTeacher = ind > -1 ? teacherOption[ind] : null;
    return (
      <CardContainer title="Student Details" icon="fa fa-user-plus">
        <Form onSubmit={this.handleSubmit}>
          {isFetchingDetails ? (
            <Loader />
          ) : (
            <>
              <Row>
                {this.renderInput("Parent's First Name", "parentFirstName")}
                {this.renderInput("Parent's Last Name", "parentLastName")}
                {this.renderInput("Student First Name", "firstName")}
                {this.renderInput("Student Last Name", "lastName")}
                {this.renderInput("Parent's Contact Number", "contactNumber")}
                {this.renderInput("Email", "email")}

                <Col sm={"6"}>
                  <FormGroup>
                    <Label className=" form-label" for="_class">
                      Year
                    </Label>
                    <Select
                      name="year"
                      options={classOptions}
                      onChange={this.onYearChange}
                      value={
                        year ? { label: `Year ${year}`, value: year } : null
                      }
                      placeholder={"Choose Year"}
                    />

                    {errors.year ? (
                      <p className={"text-danger"}>{errors.year}</p>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col sm={"6"}>
                  <FormGroup>
                    <Label className=" form-label" for="subjects">
                      Subjects Enrolled
                    </Label>
                    <Select
                      name="subjects"
                      options={subjectOptions}
                      onChange={this.onSubjectChange}
                      value={subjects}
                      placeholder={"Choose Subjects"}
                      isMulti
                    />
                    {errors.subjects ? (
                      <p className={"text-danger"}>{errors.subjects}</p>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col sm={"6"}>
                  <FormGroup>
                    <Label className=" form-label" for="_class">
                      Master Admin
                    </Label>
                    <Async
                      defaultOptions={masterAdminOption}
                      onChange={this.onMasterAdminChange}
                      placeholder={"Choose Master Admin"}
                      value={selectedMasterAdmin}
                      loadOptions={this.loadMasterAdminOptions}
                      isClearable
                    />

                    {errors.masterAdminId ? (
                      <p className={"text-danger"}>{errors.masterAdminId}</p>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col sm={"6"}>
                  {studentId ? null : (
                    <FormGroup>
                      <Label className="form-label" for="_class">
                        Assign Teacher
                      </Label>
                      <Async
                        defaultOptions={teacherOption}
                        onChange={this.onTeacherChange}
                        placeholder={"Choose Teacher"}
                        value={selectedTeacher}
                        loadOptions={this.loadTeacherOptions}
                        isClearable
                      />

                      {errors.masterAdminId ? (
                        <p className={"text-danger"}>{errors.masterAdminId}</p>
                      ) : null}
                    </FormGroup>
                  )}
                </Col>
                {this.renderInput(
                  "Study Problems",
                  "studyProblems",
                  "textarea"
                )}
                {this.renderInput("Address", "address", "textarea")}
                {studentId && enrollmentStatus === "enrolled"
                  ? null
                  : this.renderFlatpickr(
                      "Trial Class Date and Time",
                      "trialClass1"
                    )}
                {/* {this.renderFlatpickr(
                  "Trial Class Date and Time 2",
                  "trialClass2"
                )}
                {this.renderFlatpickr(
                  "Trial Class Date and Time 3",
                  "trialClass3"
                )} */}
              </Row>
              <FormGroup>
                <Col sm={{ size: 4, offset: 8 }} className={"text-right"}>
                  <Button
                    type="button"
                    color={"danger"}
                    className={"btn-cancel btn-submit btn-link"}
                    onClick={() => {
                      this.props.history.push(AppRoutes.STUDENTS);
                    }}
                  >
                    Cancel
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
                </Col>
              </FormGroup>
            </>
          )}
        </Form>
      </CardContainer>
    );
  }
}

export default AddStudent;

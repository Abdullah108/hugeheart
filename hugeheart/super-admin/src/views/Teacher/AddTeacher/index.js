import React, { Component } from "react";
import {
  Row,
  Col,
  FormGroup,
  Card,
  CardHeader,
  CardBody,
  Form,
  Label,
  Input,
  Button,
  InputGroup,
  UncontrolledTooltip
} from "reactstrap";
import LoadingButton from "../../../components/LoadingButton";
import Select from "react-select";
import { AppRoutes } from "../../../config/AppRoutes";
import {
  addUpdateTeacher,
  getTeacherDetails,
  getAllFolders
} from "../../../methods";
import { toast, logger, ValidateImage, SubjectOptions } from "../../../helpers";
import Loader from "../../../containers/Loader/Loader";
import { AcceptedDocFormat } from "../../../config";

const detaultEduDetail = {
  degree: "",
  university: ""
};
const defaultPastExperience = {
  duration: "",
  center: ""
};
export const daysOptions = [
  {
    label: "Monday",
    value: "Monday"
  },
  {
    label: "Tuesday",
    value: "Tuesday"
  },
  {
    label: "Wednesday",
    value: "Wednesday"
  },
  {
    label: "Thursday",
    value: "Thursday"
  },
  {
    label: "Friday",
    value: "Friday"
  },
  {
    label: "Saturday",
    value: "Saturday"
  },
  {
    label: "Sunday",
    value: "Sunday"
  }
];
class AddMasterAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditMode: false,
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      subjects: Object.assign([], SubjectOptions),
      selectedSubjects: [],
      pastExperience: [Object.assign({}, defaultPastExperience)],
      emergencyEmail: "",
      emergencyContactNumber: "",
      educationDetails: [Object.assign({}, detaultEduDetail)],
      currentAddress: "",
      availibility: [],
      resume: {},
      errors: {},
      isLoading: false,
      isFetchingDetails: true,
      profileImage: "",
      folders: [],
      selectedFolders: [],
      selectedCurriculumFolders: [],
      curriculumFolders: []
    };
    this.preferedLocation = React.createRef();
    this.exactLocation = React.createRef();
  }
  /**
   *
   */
  componentDidMount() {
    const { params } = this.props.match;
    const { id } = params;
    logger(id);
    this.getFolders();
    this.getCurriculumFolders();
    if (id) {
      this.setState(
        {
          id,
          isEditMode: true
        },
        () => {
          this.getDetails(id);
        }
      );
    } else {
      this.setState({
        isFetchingDetails: false
      });
    }
  }
  /**
   *
   */
  getFolders = async () => {
    const result = await getAllFolders({});
    logger(result);
    const { data: res } = result;
    let { data } = res || {};
    if (!data || !data.map) {
      data = [];
    }
    this.setState({
      folders: data.map(d => ({ label: d.folderName, value: d._id }))
    });
  };
  /**
   *
   */
  getCurriculumFolders = async () => {
    const result = await getAllFolders({ type: "curriculum" });
    logger(result);
    const { data: res } = result;
    let { data } = res || {};
    if (!data || !data.map) {
      data = [];
    }
    this.setState({
      curriculumFolders: data.map(d => ({ label: d.folderName, value: d._id }))
    });
  };
  /**
   *
   */
  getDetails = async id => {
    const { isSuccess, data } = await getTeacherDetails(id);
    if (!isSuccess) {
      this.props.history.push(AppRoutes.NOT_FOUND);
      return;
    }
    logger(data.data);
    const {
      selectedFolders,
      selectedCurriclumFolders: curriculumFolders
    } = data.data;
    const selectedMat = selectedFolders.map(d => d.folderId);
    const selectedCurriculumFolders = curriculumFolders.map(d => d.folderId);
    this.setState({
      ...data.data,
      isFetchingDetails: false,
      selectedFolders: selectedMat,
      selectedCurriculumFolders,
      subjects: this.state.subjects
    });
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
  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ isLoading: true, errors: {} });
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      id,
      resume,
      availibility,
      currentAddress,
      pastExperience,
      educationDetails,
      emergencyContactNumber,
      emergencyEmail,
      selectedSubjects,
      profileImage,
      selectedFolders,
      selectedCurriculumFolders
    } = this.state;
    const data = {
      firstName,
      lastName,
      email,
      resume,
      contactNumber,
      availibility,
      currentAddress,
      pastExperience,
      educationDetails,
      emergencyContactNumber,
      emergencyEmail,
      selectedSubjects,
      profileImage,
      selectedFolders,
      selectedCurriculumFolders
    };
    console.log("Resume", data);
    
    const { isSuccess, message, errors } = await addUpdateTeacher(data, id);
    logger(isSuccess, message, errors);
    if (!isSuccess) {
      if (errors) {
        this.setState({
          errors
        });
      } else {
        toast(message, "error");
      }
      this.setState({ isLoading: false });
      return;
    }
    this.setState({ isLoading: false });
    toast(message, "success");
    this.props.history.push(AppRoutes.TEACHERS);
  };
  /**
   *
   */
  onEducationChange = (e, index) => {
    const { name, value } = e.target;
    const { educationDetails } = this.state;
    educationDetails[index][name] = value;
    this.setState({
      educationDetails
    });
  };
  /**
   *
   */
  addNewEduDetails = () => {
    const { educationDetails } = this.state;
    educationDetails.push(Object.assign({}, detaultEduDetail));
    this.setState({
      educationDetails
    });
  };
  /**
   *
   */
  removeEduDetails = index => {
    const { educationDetails } = this.state;
    educationDetails.splice(index, 1);
    this.setState({
      educationDetails
    });
  };
  /**
   *
   */
  onExpChange = (e, index) => {
    const { name, value } = e.target;
    const { pastExperience } = this.state;
    pastExperience[index][name] = value;
    this.setState({
      pastExperience
    });
  };
  /**
   *
   */
  addNewExpDetails = () => {
    const { pastExperience } = this.state;
    pastExperience.push(Object.assign({}, defaultPastExperience));
    this.setState({
      pastExperience
    });
  };
  /**
   *
   */
  removeExpDetails = index => {
    const { pastExperience } = this.state;
    pastExperience.splice(index, 1);
    this.setState({
      pastExperience
    });
  };
  /**
   *
   */
  onSubjectChange = option => {
    logger(option);
    this.setState({
      selectedSubjects: option ? option.map(opt => opt.value) : []
    });
  };
  /**
   *
   */
  onAvailityUpdate = availibility => {
    this.setState({
      availibility
    });
  };
  /**
   *
   */
  onProfileImageChange = e => {
    const profileImage = e.target.files[0];
    const isValid = ValidateImage(profileImage);
    if (isValid) {
      this.setState({
        profileImage
      });
      return;
    }
    this.setState({
      errors: {
        ...this.state.errors,
        profileImage: "Please choose a valid image with size less than 2MB."
      }
    });
  };
  /**
   *
   */
  handleMaterialChange = options => {
    this.setState({
      selectedFolders: options ? options.map(d => d.value) : []
    });
  };
  /**
   *
   */
  handleCurriculumChange = options => {
    this.setState({
      selectedCurriculumFolders: options ? options.map(d => d.value) : []
    });
  };
  /**
   *
   */
  uploadResume = e => {
    const file = e.target.files[0]
    if (!file) {
      return;
    }
    logger("upload resume", file.type)
    if (AcceptedDocFormat.indexOf(file.type) === -1) {
      this.setState({
        errors: {
          ...this.state.errors,
          resume:
            "Uploaded file is not a valid resume. Only PDF, word are allowed"
        }
      });
      return;
    } else {
      logger(e.target.files[0]);
      this.setState({
        resume:file
      });
    }
  };
  render() {
    const {
      firstName,
      lastName,
      email,
      isLoading,
      contactNumber,
      isFetchingDetails,
      emergencyEmail,
      emergencyContactNumber,
      selectedSubjects,
      currentAddress,
      availibility,
      profileImage,
      selectedCurriculumFolders,
      curriculumFolders
    } = this.state;
    let {
      educationDetails,
      pastExperience,
      subjects,
      folders,
      selectedFolders
    } = this.state;
    let errors = this.state.errors || {};
    if (!educationDetails || !educationDetails.map) {
      educationDetails = [Object.assign({}, detaultEduDetail)];
    }
    if (!pastExperience || !pastExperience.map) {
      pastExperience = [Object.assign({}, defaultPastExperience)];
    }
    if (!subjects || !subjects.map) {
      subjects = Object.assign([], SubjectOptions);
    }
    const selectedSub = subjects.filter(
      sub => selectedSubjects.indexOf(sub.label) > -1
    );
    console.log(subjects, selectedSubjects);
    const selectedMat = [];
    selectedFolders.forEach(d => {
      const ind = folders.findIndex(e => e.value === d);
      if (ind > -1) {
        selectedMat.push({
          label: folders[ind].label,
          value: d
        });
      }
    });
    const selectedCurriculum = [];
    selectedCurriculumFolders.forEach(d => {
      const ind = curriculumFolders.findIndex(e => e.value === d);
      if (ind > -1) {
        selectedCurriculum.push({
          label: curriculumFolders[ind].label,
          value: d
        });
      }
    });
    const { name: profileImageName } = profileImage || {};
    return (
      <div className="cr-page px-3 min-height650">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <CardHeader>
                <h4>
                  <i className="fa fa-edit" />
                  &nbsp;Teacher Details
                </h4>
              </CardHeader>
              <CardBody>
                {isFetchingDetails ? (
                  <Loader />
                ) : (
                  <Form onSubmit={this.handleSubmit}>
                    <Row>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={firstName}
                            onChange={this.handleChange}
                            className={"floating-input"}
                            placeholder={" "}
                          />
                          <Label
                            className="floating-label form-label"
                            htmlFor="firstName"
                          >
                            First Name
                          </Label>
                          {errors.firstName ? (
                            <p className={"text-danger"}>{errors.firstName}</p>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={lastName}
                            onChange={this.handleChange}
                            className={"floating-input"}
                            placeholder={" "}
                          />
                          <Label
                            className="floating-label form-label"
                            htmlFor="lastName"
                          >
                            Last Name
                          </Label>
                          {errors.lastName ? (
                            <p className={"text-danger"}>{errors.lastName}</p>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Input
                            type="email"
                            name="email"
                            id="useremail"
                            value={email}
                            onChange={this.handleChange}
                            className={"floating-input"}
                            placeholder={" "}
                          />
                          <Label
                            className="floating-label form-label"
                            htmlFor="useremail"
                          >
                            Email
                          </Label>

                          {errors.email ? (
                            <p className={"text-danger"}>{errors.email}</p>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Input
                            type="text"
                            name="contactNumber"
                            id="contactNumber"
                            value={contactNumber}
                            onChange={this.handleChange}
                            className={"floating-input"}
                            placeholder={" "}
                          />
                          <Label
                            className="floating-label form-label"
                            htmlFor="contactNumber"
                          >
                            Contact Number
                          </Label>
                          {errors.contactNumber ? (
                            <p className={"text-danger"}>
                              {errors.contactNumber}
                            </p>
                          ) : null}
                        </FormGroup>
                      </Col>


                  <Col sm={"6"}>
                        <FormGroup>
                          <Label className="simple-label mb-2">Resume</Label>
                          <InputGroup>
                            <div className="custom-file mb-2">
                              <input
                                type="file"
                                //value={documents}
                                accept={".doc,.pdf,.docx,.txt,.xlsx"}
                                className="custom-file-input d-none"
                                id="customFile"
                                onChange={this.uploadResume}
                              />
                              <label
                                className="custom-file-label"
                                htmlFor="customFile"
                              >
                                {this.state.resume && this.state.resume.name
                                  ? this.state.resume.name
                                  : "Choose file"}
                              </label>
                            </div>
                          </InputGroup>
                        </FormGroup>
                      </Col>



                      <Col sm={"6"}>
                        <Label className="simple-label mb-2 form-label">
                          Profile Image{" "}
                          <span id="UncontrolledTooltipExample">
                            <i className="icon-info"></i>
                          </span>
                          <UncontrolledTooltip
                            placement="top"
                            target="UncontrolledTooltipExample"
                          >
                            Please choose a valid image with size less than 2MB.
                          </UncontrolledTooltip>
                        </Label>
                        <div className="custom-file mb-2">
                          <input
                            type="file"
                            multiple=""
                            accept="image/*"
                            className="custom-file-input d-none"
                            id="customFile-profile"
                            onChange={this.onProfileImageChange}
                          />
                          <label
                            className="custom-file-label"
                            htmlFor="customFile-profile"
                          >
                            {profileImageName || "Choose file"}
                          </label>
                        </div>
                        {errors.profileImage ? (
                          <p className={"text-danger"}>{errors.profileImage}</p>
                        ) : null}
                      </Col>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Label className="form-label" htmlFor="subjects">
                            Subject teacher can teach
                          </Label>
                          <Select
                            onChange={this.onSubjectChange}
                            options={subjects}
                            isMulti
                            value={selectedSub}
                            onCreateOption={this.handleSubjectCreate}
                          />

                          {errors.contactNumber ? (
                            <p className={"text-danger"}>
                              {errors.contactNumber}
                            </p>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Label className="form-label" htmlFor="subjects">
                            Assign Materials(Folder)
                          </Label>
                          <Select
                            onChange={this.handleMaterialChange}
                            options={folders}
                            isMulti
                            value={selectedMat}
                            placeholder={"Choose Folder"}
                          />

                          {errors.contactNumber ? (
                            <p className={"text-danger"}>
                              {errors.contactNumber}
                            </p>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Label className="form-label" htmlFor="subjects">
                            Assign Curriculum(Folder)
                          </Label>
                          <Select
                            onChange={this.handleCurriculumChange}
                            options={curriculumFolders}
                            isMulti
                            value={selectedCurriculum}
                            placeholder={"Choose Folder"}
                          />

                          {errors.contactNumber ? (
                            <p className={"text-danger"}>
                              {errors.contactNumber}
                            </p>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col sm={"12"}>
                        <hr />
                        <Label className={"form-label label-heading"}>
                          Past Experience
                        </Label>
                        <br />
                        <br />
                      </Col>
                      {pastExperience.map((exp, index) => {
                        return (
                          <React.Fragment key={index}>
                            <Col sm={"6"}>
                              <FormGroup>
                                <Input
                                  type="text"
                                  name="duration"
                                  id={`exp-title-${index}`}
                                  value={exp.duration}
                                  onChange={e => this.onExpChange(e, index)}
                                  className={"floating-input"}
                                  placeholder={" "}
                                />
                                <Label
                                  className="floating-label form-label"
                                  htmlFor={`exp-title-${index}`}
                                >
                                  Duration
                                </Label>
                              </FormGroup>
                            </Col>
                            <Col sm={"5"}>
                              <FormGroup>
                                <Input
                                  type="text"
                                  name="center"
                                  id={`exp-center-${index}`}
                                  value={exp.center}
                                  onChange={e => this.onExpChange(e, index)}
                                  className={"floating-input"}
                                  placeholder={" "}
                                />
                                <Label
                                  className="floating-label form-label"
                                  htmlFor={`exp-center-${index}`}
                                >
                                  Center/University/College
                                </Label>
                              </FormGroup>
                            </Col>
                            <Col sm={"1"}>
                              {" "}
                              <button
                                type="button"
                                className="btn btn-sm btn-cancel mb-3 btn btn-link"
                                style={{
                                  padding: `0.25rem 0.5rem`,
                                  fontSize: `0.76563rem`
                                }}
                                onClick={() =>
                                  index > 0
                                    ? this.removeExpDetails(index)
                                    : undefined
                                }
                                disabled={index === 0}
                              >
                                <i className={"fa fa-trash"}></i>
                              </button>
                            </Col>
                          </React.Fragment>
                        );
                      })}
                      <Col sm={"12"} className={"text-right"}>
                        <button
                          type="button"
                          className="btn btn-sm btn-edit mb-3 btn btn-link"
                          onClick={this.addNewExpDetails}
                        >
                          <i className={"fa fa-plus"}></i> Add More
                        </button>
                      </Col>
                      <Col sm={"12"}>
                        <hr />
                        <Label className={"form-label label-heading"}>
                          Education Details
                        </Label>
                        <br />
                        <br />
                      </Col>
                      {educationDetails.map((edu, index) => {
                        return (
                          <React.Fragment key={index}>
                            <Col sm={"4"}>
                              <FormGroup>
                                <Input
                                  type="text"
                                  name="degree"
                                  id={`edu-title-${index}`}
                                  value={edu.degree}
                                  onChange={e =>
                                    this.onEducationChange(e, index)
                                  }
                                  className={"floating-input"}
                                  placeholder={" "}
                                />
                                <Label
                                  className="floating-label form-label"
                                  htmlFor={`edu-title-${index}`}
                                >
                                  Degree
                                </Label>
                              </FormGroup>
                            </Col>
                            <Col sm={"4"}>
                              <FormGroup>
                                <Input
                                  type="text"
                                  name="university"
                                  id={`edu-university-${index}`}
                                  value={edu.university}
                                  onChange={e =>
                                    this.onEducationChange(e, index)
                                  }
                                  className={"floating-input"}
                                  placeholder={" "}
                                />
                                <Label
                                  className="floating-label form-label"
                                  htmlFor={`edu-university-${index}`}
                                >
                                  University
                                </Label>
                              </FormGroup>
                            </Col>
                            <Col sm={"3"}>
                              <FormGroup>
                                <Input
                                  type="text"
                                  name="percentage"
                                  id={`edu-percentage-${index}`}
                                  value={edu.percentage}
                                  onChange={e =>
                                    this.onEducationChange(e, index)
                                  }
                                  className={"floating-input"}
                                  placeholder={" "}
                                />
                                <Label
                                  className="floating-label form-label"
                                  htmlFor={`edu-percentage-${index}`}
                                >
                                  Percentage
                                </Label>
                              </FormGroup>
                            </Col>
                            {/* percentage */}
                            <Col sm={"1"}>
                              {" "}
                              <button
                                type="button"
                                className="btn btn-sm btn-cancel mb-3 btn btn-link"
                                style={{
                                  padding: `0.25rem 0.5rem`,
                                  fontSize: `0.76563rem`
                                }}
                                onClick={() =>
                                  index > 0
                                    ? this.removeEduDetails(index)
                                    : undefined
                                }
                                disabled={index === 0}
                              >
                                <i className={"fa fa-trash"}></i>
                              </button>
                            </Col>
                          </React.Fragment>
                        );
                      })}
                      <Col sm={"12"} className={"text-right"}>
                        <button
                          type="button"
                          className="btn btn-sm btn-edit mb-3 btn btn-link"
                          onClick={this.addNewEduDetails}
                        >
                          <i className={"fa fa-plus"}></i> Add More
                        </button>
                      </Col>

                      <Col sm={"6"}>
                        <FormGroup>
                          <Label
                            className="form-label"
                            htmlFor={`current-address`}
                          >
                            Current Address
                          </Label>
                          <Input
                            type="textarea"
                            name="currentAddress"
                            id={`current-address`}
                            value={currentAddress}
                            onChange={this.handleChange}
                            className={"floating-input"}
                            placeholder={" "}
                          />
                        </FormGroup>
                      </Col>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Label
                            className="form-label"
                            htmlFor={`availibility`}
                          >
                            Available Days
                          </Label>
                          <Select
                            onChange={this.onAvailityUpdate}
                            options={daysOptions}
                            isMulti
                            value={availibility}
                          />
                        </FormGroup>
                      </Col>
                      <Col sm={"12"}>
                        <hr />
                        <Label className={"form-label label-heading"}>
                          Emergency Contact
                        </Label>
                        <br />
                        <br />
                      </Col>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Input
                            type="email"
                            name="emergencyEmail"
                            id="emergencyEmail"
                            value={emergencyEmail}
                            onChange={this.handleChange}
                            className={"floating-input"}
                            placeholder={" "}
                          />
                          <Label
                            className="floating-label form-label"
                            htmlFor="emergencyEmail"
                          >
                            Email
                          </Label>

                          {errors.emergencyEmail ? (
                            <p className={"text-danger"}>
                              {errors.emergencyEmail}
                            </p>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Input
                            type="text"
                            name="emergencyContactNumber"
                            id="emergencyContactNumber"
                            value={emergencyContactNumber}
                            onChange={this.handleChange}
                            className={"floating-input"}
                            placeholder={" "}
                          />
                          <Label
                            className="floating-label form-label"
                            htmlFor="emergencyContactNumber"
                          >
                            Contact Number
                          </Label>
                          {errors.emergencyContactNumber ? (
                            <p className={"text-danger"}>
                              {errors.emergencyContactNumber}
                            </p>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <FormGroup>
                      <Col sm={{ size: 4, offset: 8 }} className={"text-right"}>
                        <Button
                          type="button"
                          color={"danger"}
                          className={"btn-cancel btn-submit btn-link"}
                          onClick={() => {
                            this.props.history.push(AppRoutes.TEACHERS);
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
                  </Form>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddMasterAdmin;

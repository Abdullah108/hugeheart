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
  Button,
  UncontrolledTooltip,
  Input
} from "reactstrap";
import LoadingButton from "../../components/LoadingButton";
import { AppRoutes } from "../../config/AppRoutes";
import Select from "react-select";

import {
  toast,
  logger,
  ValidateFile,
  SubjectOptions,
  ClassList,
  AvailableCountries
} from "../../helpers";

import { addUpdateCurriculum } from "../../methods";

class AddCurriculum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _class: "",
      errors: {},
      isLoading: false,
      file: "",
      form: {},
      classOptions: [],
      subjectOptions: [],
      folderId: "",
      country: "",
      state: "",
      curriculumName: ""
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { params } = match;
    const { folderId } = params;
    logger(folderId);
    const subjectOptions = SubjectOptions;
    const availableCountries = AvailableCountries.map(country => {
      return {
        label: country.name,
        value: country.name,
        countryId: country.id
      };
    });
    this.setState({
      classOptions: ClassList,
      subjectOptions,
      folderId,
      availableCountries
    });
  }

  /**
   * @description: select box change data bind
   */
  selectHandleChange = (data, e) => {
    const allData = { ...data, ...e };
    const { name, value } = allData;

    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: null
      }
    });
    if (name === "country") {
      this.setState({
        state: ""
      });
    }
  };

  /**
   *@description To check Material file validation
   */
  onMaterialFileChange = e => {
    const file = e.target.files[0];

    if (!file) {
      return false;
    }
    const isValid = ValidateFile(file);
    if (isValid) {
      this.setState({
        file,
        errors: {
          ...this.state.errors,
          file: ""
        }
      });
      return;
    }
    this.setState({
      file: {},
      errors: {
        ...this.state.errors,
        file: "Please choose a valid document type file."
      }
    });
  };

  /**
   * @description: Material form save method
   */
  handleSubmit = async e => {
    e.preventDefault();
    const {
      _class,
      subject,
      file,
      id,
      folderId,
      country,
      state,
      curriculumName
    } = this.state;

    const data = {
      class: _class,
      subject,
      file,
      folderId,
      country,
      state,
      curriculumName
    };
    this.setState({
      isLoading: true
    });
    const { isSuccess, message, errors } = await addUpdateCurriculum(data, id);

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
    this.props.history.push(
      AppRoutes.CURRICULUM.replace(":folderId", folderId)
    );
  };
  /**
   *
   */
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        [e.target.name]: ""
      }
    });
  };
  /**
   *
   */
  render() {
    const {
      errors,
      isLoading,
      folderId,
      availableCountries,
      country,
      state,
      curriculumName
    } = this.state;
    logger(availableCountries);
    const selectedCountry = country
      ? {
          label: country,
          value: country
        }
      : null;

    const availableStates = country
      ? AvailableCountries[
          AvailableCountries.findIndex(d => d.name === country)
        ].states.map(coun => {
          return {
            label: coun.name,
            value: coun.name
          };
        })
      : [];
    const selectedState = state
      ? {
          label: state,
          value: state
        }
      : null;
    return (
      <div className="cr-page px-3 min-height650">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <CardHeader>
                <h4>
                  <i className="fa fa-edit" />
                  &nbsp;Curriculum Details
                </h4>
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.handleSubmit}>
                  <Row>
                    <Col sm={"12"}>
                      <FormGroup>
                        <Input
                          type="text"
                          name="curriculumName"
                          id="curriculumName"
                          value={curriculumName}
                          className={"floating-input"}
                          onChange={this.handleChange}
                          placeholder={" "}
                        />
                        <Label
                          className="floating-label form-label"
                          htmlFor="curriculumName"
                        >
                          Curriculum Name
                        </Label>
                        {errors.curriculumName ? (
                          <p className={"text-danger"}>
                            {errors.curriculumName}
                          </p>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col sm={"6"}>
                      <FormGroup>
                        <Label className=" form-label" for="country">
                          Country
                        </Label>
                        <Select
                          id={"country"}
                          name="country"
                          options={availableCountries}
                          onChange={this.selectHandleChange}
                          value={selectedCountry}
                          placeholder={"Choose Country"}
                        />

                        {errors.country ? (
                          <p className={"text-danger"}>{errors.country}</p>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col sm={"6"}>
                      <FormGroup>
                        <Label className=" form-label" for="state">
                          State
                        </Label>
                        <Select
                          id={"state"}
                          name="state"
                          options={availableStates}
                          onChange={this.selectHandleChange}
                          value={selectedState}
                          placeholder={"Choose State"}
                        />

                        {errors.country ? (
                          <p className={"text-danger"}>{errors.country}</p>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col sm={"6"}>
                      <FormGroup>
                        <Label className=" form-label" for="_class">
                          Year
                        </Label>
                        <Select
                          name="_class"
                          options={this.state.classOptions}
                          onChange={this.selectHandleChange}
                        />

                        {errors.class ? (
                          <p className={"text-danger"}>{errors.class}</p>
                        ) : null}
                      </FormGroup>
                    </Col>

                    <Col sm={"6"}>
                      <FormGroup>
                        <Label className=" form-label" for="subject">
                          Subject
                        </Label>
                        <Select
                          name="subject"
                          options={this.state.subjectOptions}
                          onChange={this.selectHandleChange}
                        />

                        {errors.subject ? (
                          <p className={"text-danger"}>{errors.subject}</p>
                        ) : null}
                      </FormGroup>
                    </Col>

                    <Col sm={"6"}>
                      <Label className="simple-label mb-2 form-label">
                        Curriculum File{" "}
                        <span id="UncontrolledTooltipExample">
                          <i className="icon-info"></i>
                        </span>
                        <UncontrolledTooltip
                          placement="top"
                          target="UncontrolledTooltipExample"
                        >
                          Please choose a valid document type file.
                        </UncontrolledTooltip>
                      </Label>
                      <div className="custom-file mb-2">
                        <input
                          type="file"
                          className="custom-file-input d-none"
                          id="customFile"
                          onChange={this.onMaterialFileChange}
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="customFile"
                        >
                          {this.state.file && this.state.file.name
                            ? this.state.file.name
                            : "Choose file"}
                        </label>
                      </div>
                      {errors.file ? (
                        <p className={"text-danger"}>{errors.file}</p>
                      ) : null}
                    </Col>
                  </Row>

                  <FormGroup>
                    <Col sm={{ size: 4, offset: 8 }} className={"text-right"}>
                      <Button
                        type="button"
                        color={"danger"}
                        className={"btn-cancel btn-submit btn-link"}
                        onClick={() => {
                          this.props.history.push(
                            AppRoutes.CURRICULUM.replace(":folderId", folderId)
                          );
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
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddCurriculum;

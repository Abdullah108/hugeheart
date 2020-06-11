import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";
import LoadingButton from "../../../components/LoadingButton";
import {
  logger,
  toast,
  ValidateZipFile,
  AvailableCountries
} from "../../../helpers";
import { addFolder, addCurriculumFolderByZip } from "../../../methods";
// import CreatableSelect from "react-select/creatable";
import Select from "react-select";
class AddFolderModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      errors: {},
      folderName: "",
      id: "",
      type: "text",
      file: "",
      availableCountries: [],
      country: "",
      state: ""
    };
  }
  componentDidMount() {
    const availableCountries = AvailableCountries.map(country => {
      return {
        label: country.name,
        value: country.name,
        countryId: country.id
      };
    });
    this.setState({ availableCountries });
  }
  /**
   *
   */
  componentDidUpdate({ selectedFolder: prevFolder, show: oldShow }) {
    const { selectedFolder, show } = this.props;
    const { _id: id, folderName } = selectedFolder;
    const { _id: prevId } = prevFolder;
    if ((id && id !== prevId) || (show && oldShow !== show)) {
      this.setState({
        folderName: folderName || "",
        id,
        type: "text",
        file: {},
        subject: "",
        country: "",
        state: ""
      });
    }
  }
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
  addFolder = async e => {
    e.preventDefault();
    logger(this.state);
    const { folderName, id, type, file, country, state } = this.state;
    const data = {
      folderName,
      file,
      fileName: file && file.name ? file.name : "",
      country,
      state
    };
    this.setState({
      errors: {},
      isLoading: true
    });
    const { errors, isSuccess, data: repsonse, message } =
      type === "zip"
        ? await addCurriculumFolderByZip(data)
        : await addFolder({ ...data, type: "curriculum" }, id);
    logger(errors);
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
    toast(message, "success");
    this.setState({
      isLoading: false,
      file: {},
      folderName: "",
      _class: "",
      subject: ""
    });
    this.props.hideModal();
    this.props.refreshList();
    logger(errors, isSuccess, repsonse);
  };
  /**
   *
   */
  onClickRadioType = type => {
    this.setState({
      type: type
    });
  };
  /**
   *@description To check Material file validation
   */
  onMaterialFileChange = e => {
    const file = e.target.files[0];

    if (!file) {
      return false;
    }
    const isValid = ValidateZipFile(file);
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
   *
   */
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
   *
   */
  render() {
    const { show, hideModal } = this.props;
    const {
      isLoading,
      errors,
      folderName,
      type,
      id,
      availableCountries,
      country,
      state
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
      <Form onSubmit={this.addFolder}>
        <Modal centered isOpen={show} toggle={hideModal}>
          <ModalHeader toggle={hideModal}>Add New Folder</ModalHeader>
          <ModalBody>
            {id ? (
              <>
                <br />
                <br />
              </>
            ) : null}
            {id ? null : (
              <div className="form-group">
                <div className="mb-30">
                  <b>Type</b>
                  <div className="ml-3 form-check form-check-inline">
                    <input
                      name="type"
                      type="radio"
                      id="lesson"
                      className="form-check-input"
                      value="text"
                      checked={type === "text"}
                      onChange={() => this.onClickRadioType("text")}
                    />
                    <label
                      title=""
                      type="checkbox"
                      htmlFor="lesson"
                      className="form-check-label"
                    >
                      Text
                    </label>
                  </div>
                  <div className="ml-3 form-check form-check-inline">
                    <input
                      name="type"
                      type="radio"
                      id="course"
                      className="form-check-input"
                      value="zip"
                      checked={type === "zip"}
                      onChange={() => this.onClickRadioType("zip")}
                    />
                    <label
                      title=""
                      type="checkbox"
                      htmlFor="course"
                      className="form-check-label"
                    >
                      Zip
                    </label>
                  </div>
                </div>
              </div>
            )}
            <FormGroup>
              <Input
                type="text"
                name="folderName"
                id="folderName"
                value={folderName}
                className={"floating-input"}
                onChange={this.handleChange}
              />
              <Label className="floating-label form-label" htmlFor="folderName">
                Folder name
              </Label>
              {errors.folderName ? (
                <p className={"text-danger"}>{errors.folderName}</p>
              ) : null}
            </FormGroup>
            {type === "zip" ? (
              <Row>
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
                <Col sm={"12"}>
                  <Label className="simple-label mb-2 form-label">
                    Folder Zip{" "}
                    <span id="UncontrolledTooltipExample">
                      <i className="icon-info"></i>
                    </span>
                    <UncontrolledTooltip
                      placement="top"
                      target="UncontrolledTooltipExample"
                    >
                      Please choose a valid zip file.
                    </UncontrolledTooltip>
                  </Label>
                  <div className="custom-file mb-2">
                    <input
                      type="file"
                      className="custom-file-input d-none"
                      id="customFile"
                      accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
                      onChange={this.onMaterialFileChange}
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      {this.state.file && this.state.file.name
                        ? this.state.file.name
                        : "Choose file"}
                    </label>
                  </div>
                  {errors.fileName ? (
                    <p className={"text-danger"}>{errors.fileName}</p>
                  ) : null}
                </Col>
              </Row>
            ) : null}
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
                color={"primary"}
                className={"btn-submit btn-link"}
                onClick={this.addFolder}
              >
                Save
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </Form>
    );
  }
}

export default AddFolderModal;

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
import LoadingButton from "../../components/LoadingButton";
import {
  logger,
  toast,
  SubjectOptions,
  ClassList,
  ValidateZipFile
} from "../../helpers";
import { addFolder, addFolderByZip, getAllTeachers } from "../../methods";
import Select from "react-select";
import AsyncSelect from "react-select/async";
class AddFolderModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      errors: {},
      folderName: "",
      id: "",
      type: "text",
      _class: "",
      file: "",
      topicOptions: [],
      isSubTopicDisabled: true,
      classOptions: [],
      subjectOptions: [],
      subject: "",
      topic: "",
      subTopic: "",
      subTopicOptions: [],
      defaultTopic: {},
      isTopicExists: false,
      topicName: "",
      teachers: [],
      selectedTeachers: []
    };
  }
  componentDidMount() {
    const subjectOptions = SubjectOptions;
    this.setState({ classOptions: ClassList, subjectOptions });
    this.getTeachersList();
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
        _class: "",
        subject: ""
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
    const {
      folderName,
      id,
      type,
      file,
      _class,
      subject,
      selectedTeachers
    } = this.state;
    const data = {
      folderName,
      file,
      fileName: file && file.name ? file.name : "",
      class: _class,
      subject,
      selectedTeachers
    };
    this.setState({
      errors: {},
      isLoading: true
    });
    const { errors, isSuccess, data: repsonse, message } =
      type === "zip" ? await addFolderByZip(data) : await addFolder(data, id);
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
  };
  /**
   *
   */
  getTeachersList = async (search = "", callback = undefined) => {
    const data = { skip: 0, limit: 10, search };
    const { data: resp, isSuccess } = await getAllTeachers(data);
    if (isSuccess) {
      this.setState(
        {
          teachers:
            resp.data && resp.data.map
              ? resp.data.map(d => ({ label: d.fullName, value: d._id }))
              : []
        },
        () => {
          if (callback) {
            callback(this.state.teachers);
          }
        }
      );
    } else {
      this.setState(
        {
          teachers: []
        },
        () => {
          if (callback) {
            callback(this.state.teachers);
          }
        }
      );
    }
    logger(resp.data);
  };
  /**
   *
   */
  render() {
    const { show, hideModal } = this.props;
    const { isLoading, errors, folderName, type, id, teachers } = this.state;
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
            </FormGroup>
            {errors.folderName ? (
              <p className={"text-danger"}>{errors.folderName}</p>
            ) : null}
            {type === "zip" ? (
              <Row>
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
                {/* <Col sm={"6"}>
                  <FormGroup>
                    <Label className="form-label" for="topic">
                      Topic
                    </Label>
                    <CreatableSelect
                      isClearable
                      onChange={this.selectTopicChange}
                      options={this.state.topicOptions}
                      id="topic"
                      name="topic"
                    />

                    {errors.topic ? (
                      <p className={"text-danger"}>{errors.topic}</p>
                    ) : null}
                  </FormGroup>
                </Col>

                <Col sm={"6"}>
                  <FormGroup>
                    <Label className="form-label" for="subTopic">
                      Sub Topic
                    </Label>

                    <CreatableSelect
                      isClearable
                      onChange={this.selectSubTopicChange}
                      options={this.state.subTopicOptions}
                      id="subTopic"
                      name="subTopic"
                      isDisabled={this.state.isSubTopicDisabled}
                    />

                    {errors.subTopic ? (
                      <p className={"text-danger"}>{errors.subTopic}</p>
                    ) : null}
                  </FormGroup>
                </Col> */}
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
                  {errors.file ? (
                    <p className={"text-danger"}>{errors.file}</p>
                  ) : null}
                </Col>
              </Row>
            ) : null}
            <Row>
              <Col sm={"12"}>
                <FormGroup>
                  <Label className=" form-label" for="_class">
                    Teacher
                  </Label>
                  <AsyncSelect
                    name="selectedTeachers"
                    options={[]}
                    onChange={ts =>
                      this.setState({
                        selectedTeachers:
                          ts && ts.map ? ts.map(t => t.value) : []
                      })
                    }
                    loadOptions={this.getTeachersList}
                    loadingMessage={() => `Searching for teacher...`}
                    noOptionsMessage={() => "Try Searching other teacher"}
                    placeholder={"Choose teacher(type name if not in the list)"}
                    defaultOptions={teachers}
                    isClearable
                    isMulti
                  />

                  {errors.class ? (
                    <p className={"text-danger"}>{errors.class}</p>
                  ) : null}
                </FormGroup>
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

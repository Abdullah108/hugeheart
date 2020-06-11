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
  UncontrolledTooltip
} from "reactstrap";
import LoadingButton from "../../components/LoadingButton";
import { AppRoutes } from "../../config/AppRoutes";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

import {
  toast,
  logger,
  ValidateFile,
  SubjectOptions,
  ClassList
} from "../../helpers";

import {
  getTopics,
  addTopic,
  getSubTopics,
  addSubTopic,
  addUpdateMaterial,
  getMaterialDetails
} from "../../methods";

class AddMaterial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _class: "",
      errors: {},
      isLoading: false,
      file: "",
      topicOptions: [],
      form: {},
      isSubTopicDisabled: true,
      classOptions: [],
      subjectOptions: [],
      topic: "",
      subTopic: "",
      subTopicOptions: [],
      defaultTopic: {},
      isTopicExists: false,
      topicName: "",
      folderId: "",
      fileURL: "",
      id: ""
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { params } = match;
    const { folderId, id } = params;

    /** in case of edit material */
    if (id) {
      this.getDetails(id);
    }

    logger(folderId);
    this.getTopic();
    const subjectOptions = SubjectOptions;
    this.setState({ classOptions: ClassList, subjectOptions, folderId, id });
  }

  getDetails = async id => {
    try {
      this.setState({
        isLoading: true
      });
      const { data } = await getMaterialDetails(id);

      await this.setState({
        ...data.data,
        _class: data.data.class,
        isLoading: false
      });

      this.getSubTopic();
    } catch (error) {
      logger(error);
      this.setState({
        isLoading: false
      });
    }
  };

  /**
   * @description: get topic method
   */
  getTopic = async () => {
    try {
      this.setState({
        isLoading: true,
        topics: []
      });

      const { data: resp } = await getTopics();

      const { data: topics } = resp;

      let option = topics.map(topic => {
        return { value: topic._id, label: topic.name };
      });
      if (option.length) {
        this.setState({
          isTopicExists: true
        });
      }
      this.setState({
        isLoading: false,
        topicOptions: option
      });
    } catch (error) {
      logger(error);
      this.setState({
        isLoading: false
      });
    }
  };

  /**
   *@description get sub topic list
   */
  getSubTopic = async () => {
    try {
      this.setState({
        isLoading: true
      });

      if (!this.state.topic) {
        toast("Please select topic.", "error");
        return false;
      }
      const { data: resp } = await getSubTopics({ topicId: this.state.topic });
      const { data: subTopics } = resp;
      let option = subTopics.map(subTopic => {
        return { value: subTopic._id, label: subTopic.name };
      });
      this.setState({
        isLoading: false,
        subTopicOptions: option,
        isSubTopicDisabled: false
      });
    } catch (error) {
      logger(error);
      this.setState({
        isLoading: false
      });
    }
  };

  /**
   * @description: on select or add new topic add topic or get subtopics
   */
  selectTopicChange = async data => {
    if (!data) {
      this.setState({ topic: "" });
      return false;
    }

    let errors = this.state.errors;
    if (!data.value || data.value.trim() === "") {
      errors.topic = "Please enter Valid topic";
      this.setState({ errors });
      return false;
    } else {
      errors.topic = "";
      this.setState({ errors });
    }

    this.setState({
      isSubTopicDisabled: true,
      subTopicOptions: []
    });

    if (data.__isNew__) {
      this.createNewTopic(data.value);
    } else {
      this.setState({ topic: data.value, topicName: data.label }, () =>
        this.getSubTopic()
      );
    }
  };

  /**
   * @description: add or select subtopics
   */
  selectSubTopicChange = async data => {
    if (!data) {
      this.setState({ subTopic: "" });
      return false;
    }

    let errors = this.state.errors;
    if (!data.value || data.value.trim() === "") {
      errors.subTopic = "Please enter Valid sub Topic";
      this.setState({ errors });
      return false;
    } else {
      errors.subTopic = "";
      this.setState({ errors });
    }

    if (data.__isNew__) {
      this.addNewSubTopic(data.value);
    } else {
      this.setState({ subTopic: data.value });
    }
  };

  /**
   *@description: add new topic
   */
  createNewTopic = async name => {
    try {
      this.setState({
        isLoading: true
      });

      const { data: resp } = await addTopic({ name });

      const { data: topics } = resp;

      const { topicOptions } = this.state;

      topicOptions.push({ value: topics._id, label: topics.name });

      this.setState(
        {
          topic: topics._id,
          isLoading: false,
          topicOptions
        },
        () => this.getSubTopic()
      );
    } catch (error) {
      logger(error);
      this.setState({
        isLoading: false
      });
    }
  };

  /**
   *@description add new subtopic
   */
  addNewSubTopic = async name => {
    let obj = { topicId: this.state.topic, name };
    try {
      const { data: resp } = await addSubTopic(obj);

      const { data: subTopic } = resp;

      const { subTopicOptions } = this.state;
      subTopicOptions.push({ value: subTopic._id, label: subTopic.name });

      this.setState({
        subTopic: subTopic._id,
        isLoading: false,
        subTopicOptions
      });
    } catch (error) {
      logger(error);
      this.setState({
        isLoading: false
      });
    }
  };

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
      topic,
      subTopic,
      _class,
      subject,
      file,
      id,
      topicName,
      folderId
    } = this.state;

    const data = {
      topic,
      subTopic,
      class: _class,
      _class,
      subject,
      file,
      topicName,
      folderId
    };
    this.setState({
      isLoading: true
    });
    const { isSuccess, message, errors } = await addUpdateMaterial(data, id);

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
    this.props.history.push(AppRoutes.MATERIAL.replace(":folderId", folderId));
  };
  /**
   *
   */
  render() {
    const {
      errors,
      isLoading,
      folderId,
      _class,
      subject,
      topic,
      fileURL
    } = this.state;
    return (
      <div className="cr-page px-3 min-height650">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <CardHeader>
                <h4>
                  <i className="fa fa-edit" />
                  &nbsp;Material Details
                </h4>
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.handleSubmit}>
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
                          value={this.state.classOptions.filter(
                            option => option.value === _class
                          )}
                        />

                        {errors._class ? (
                          <p className={"text-danger"}>{errors._class}</p>
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
                          value={this.state.subjectOptions.filter(
                            option => option.value === subject
                          )}
                        />

                        {errors.subject ? (
                          <p className={"text-danger"}>{errors.subject}</p>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col sm={"6"}>
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
                          value={this.state.topicOptions.filter(
                            option => option.value === topic
                          )}
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
                          value={this.state.subTopicOptions.filter(
                            option => option.value === this.state.subTopic
                          )}
                        />

                        {errors.subTopic ? (
                          <p className={"text-danger"}>{errors.subTopic}</p>
                        ) : null}
                      </FormGroup>
                    </Col>

                    <Col sm={"6"}>
                      <Label className="simple-label mb-2 form-label">
                        Material File{" "}
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
                            : fileURL
                            ? fileURL.replace(/^.*[\\/]/, "")
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
                            AppRoutes.MATERIAL.replace(":folderId", folderId)
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

export default AddMaterial;

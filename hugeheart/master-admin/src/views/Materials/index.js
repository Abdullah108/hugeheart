import React, { Component } from "react";
import {
  Col,
  Row,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  // Input,
  UncontrolledTooltip,
  Label,
  Form,
  InputGroup
} from "reactstrap";
import MaterialList from "./MaterialList";
import { getMaterials, getTopics } from "../../methods";
import Select from "react-select";
import qs from "querystring";
import { ClassList, SubjectOptions, logger } from "../../helpers";
import { AppRoutes } from "../../config";
class Materials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      materials: [],
      search: "",
      classOptions: ClassList,
      subjectOptions: SubjectOptions,
      selectedSubject: "",
      selectedYear: "",
      topicOptions: [],
      topic: ""
    };
  }
  /**
   *
   */
  componentDidMount() {
    const { location, match } = this.props;
    const { params } = match;
    const { search: currentSearch } = location;
    logger(params);
    const { selectedSubject, selectedYear, search, topic } = qs.parse(
      currentSearch.replace("?", "")
    );
    const { folderId } = params;
    this.getTopic();
    this.setState(
      {
        search: search || "",
        selectedSubject: selectedSubject || "",
        selectedYear: selectedYear || "",
        folderId,
        topic: topic || ""
      },
      () => {
        this.getMaterials();
      }
    );
  }
  /**
   *
   */
  componentDidUpdate({ location: prevLocation }) {
    const { search: prevSearch } = prevLocation;
    const { location } = this.props;
    const { search: currentSearch } = location;
    logger(prevSearch, currentSearch);
    if (prevSearch !== currentSearch) {
      const { selectedSubject, selectedYear, search, topic } = qs.parse(
        currentSearch.replace("?", "")
      );
      this.setState(
        {
          search: search || "",
          selectedSubject: selectedSubject || "",
          selectedYear: selectedYear || "",
          topic: topic || ""
        },
        () => {
          this.getMaterials();
        }
      );
    }
  }
  /**
   * @description: get topic method
   */
  getTopic = async () => {
    try {
      this.setState({
        topicOptions: []
      });

      const { data: resp } = await getTopics();

      const { data: topics } = resp;

      let option = topics.map(topic => {
        return { value: `${topic.name}-${topic._id}`, label: topic.name };
      });
      if (option.length) {
        this.setState({
          isTopicExists: true
        });
      }
      this.setState({
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
   *
   */
  getMaterials = async () => {
    this.setState({ isLoading: true });
    const {
      search,
      selectedSubject,
      selectedYear,
      folderId,
      topic
    } = this.state;
    const { isSuccess, data: response } = await getMaterials(
      {
        search,
        selectedSubject,
        selectedYear,
        topic
      },
      folderId
    );
    let data = [];
    if (isSuccess) {
      data = response.data;
    }
    this.setState({
      isLoading: false,
      materials: data
    });
  };
  /**
   *
   */
  handleChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value
    });
  };
  /**
   *
   */
  handleYearChange = value => {
    this.setState({
      selectedYear: value ? value.value : null
    });
  };
  /**
   *
   */
  handleSubjectChange = value => {
    this.setState({
      selectedSubject: value ? value.value : null
    });
  };
  /**
   *
   */
  onSearch = e => {
    e.preventDefault();
    logger(this.state);
    const {
      search,
      selectedYear,
      selectedSubject,
      topic,
      folderId
    } = this.state;
    const query = qs.stringify({
      search,
      selectedYear,
      selectedSubject,
      topic
    });
    logger(query);
    this.props.history.push(
      `${AppRoutes.MATERIAL.replace(":folderId", folderId)}?${query}`
    );
  };
  /**
   *@description Subject change binding
   */
  handleTopicChange = value => {
    this.setState({
      topic: value ? value.value : null
    });
  };
  /**
   *
   */
  onReset = () => {
    this.props.history.push(
      `${AppRoutes.MATERIAL.replace(":folderId", this.state.folderId)}`
    );
  };
  /**
   *
   */
  render() {
    const {
      materials,
      isLoading,
      search,
      topicOptions,
      topic
      // subjectOptions,
      // classOptions,
      // selectedYear,
      // selectedSubject
    } = this.state;
    // @Sonu: We might need it in future. Don't remove
    /* let selectedYr = selectedYear
      ? {
          label: !isNaN(selectedYear) ? `Year ${selectedYear}` : selectedYear,
          value: selectedYear
        }
      : null;
    let selectedSub = selectedSubject
      ? {
          label: selectedSubject,
          value: selectedSubject
        }
      : null; */
    const selectedTopic = topic
      ? {
          label: topic.split("-")[0],
          value: topic.split("-")[1]
        }
      : null;
    return (
      <div className="cr-page px-3 min-height650">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <CardHeader>
                <h4>
                  <i className="fa fa-files-o" /> Materials
                </h4>
              </CardHeader>
              <CardBody>
                <div className={"filter-block"}>
                  <Form onSubmit={this.onSearch}>
                    <Row>
                      <Col lg={"3"} md={"3"} className="mb-0">
                        <FormGroup className="mb-0">
                          <Label className="label">Search</Label>
                          <InputGroup className="mb-2">
                            <input
                              type="text"
                              name="search"
                              onChange={this.handleChange}
                              className="form-control"
                              aria-describedby="searchUser"
                              placeholder="Search by material name or topic"
                              value={search}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col lg={"3"} md={"3"} className="mb-0">
                        <FormGroup className="mb-0">
                          <Label className="label" for="subject">
                            Choose Topic
                          </Label>
                          <Select
                            name="topic"
                            options={topicOptions}
                            onChange={this.handleTopicChange}
                            value={selectedTopic}
                            isClearable
                          />
                        </FormGroup>
                      </Col>
                      {/*
                      // @Sonu: We might need it in future. Don't remove
                      <Col lg={"3"} md={"3"} className="mb-0">
                        <FormGroup className="mb-0">
                          <Label for="exampleSelect" className="label">
                            Choose Year
                          </Label>
                          <Select
                            name="_class"
                            options={classOptions}
                            onChange={this.handleYearChange}
                            value={selectedYr}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={"3"} md={"3"} className="mb-0">
                        <FormGroup className="mb-0">
                          <Label className="label" for="subject">
                            Subject
                          </Label>
                          <Select
                            name="subject"
                            options={subjectOptions}
                            onChange={this.handleSubjectChange}
                            value={selectedSub}
                          />
                        </FormGroup>
                      </Col> */}
                      <Col lg={"3"} md={"3"} className="mb-0">
                        <div className="filter-btn-wrap">
                          <Label className="height17 label" />
                          <div className="form-group mb-0">
                            <span className="mr-2">
                              <button
                                type="submit"
                                className="btn btn-circle btn-search"
                                id="Tooltip-1"
                              >
                                <i className="fa fa-search" />
                              </button>
                              <UncontrolledTooltip target="Tooltip-1">
                                Search
                              </UncontrolledTooltip>
                            </span>
                            <span className="">
                              <button
                                type="button"
                                className="btn btn-circle btn-refresh"
                                id="Tooltip-2"
                                onClick={this.onReset}
                              >
                                <i className="fa fa-refresh" />
                              </button>
                              <UncontrolledTooltip target={"Tooltip-2"}>
                                Reset all filters
                              </UncontrolledTooltip>
                            </span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </div>
                <MaterialList isLoading={isLoading} data={materials} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Materials;

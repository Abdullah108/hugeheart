import React, { Component } from "react";

import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  UncontrolledTooltip,
  Label,
  FormGroup,
  InputGroup,
  Form,
  Button
} from "reactstrap";
import Select from "react-select";
import { AppRoutes } from "../../config/AppRoutes";
import qs from "querystring";
import { getAllMaterials, getTopics } from "../../methods";
import { logger } from "../../helpers/Logger";

import MaterialList from "./MaterialList";
import { ClassList, SubjectOptions } from "../../helpers";
import PaginationHelper from "../../helpers/Pagination";

class Material extends Component {
  constructor(props) {
    super(props);
    this.state = {
      materials: [],
      totalCount: 0,
      selectedPage: 1,
      limit: 10,
      skip: 0,
      search: "",
      isActive: true,
      statusActive: "",
      isLoading: true,
      classOptions: ClassList,
      subjectOptions: SubjectOptions,
      selectedSubject: "",
      selectedYear: "",
      folderId: "",
      topicOptions: [],
      topic: ""
    };
  }
  /**
   *@description: life cycel of react :- get material list when page load
   */
  componentDidMount() {
    const { location, match } = this.props;
    const { search: currentSearch } = location;
    let {
      selectedSubject,
      selectedYear,
      search,
      selectedPage,
      topic
    } = qs.parse(currentSearch.replace("?", ""));
    const { params } = match;
    const { folderId } = params;
    logger(folderId);
    selectedPage = selectedPage || 1;
    this.getTopic();
    this.setState(
      {
        search: search || "",
        selectedSubject: selectedSubject || "",
        selectedYear: selectedYear || "",
        selectedPage,
        skip: this.state.limit * (selectedPage - 1),
        folderId,
        topic
      },
      () => {
        this.getMaterials();
      }
    );
  }

  /**
   *
   * @param {*} params
   * @description: get material list when state change
   *
   */
  componentDidUpdate({ location: prevLocation }) {
    const { search: prevSearch } = prevLocation;
    logger(prevLocation);
    const { location } = this.props;
    const { search: currentSearch } = location;
    if (prevSearch !== currentSearch) {
      let {
        selectedSubject,
        selectedYear,
        search,
        selectedPage,
        topic
      } = qs.parse(currentSearch.replace("?", ""));

      selectedPage = selectedPage || 1;
      this.setState(
        {
          search: search || "",
          selectedSubject: selectedSubject || "",
          selectedYear: selectedYear || "",
          selectedPage,
          skip: this.state.limit * (selectedPage - 1),
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
  handleChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value
    });
  };

  /**
   *@description: get material list method
   */
  getMaterials = async () => {
    try {
      this.setState({
        isLoading: true,
        materials: []
      });
      const {
        skip,
        limit,
        search,
        statusActive,
        selectedSubject,
        selectedYear,
        folderId,
        topic
      } = this.state;
      const data = {
        skip,
        limit,
        search,
        statusActive,
        selectedSubject,
        selectedYear,
        folderId,
        topic
      };
      const { data: resp } = await getAllMaterials(data);
      const { totalMaterial, data: materials } = resp;
      this.setState({
        materials,
        totalCount: totalMaterial,
        isLoading: false
      });
    } catch (error) {
      logger(error);
      this.setState({
        isLoading: false,
        materials: []
      });
    }
  };

  /**
   *@description: year change binding
   */
  handleYearChange = value => {
    this.setState({
      selectedYear: value ? value.value : null
    });
  };
  /**
   *@description Subject change binding
   */
  handleSubjectChange = value => {
    this.setState({
      selectedSubject: value ? value.value : null
    });
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
   *@description: Search method
   */
  onSearch = e => {
    e.preventDefault();
    logger(this.state);
    const {
      search,
      selectedYear,
      selectedSubject,
      folderId,
      topic
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
   * @description filter reset method
   */
  onReset = () => {
    this.props.history.push(
      `${AppRoutes.MATERIAL.replace(":folderId", this.state.folderId)}`
    );
  };

  /**
   *@description for Pagination if page change set value by this method
   */
  handleSelected = async page => {
    const { search, statusActive, folderId } = this.state;
    const querystring = qs.stringify({
      selectedPage: page,
      search,
      statusActive
    });
    this.props.history.push(
      `${AppRoutes.MATERIAL.replace(":folderId", folderId)}?${querystring}`
    );
  };

  render() {
    const {
      materials,
      isLoading,
      skip,
      search,
      // subjectOptions,
      // classOptions,
      // selectedYear,
      // selectedSubject,
      totalCount,
      limit,
      selectedPage,
      folderId,
      topic,
      topicOptions
    } = this.state;
    const { userDetails, history } = this.props;
    const { push } = history;
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
    console.log(selectedTopic);
    const { _id: currentUserId } = userDetails;
    return (
      <Row>
        <Col xs={"12"} lg={"12"}>
          <Card>
            <CardHeader>
              <h4>
                <i className="fa fa-database" /> Materials
              </h4>
              <Button
                className={"pull-right theme-btn add-btn btn-link"}
                id={"add-new-pm-tooltip"}
                onClick={() => {
                  this.props.history.push(
                    AppRoutes.ADD_MATERIAL.replace(":folderId", folderId)
                  );
                }}
              >
                <i className={"fa fa-plus"} />
                &nbsp; Add New Material
              </Button>
              <UncontrolledTooltip target={"add-new-pm-tooltip"}>
                Add New Material
              </UncontrolledTooltip>
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

              <MaterialList
                skip={skip}
                materials={materials}
                isLoading={isLoading}
                refreshList={this.getMaterials}
                currentUserId={currentUserId}
                folderId={folderId}
                redirect={push}
              />

              {!isLoading && totalCount > limit ? (
                <PaginationHelper
                  totalRecords={totalCount}
                  onPageChanged={this.handleSelected}
                  currentPage={selectedPage}
                  pageLimit={limit}
                />
              ) : null}
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Material;

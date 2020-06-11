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
  Form
} from "reactstrap";
import Select from "react-select";
import { AppRoutes } from "../../config/AppRoutes";
import qs from "querystring";
import { getAllCurriculums } from "../../methods";
import { logger } from "../../helpers/Logger";

import CurriculumList from "./CurriculumList";
import { ClassList, SubjectOptions } from "../../helpers";
import PaginationHelper from "../../helpers/Pagination";

class Curriculum extends Component {
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
      folderId: ""
    };
  }

  handleChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value
    });
  };

  /**
   *@description: life cycel of react :- get material list when page load
   */
  componentDidMount() {
    const { location, match } = this.props;
    const { search: currentSearch } = location;
    let { selectedSubject, selectedYear, search, selectedPage } = qs.parse(
      currentSearch.replace("?", "")
    );
    const { params } = match;
    const { folderId } = params;
    logger(folderId);
    selectedPage = selectedPage || 1;
    this.setState(
      {
        search: search || "",
        selectedSubject: selectedSubject || "",
        selectedYear: selectedYear || "",
        selectedPage,
        skip: this.state.limit * (selectedPage - 1),
        folderId
      },
      () => {
        this.getCurriculums();
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
    const { search: prevSearch, selectedPage: prevSelectedPage } = prevLocation;
    const { location } = this.props;
    const {
      search: currentSearch,
      selectedPage: currentSelectedPage
    } = location;
    if (
      prevSearch !== currentSearch ||
      prevSelectedPage !== currentSelectedPage
    ) {
      let { selectedSubject, selectedYear, search, selectedPage } = qs.parse(
        currentSearch.replace("?", "")
      );

      selectedPage = selectedPage || 1;
      this.setState(
        {
          search: search || "",
          selectedSubject: selectedSubject || "",
          selectedYear: selectedYear || "",
          selectedPage,
          skip: this.state.limit * (selectedPage - 1)
        },
        () => {
          this.getCurriculums();
        }
      );
    }
  }
  /**
   *@description: get material list method
   */
  getCurriculums = async () => {
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
        folderId
      } = this.state;
      const data = {
        skip,
        limit,
        search,
        statusActive,
        selectedSubject,
        selectedYear,
        folderId
      };
      const { data: resp } = await getAllCurriculums(data);
      const { totalCurriculum, data: materials } = resp;
      this.setState({
        materials,
        totalCount: totalCurriculum,
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
   *@description: Search method
   */
  onSearch = e => {
    e.preventDefault();
    logger(this.state);
    const { search, selectedYear, selectedSubject, folderId } = this.state;
    const query = qs.stringify({
      search,
      selectedYear,
      selectedSubject
    });
    logger(query);
    this.props.history.push(
      `${AppRoutes.CURRICULUM.replace(":folderId", folderId)}?${query}`
    );
  };
  /**
   * @description filter reset method
   */
  onReset = () => {
    this.props.history.push(
      `${AppRoutes.CURRICULUM.replace(":folderId", this.state.folderId)}`
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
      `${AppRoutes.CURRICULUM.replace(":folderId", folderId)}?${querystring}`
    );
  };

  render() {
    const {
      materials,
      isLoading,
      skip,
      search,
      subjectOptions,
      classOptions,
      selectedYear,
      selectedSubject,
      totalCount,
      limit,
      selectedPage
    } = this.state;
    const { userDetails } = this.props;
    let selectedYr = selectedYear
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
      : null;
    const { _id: currentUserId } = userDetails;
    return (
      <Row>
        <Col xs={"12"} lg={"12"}>
          <Card>
            <CardHeader>
              <h4>
                <i className="fa fa-database" /> Curriculum
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
                            placeholder="Search by curriculum name"
                            value={search}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
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
                    </Col>
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

              <CurriculumList
                skip={skip}
                materials={materials}
                isLoading={isLoading}
                refreshList={this.getCurriculums}
                currentUserId={currentUserId}
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

export default Curriculum;

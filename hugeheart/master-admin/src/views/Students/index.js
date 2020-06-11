import React, { Component } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  UncontrolledTooltip,
  Button
} from "reactstrap";
import StudentList from "./StudentList";
import { AppRoutes, AppConfig } from "../../config";
import qs from "querystring";
import { logger } from "../../helpers";
import PaginationHelper from "../../helpers/Pagination";
import { getStudents } from "../../methods";
class Students extends Component {
  isMount;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false,
      search: "",
      status: "",
      page: 1,
      total: 0,
      limit: AppConfig.ITEMS_PER_PAGE
    };
    this.isMount = true;
  }
  /**
   *
   */
  componentDidMount() {
    const { location } = this.props;
    const { search: currentSearch } = location;
    const { search, page, status } = qs.parse(currentSearch.replace("?", ""));
    this.setState(
      {
        search: search || "",
        page: page || 1,
        status: status || ""
      },
      () => {
        this.getStudents();
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
      const { search, page, status } = qs.parse(currentSearch.replace("?", ""));
      this.setState(
        {
          search: search || "",
          page: page || 1,
          status: status || ""
        },
        () => {
          this.getStudents();
        }
      );
    }
  }
  /**
   *
   */
  getStudents = async () => {
    try {
      this.setState({
        isLoading: true,
        data: []
      });
      const { limit, search, status, page } = this.state;
      const data = { limit, search, status, page };
      const { data: resp } = await getStudents(data);
      const { totalUsers: total, data: users } = resp;
      if (this.isMount) {
        this.setState({
          data: users,
          total,
          isLoading: false
        });
      }
    } catch (error) {
      logger(error);
      if (this.isMount) {
        this.setState({
          isLoading: false,
          data: []
        });
      }
    }
  };
  /**
   *
   */
  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };
  /**
   *
   */
  onSearch = e => {
    e.preventDefault();
    const { search, status } = this.state;
    const query = qs.stringify({ search, status });
    this.props.history.push(`${AppRoutes.STUDENTS}?${query}`);
  };
  /**
   *
   */
  onReset = () => {
    this.props.history.push(`${AppRoutes.STUDENTS}`);
  };
  /**
   *
   */
  onPageChange = page => {
    const { location } = this.props;
    const { search: currentSearch } = location;
    const { search, status } = qs.parse(currentSearch.replace("?", ""));
    const query = qs.stringify({ search, status, page });
    this.props.history.push(`${AppRoutes.STUDENTS}?${query}`);
  };
  /**
   *
   */
  componentWillUnmount() {
    this.isMount = false;
  }
  /**
   *
   */
  render() {
    const { search, isLoading, data, status, limit, total, page } = this.state;
    const { userDetails, priceData } = this.props;
    const { userRole } = userDetails || {};
    const isNoTeacher = userRole !== "teacher";

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <CardHeader>
                <h4>
                  <i className="fa fa-users" /> Students
                </h4>
                {isNoTeacher ? (
                  <>
                    <Button
                      className={"pull-right theme-btn add-btn btn-link"}
                      id={"add-new-pm-tooltip"}
                      onClick={e => {
                        this.props.history.push(AppRoutes.ADD_STUDENT);
                      }}
                    >
                      <i className={"fa fa-plus"} />
                      &nbsp; {"Add New Student"}
                    </Button>
                    <UncontrolledTooltip target={"add-new-pm-tooltip"}>
                      {"Add New Student"}
                    </UncontrolledTooltip>
                  </>
                ) : null}
              </CardHeader>
              <CardBody>
                <div className={"filter-block"}>
                  <Form onSubmit={this.onSearch}>
                    <Row>
                      <Col lg={"3"} md={"3"} className="mb-0">
                        <FormGroup className="mb-0">
                          <Label className="label">Search</Label>
                          <InputGroup className="mb-2">
                            <Input
                              type="text"
                              name="search"
                              onChange={this.handleChange}
                              className="form-control"
                              aria-describedby="searchUser"
                              placeholder="Search by name or email"
                              value={search}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col lg={"3"} md={"3"} className="mb-0">
                        <FormGroup className="mb-0">
                          <Label for="exampleSelect" className="label">
                            Status
                          </Label>
                          <Input
                            type="select"
                            name="status"
                            id="exampleSelect"
                            value={status}
                            onChange={this.handleChange}
                          >
                            <option className="form-control" value={""}>
                              -- Select Status --
                            </option>
                            <option value={"enrolled"}>Enrolled</option>
                            <option value={"not enrolled"}>Not Enrolled</option>
                          </Input>
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
                    <StudentList
                      isLoading={isLoading}
                      data={data}
                      page={page}
                      limit={limit}
                      history={this.props.history}
                      userDetails={userDetails}
                      refreshList={this.getStudents}
                      priceData={priceData}
                    />
                    {!isLoading && total > limit ? (
                      <PaginationHelper
                        totalRecords={total}
                        pageLimit={total}
                        onPageChanged={this.onPageChange}
                        currentPage={page}
                      />
                    ) : null}
                  </Form>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Students;

import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  UncontrolledTooltip,
  Label,
  Input,
  FormGroup,
  InputGroup,
  Form,
  Button
} from "reactstrap";
import { AppRoutes } from "../../config/AppRoutes";
import { logger } from "../../helpers/Logger";
import PaginationHelper from "../../helpers/Pagination";
import MasterAdminList from "./MasterAdminList";
import { getUsers } from "../../methods";
import qs from "querystring";
class MasterAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      totalCount: 0,
      selectedPage: 1,
      limit: 10,
      skip: 0,
      search: "",
      isActive: true,
      statusActive: "",
      isLoading: true
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
   *
   */
  componentDidMount() {
    this.getData();
  }
  /**
   *
   */
  componentDidUpdate({ location: prevLocation }) {
    const { location } = this.props;
    const { search: locationSearch } = location;
    const { search: prevSearch } = prevLocation;
    if (locationSearch !== prevSearch) {
      this.getData();
    }
  }
  /**
   *
   */
  getData = () => {
    const { location } = this.props;
    const { search: locationSearch } = location;
    const { search, statusActive, selectedPage } = qs.parse(
      locationSearch.replace("?", "")
    );
    this.setState(
      {
        search: search || "",
        statusActive: statusActive || "",
        selectedPage: selectedPage || 1
      },
      () => {
        this.getUsers();
      }
    );
  };
  /**
   *
   */
  getUsers = async () => {
    try {
      this.setState({
        isLoading: true,
        users: []
      });
      const { skip, limit, search, statusActive } = this.state;
      const data = { skip, limit, search, statusActive };
      const { data: resp } = await getUsers(data);
      const { totalUsers, data: users } = resp;
      this.setState({
        users,
        totalCount: totalUsers,
        isLoading: false
      });
    } catch (error) {
      logger(error);
      this.setState({
        isLoading: false,
        users: []
      });
    }
  };
  /**
   *
   */
  handleSelected = async page => {
    const { search, statusActive } = this.state;
    const querystring = qs.stringify({
      selectedPage: page,
      search,
      statusActive
    });
    this.props.history.push(`${AppRoutes.USERS}?${querystring}`);
  };
  /**
   *
   */
  /**
   *
   */
  onSearch = async e => {
    e.preventDefault();
    const { search, statusActive } = this.state;
    const querystring = qs.stringify({
      selectedPage: 1,
      search,
      statusActive
    });
    this.props.history.push(`${AppRoutes.USERS}?${querystring}`);
  };
  /**
   *
   */
  onReset = async e => {
    e.preventDefault();
    this.props.history.push(AppRoutes.USERS);
  };

  render() {
    const { history } = this.props;
    const { push } = history;
    const {
      users,
      isLoading,
      totalCount,
      limit,
      skip,
      selectedPage,
      search,
      statusActive
    } = this.state;
    return (
      <Row>
        <Col xs={"12"} lg={"12"}>
          <Card>
            <CardHeader>
              <h4>
                <i className="fa fa-users" /> Master Admins
              </h4>
              <Button
                className={"pull-right theme-btn add-btn btn-link"}
                id={"add-new-pm-tooltip"}
                onClick={() => {
                  this.props.history.push(AppRoutes.ADD_USER);
                }}
              >
                <i className={"fa fa-plus"} />
                &nbsp; Add New Master Admin
              </Button>
              <UncontrolledTooltip target={"add-new-pm-tooltip"}>
                Add New Master Admin
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
                            placeholder="Search by name and email"
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
                          name="statusActive"
                          id="exampleSelect"
                          value={statusActive}
                          onChange={this.handleChange}
                        >
                          <option className="form-control" value={""}>
                            -- Select Status --
                          </option>
                          <option value={true}>Active</option>
                          <option value={false}>Deactive</option>
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
                </Form>
              </div>
              <MasterAdminList
                skip={skip}
                users={users}
                isLoading={isLoading}
                refreshList={this.getUsers}
                redirect={push}
              />
              {!isLoading && totalCount > limit ? (
                <PaginationHelper
                  totalRecords={totalCount}
                  onPageChanged={this.handleSelected}
                  currentPage={selectedPage}
                />
              ) : null}
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default MasterAdmin;

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
import { AppRoutes } from "../../config/AppRoutes";
import { logger } from "../../helpers/Logger";
import PaginationHelper from "../../helpers/Pagination";
import PrincipleList from "./PrincipleList";
import { getPrinciple } from "../../methods";
import qs from "querystring";
class Principle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      principles: [],
      totalCount: 0,
      selectedPage: 1,
      limit: 1000,
      skip: 0,
      search: "",
      isActive: true,
      selectRole: "",
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
    const { search, selectRole, selectedPage } = qs.parse(
      locationSearch.replace("?", "")
    );
    this.setState(
      {
        search: search || "",
        selectRole: selectRole || "",
        selectedPage: selectedPage || 1
      },
      () => {
        this.getPrinciples();
      }
    );
  };
  /**
   *
   */
  getPrinciples = async () => {
    try {
      this.setState({
        isLoading: true,
        principles: []
      });
      const { skip, limit, search, selectRole } = this.state;
      const data = { skip, limit, search, selectRole };
      const { data: resp } = await getPrinciple(data);
      const { totalprinciples, data: principles } = resp;
      this.setState({
        principles,
        totalCount: totalprinciples,
        isLoading: false
      });
    } catch (error) {
      logger(error);
      this.setState({
        isLoading: false,
        principles: []
      });
    }
  };
  /**
   *
   */
  handleSelected = async page => {
    const { search, selectRole } = this.state;
    const querystring = qs.stringify({
      selectedPage: page,
      search,
      selectRole
    });
    this.props.history.push(`${AppRoutes.PRINCIPLE}?${querystring}`);
  };
  /**
   *
   */
  onSearch = async e => {
    e.preventDefault();
    const { search, selectRole } = this.state;
    const querystring = qs.stringify({
      selectedPage: 1,
      search,
      selectRole
    });
    this.props.history.push(`${AppRoutes.PRINCIPLE}?${querystring}`);
  };
  /**
   *
   */
  onReset = async e => {
    e.preventDefault();
    this.props.history.push(AppRoutes.PRINCIPLE);
  };

  render() {
    const { history } = this.props;
    const { push } = history;
    const {
      principles,
      isLoading,
      totalCount,
      limit,
      skip,
      selectedPage,
      search
    } = this.state;
    return (
      <Row>
        <Col xs={"12"} lg={"12"}>
          <Card>
            <CardHeader>
              <h4>
                <i className="fa fa-graduation-cap" /> Principles
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
                            placeholder="Search by principle"
                            value={search}
                          />
                        </InputGroup>
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
              <PrincipleList
                skip={skip}
                principles={principles}
                isLoading={isLoading}
                refreshList={this.getPrinciples}
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

export default Principle;

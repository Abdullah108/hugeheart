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
import BrandList from "./BrandList";
import { getBrands } from "../../methods/BrandAmbassador";
import { AppConfig } from "../../config";

class BrandAmbassador extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      totalCount: 0,
      selectedPage: 1,
      limit: AppConfig.ITEMS_PER_PAGE,
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
    this.getBrands();
  }
  /**
   *
   */
  getBrands = async () => {
    try {
      this.setState({
        isLoading: true,
        users: []
      });
      const { skip, limit, search, statusActive } = this.state;
      const data = { skip, limit, search, statusActive };
      const { data: resp } = await getBrands(data);
      console.log("====================================");
      console.log(data);
      console.log("====================================");
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

  handleSelected = async page => {
    this.setState(
      {
        selectedPage: page,
        skip: this.state.limit * (page - 1)
      },
      () => {
        this.getBrands();
      }
    );
  };

  /**
   *
   */
  onSearch = async e => {
    e.preventDefault();
    this.setState(
      {
        selectedPage: 1,
        skip: 0
      },
      () => {
        this.getBrands();
      }
    );
  };
  /**
   *
   */
  onReset = async e => {
    e.preventDefault();
    this.setState(
      {
        search: "",
        selectedPage: 1,
        skip: 0,
        statusActive: "",
        ids: ""
      },
      () => {
        this.getBrands();
      }
    );
  };

  render() {
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
                <i className="fa fa-users" /> Brand Ambassador
              </h4>
              <Button
                className={"pull-right theme-btn add-btn btn-link"}
                id={"add-new-pm-tooltip"}
                onClick={() => {
                  this.props.history.push(AppRoutes.ADD_BRAND_AMBASSADOR);
                }}
              >
                <i className={"fa fa-plus"} />
                &nbsp; Add New Brand Ambassador
              </Button>
              <UncontrolledTooltip target={"add-new-pm-tooltip"}>
                Add New Brand Ambassador
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
              <BrandList
                skip={skip}
                users={users}
                refreshList={this.getBrands}
                isLoading={isLoading}
                history={this.props.history}
              />
              {!isLoading && totalCount > limit ? (
                <PaginationHelper
                  totalRecords={totalCount}
                  pageLimit={limit}
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

export default BrandAmbassador;

import React, { Component } from "react";
import { Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import { AppRoutes } from "../../config/AppRoutes";
import { logger } from "../../helpers/Logger";
import PaginationHelper from "../../helpers/Pagination";
import { getNotification } from "../../methods";
import qs from "querystring";
import NotificationList from "./NotificationList";

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      totalCount: 0,
      selectedPage: 1,
      limit: 10,
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
        this.getNotification();
      }
    );
  };
  /**
   *
   */
  getNotification = async () => {
    try {
      this.setState({
        isLoading: true,
        notifications: []
      });
      const { skip, limit, search, selectRole } = this.state;
      const data = { skip, limit, search, selectRole };
      const { data: resp } = await getNotification(data);
      const { totalprinciples, data: notifications } = resp;
      this.setState({
        notifications,
        totalCount: totalprinciples,
        isLoading: false
      });
    } catch (error) {
      logger(error);
      this.setState({
        isLoading: false,
        notifications: []
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
      notifications,
      isLoading,
      totalCount,
      limit,
      skip,
      selectedPage
    } = this.state;
    return (
      <Row>
        <Col xs={"12"} lg={"12"}>
          <Card>
            <CardHeader>
              <h4>
                <i className="fa fa-bell" /> Notifications
              </h4>
            </CardHeader>
            <CardBody>
              <NotificationList
                skip={skip}
                notifications={notifications}
                isLoading={isLoading}
                refreshList={this.getNotification}
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
export default Notification;

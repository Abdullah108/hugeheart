import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  UncontrolledTooltip,
  Button
} from "reactstrap";
import { AppRoutes } from "../../../config";
import { logger } from "../../../helpers";
import { getMasterAdminDetails } from "../../../methods";
import Loader from "../../../containers/Loader/Loader";
import MasterAdminDetailsView from "./MasterAdminDetails";
import AssignedTeachers from "./AssignedTeachers";
class MasterAdminDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userDetails: {},
      masterAdminId: ""
    };
  }
  /**
   *
   */
  componentDidMount() {
    const { params } = this.props.match;
    const { id } = params;
    logger(id);
    this.setState({
      masterAdminId: id
    });
    if (id) {
      this.getDetails(id);
    } else {
      this.props.history.push(AppRoutes.NOT_FOUND);
    }
  }
  /**
   *
   */
  getDetails = async id => {
    const { isSuccess, data } = await getMasterAdminDetails(id);
    if (!isSuccess) {
      this.props.history.push(AppRoutes.NOT_FOUND);
      return;
    }
    logger(data.data);
    this.setState({
      isLoading: false,
      userDetails: data.data
    });
  };
  /**
   *
   */
  render() {
    const { isLoading, userDetails, masterAdminId } = this.state;
    logger(userDetails);
    return (
      <Row>
        <Col xs={"12"} lg={"12"}>
          <Card>
            <CardHeader>
              <h4>
                <i className="fa fa-eye" />{" "}
                {isLoading ? "Please wait.." : `${userDetails.fullName}`}
              </h4>
              {!isLoading ? (
                <>
                  <Button
                    className={"pull-right theme-btn add-btn btn-link"}
                    id={"add-new-pm-tooltip"}
                    onClick={() => {
                      this.props.history.push(
                        AppRoutes.USER_DETAILS_EDIT.replace(
                          ":id",
                          userDetails._id
                        )
                      );
                    }}
                  >
                    <i className={"fa fa-pencil"} />
                    &nbsp; Edit details
                  </Button>
                  <UncontrolledTooltip target={"add-new-pm-tooltip"}>
                    Edit details of {userDetails.fullName}
                  </UncontrolledTooltip>
                </>
              ) : null}
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Loader />
              ) : (
                <MasterAdminDetailsView
                  userDetails={userDetails || {}}
                  goToList={() => this.props.history.push(AppRoutes.USERS)}
                />
              )}
            </CardBody>
          </Card>
        </Col>
        <Col sm={"12"}>
          {masterAdminId ? (
            <AssignedTeachers masterAdminId={masterAdminId} />
          ) : null}
        </Col>
      </Row>
    );
  }
}

export default MasterAdminDetails;

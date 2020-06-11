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
import { getPrincipleDetails } from "../../../methods";
import PrincipleDetailsView from "./PrincipleDetails";
class PrincipleDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      principleDetails: {}
    };
  }
  /**
   *
   */
  componentDidMount() {
    const { params } = this.props.match;
    const { id } = params;
    logger(id);
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
    const { isSuccess, data } = await getPrincipleDetails(id);
    if (!isSuccess) {
      this.props.history.push(AppRoutes.NOT_FOUND);
      return;
    }
    logger(data.data);
    this.setState({
      isLoading: false,
      principleDetails: data.data
    });
  };
  /**
   *
   */
  render() {
    const { isLoading, principleDetails } = this.state;
    logger(principleDetails);
    return (
      <Row>
        <Col xs={"12"} lg={"12"}>
          <Card>
            <CardHeader>
              <h4>
                <i className="fa fa-eye" /> Principle Details
              </h4>
              {!isLoading ? (
                <>
                  <Button
                    className={"pull-right theme-btn add-btn btn-link"}
                    id={"add-new-pm-tooltip"}
                    onClick={() => {
                      this.props.history.push(
                        AppRoutes.PRINCIPLE_DETAILS_EDIT.replace(
                          ":id",
                          principleDetails._id
                        )
                      );
                    }}
                  >
                    <i className={"fa fa-pencil"} />
                    &nbsp; Edit details
                  </Button>
                  <UncontrolledTooltip target={"add-new-pm-tooltip"}>
                    Edit Principle
                  </UncontrolledTooltip>
                </>
              ) : null}
            </CardHeader>
            <CardBody>
              <PrincipleDetailsView
                principleDetails={principleDetails || {}}
                goToList={() => this.props.history.push(AppRoutes.PRINCIPLE)}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default PrincipleDetails;

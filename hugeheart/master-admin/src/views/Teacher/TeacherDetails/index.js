import React, { Component } from "react";
import { Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import { AppRoutes } from "../../../config";
import { logger } from "../../../helpers";
import { getTeacherDetails } from "../../../methods";
import Loader from "../../../containers/Loader/Loader";
import TeacherDetailsView from "./TeacherDetails";
import TeacherCalendar from "./TeacherCalendar";
class TeacherDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userDetails: {}
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
    const { isSuccess, data } = await getTeacherDetails(id);
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
    const { isLoading, userDetails } = this.state;
    const { firstName, lastName } = userDetails;
    logger(userDetails);
    let Surname = lastName ? lastName.match(/\b(\w)/g) : "-";
    const { params } = this.props.match;
    const { id } = params;
    return (
      <>
        <Row>
          <Col xs={"12"} lg={"12"}>
            <Card>
              <CardHeader>
                <h4>
                  <i className="fa fa-eye" />{" "}
                  {isLoading ? "Please wait.." : `${firstName}${" "}${Surname}`}
                </h4>
              </CardHeader>
              <CardBody>
                {isLoading ? (
                  <Loader />
                ) : (
                  <TeacherDetailsView
                    userDetails={userDetails || {}}
                    goToList={() =>
                      this.props.history.push(AppRoutes.GET_TEACHER)
                    }
                  />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <TeacherCalendar
          teacherId={id}
          availibility={userDetails.availibility}
        />
      </>
    );
  }
}

export default TeacherDetails;

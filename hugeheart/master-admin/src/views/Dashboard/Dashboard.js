import React, { Component } from "react";
import { Card, CardBody, Col, Row, CardHeader } from "reactstrap";
import { Translation } from "../../translation";
import Loader from "./../../containers/Loader/Loader";
const TeacherDashboard = React.lazy(() => import("./TeacherDashboardV2"));
const StudentDashboard = React.lazy(() => import("./StudentDashboard"));

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  /**
   *
   */
  renderDashboard = (userRole) => {
    switch (userRole) {
      case "student":
        return (
          <React.Suspense fallback={<Loader />}>
            <StudentDashboard />
          </React.Suspense>
        );

      case "teacher":
        return (
          <React.Suspense fallback={<Loader />}>
            <TeacherDashboard />
          </React.Suspense>
        );

      default:
        return (
          <h4 className={"text-center"}>{Translation.COMING_SOON_TEXT}</h4>
        );
    }
  };
  /**
   *
   */
  render() {
    const { userDetails } = this.props;
    const { userRole } = userDetails || {};

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <CardHeader>
                <h4>
                  <i className="fa fa-dashboard" /> {Translation.DASHBOARD}
                </h4>
              </CardHeader>
              <CardBody>{this.renderDashboard(userRole)}</CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;

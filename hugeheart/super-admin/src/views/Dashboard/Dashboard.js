import React, { Component } from "react";
import { Card, CardBody, Col, Row, CardHeader } from "reactstrap";
import { Translation } from "../../translation";
// import FullCalendars from "./FullCalendar";
import FullCalendars from "./DashboardV2";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
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
              <CardBody>
                <Card
                  style={{
                    marginTop: 0
                  }}
                >
                  <h4 style={{ padding: "10px 20px" }}>Teacher's Schedule</h4>
                  <CardBody
                    style={{
                      marginTop: 0
                    }}
                  >
                    <h4 className={"text-center"}>
                      <FullCalendars />
                    </h4>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;

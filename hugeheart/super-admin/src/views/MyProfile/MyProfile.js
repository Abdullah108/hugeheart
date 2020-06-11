import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import UpdateDetails from "./UpdateDetails";
import UpdatePassword from "./UpdatePassword";

class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <div className="cr-page px-3 min-height650">
        <Row>
          <Col xs="6" sm="6" lg="6">
            <UpdateDetails />
          </Col>

          <Col xs="6" sm="6" lg="6">
            <UpdatePassword />
          </Col>
        </Row>
      </div>
    );
  }
}

export default MyProfile;

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
          <Col xs="12" sm="12" lg="12">
            <UpdateDetails />
          </Col>

          <Col xs="12" sm="12" lg="12">
            <UpdatePassword />
          </Col>
        </Row>
      </div>
    );
  }
}

export default MyProfile;

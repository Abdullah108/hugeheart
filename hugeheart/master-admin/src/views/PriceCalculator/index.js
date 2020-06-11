import React, { Component } from "react";
import ModalContainer from "../../containers/Modal";
import { Form, Row, Col, Label } from "reactstrap";

import { getPriceGuide } from "../../methods";
class PriceCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "1-6": 10,
      "7-10": 20,
      "11-12": 50,
      isLoading: false,
    };
  }
  componentDidMount() {
    this.getPriceGuide();
  }
  getPriceGuide = async () => {
    const { isSuccess, data } = await getPriceGuide();
    let dataToSet = {};
    if (isSuccess) {
      data.data.forEach((d) => {
        dataToSet[d._id] = d.price;
      });
      this.setState(dataToSet);
    } else {
      dataToSet = {
        "1-6": 10,
        "7-10": 20,
        "11-12": 50,
      };
      this.setState(dataToSet);
    }
    this.props.priceData(dataToSet);
  };
  /**
   *
   */
  renderInput = (label, name) => {
    return (
      <>
        <Col sm={"4"}>
          <Label> {label}</Label>
        </Col>
        <Col sm={"8"}>
          <strong>${this.state[name]}/Hour</strong>
        </Col>
      </>
    );
  };
  /**
   *
   */
  render() {
    const { isOpen, hideModal } = this.props;

    return (
      <ModalContainer
        isOpen={isOpen}
        hideModal={hideModal}
        headerText={"Standard Price"}
        size={"md"}
        footerButtons={[
          {
            text: "Close",
            className: "btn-cancel",
            type: "button",
            onClick: hideModal,
          },
        ]}
      >
        <Form>
          <Row>
            {this.renderInput("Kindergarten to Year 6", "1-6")}
            {this.renderInput("Year 7 to Year 10", "7-10")}
            {this.renderInput("Year 11 to Year 12", "11-12")}
          </Row>
        </Form>
      </ModalContainer>
    );
  }
}

export default PriceCalculator;

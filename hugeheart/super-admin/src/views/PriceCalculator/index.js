import React, { Component } from "react";
import ModalContainer from "../../containers/Modal";
import { Form, FormGroup, Row, Col, Label, Input } from "reactstrap";
import { logger, toast } from "../../helpers";
import { updatePrice, getPriceGuide } from "../../methods";
class PriceCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "1-6": 10,
      "7-10": 20,
      "11-12": 50,
      isLoading: false
    };
  }
  componentDidMount() {
    this.getPriceGuide();
  }
  getPriceGuide = async () => {
    const { isSuccess, data } = await getPriceGuide();
    const dataToSet = {
      "1-6": 10,
      "7-10": 20,
      "11-12": 50
    };
    if (isSuccess) {
      data.data.forEach(d => {
        dataToSet[d._id] = d.price;
      });
      this.setState(dataToSet);
    }
    this.props.priceData(dataToSet);
  };
  /**
   *
   */
  onInputChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
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
          <FormGroup>
            <Input
              className={"floating-input"}
              type={"number"}
              placeholder={"$"}
              value={this.state[name]}
              name={name}
              onChange={this.onInputChange}
            />
          </FormGroup>
        </Col>
      </>
    );
  };
  /**
   *
   */
  updatePrice = async e => {
    e.preventDefault();
    this.setState({
      isLoading: true
    });
    const d = {
      "1-6": this.state["1-6"],
      "7-10": this.state["7-10"],
      "11-12": this.state["11-12"]
    };
    const { isSuccess, message, data } = await updatePrice(d);
    logger(isSuccess, message, data);
    this.setState({
      isLoading: false
    });
    if (isSuccess) {
      toast(message, "success");
      this.props.hideModal();
      return;
    }
    toast(message, "error");
    this.props.priceData(d);
  };
  /**
   *
   */
  render() {
    const { isOpen, hideModal } = this.props;
    const { isLoading } = this.state;
    return (
      <ModalContainer
        isOpen={isOpen}
        hideModal={hideModal}
        headerText={"Standard Price"}
        size={"md"}
        footerButtons={[
          {
            text: "Cancel",
            className: "btn-cancel",
            type: "button",
            onClick: hideModal
          },
          {
            text: "Save",
            className: "btn-submit",
            isLoading,
            type: "submit",
            onClick: this.updatePrice
          }
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

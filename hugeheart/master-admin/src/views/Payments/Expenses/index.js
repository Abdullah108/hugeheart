import CardContainer from "../../../containers/CardContainer";
import React, { Component } from "react";
class Expenses extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <CardContainer title={"Expenses"} icon={"fa fa-upload"}>
        Video Conferencing Page
      </CardContainer>
    );
  }
}

export default Expenses;

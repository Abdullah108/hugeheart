import CardContainer from "../../../containers/CardContainer";
import React, { Component } from "react";

class Incomes extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <CardContainer title={"Incomes"} icon={"fa fa-download"}>
        Incomes Page
      </CardContainer>
    );
  }
}

export default Incomes;

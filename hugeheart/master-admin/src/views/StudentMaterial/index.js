import React, { Component } from "react";
import CardContainer from "../../containers/CardContainer";

class StudentMaterial extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <CardContainer title={"Materials"} icon={"fa fa-files-o"}>
        Material Section of student goes here.
      </CardContainer>
    );
  }
}

export default StudentMaterial;

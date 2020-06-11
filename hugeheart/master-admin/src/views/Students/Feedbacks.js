import React, { Component } from "react";
import ModalContainer from "../../containers/Modal";
import { Row, Col } from "reactstrap";

class Feedbacks extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { isOpen, hideModal, selectedItem } = this.props;
    const { teacherId } = selectedItem || {};
    let { feedbacks } = teacherId || {};
    if (!feedbacks || !feedbacks.map) {
      feedbacks = [];
    }
    return (
      <ModalContainer
        isOpen={isOpen}
        hideModal={hideModal}
        size={"md"}
        headerText={`Feedbacks`}
        footerButtons={[
          {
            text: "Close",
            onClick: hideModal,
            className: "btn-cancel"
          }
        ]}
      >
        <Row>
          {feedbacks.length ? (
            feedbacks.map((feedback, index) => (
              <Col sm={"12"} key={index}>
                <p className={"textarea"}>{feedback.text}</p>
              </Col>
            ))
          ) : (
            <Col sm={"12"}>
              <p className={"text-center"}>No feedback found.</p>
            </Col>
          )}
        </Row>
      </ModalContainer>
    );
  }
}

export default Feedbacks;

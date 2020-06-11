import React, { Component } from "react";
import ModalContainer from "../../containers/Modal";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { toast } from "../../helpers";
import { sendFeedbackOnSchedule } from "../../methods";
class LeaveFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedback: "",
      errors: {},
      isLoading: false
    };
  }
  /**
   *
   */
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  /**
   *
   */
  sendFeeback = async e => {
    e.preventDefault();
    const { scheduleId } = this.props;
    const { feedback } = this.state;
    this.setState({
      isLoading: true
    });

    const { isSuccess, errors, message } = await sendFeedbackOnSchedule({
      scheduleId,
      feedback
    });
    if (!isSuccess) {
      this.setState({
        isLoading: false,
        errors: errors || {}
      });
      if (message) toast(message, "error");
      return;
    }
    this.setState({
      isLoading: false
    });
    toast(message, "success");
    this.props.hideModal();
    this.props.refreshList();
  };
  /**
   *
   */
  render() {
    const { isOpen, hideModal } = this.props;
    const { errors, feedback, isLoading } = this.state;
    return (
      <Form>
        <ModalContainer
          isOpen={isOpen}
          toggle={hideModal}
          headerText={"Leave feedback for trial class"}
          size={"md"}
          footerButtons={[
            {
              text: "Cancel",
              color: "danger",
              className: "btn-cancel",
              onClick: hideModal
            },
            {
              text: "Send",
              type: "submit",
              isLoading,
              onClick: this.sendFeeback
            }
          ]}
        >
          <br />
          <br />
          <FormGroup>
            <Input
              type={"textarea"}
              name={"feedback"}
              id={"feedbacktext"}
              rows={5}
              value={feedback}
              className={"floating-input"}
              onChange={this.handleChange}
            />
            <Label className="floating-label form-label" for={"feedbacktext"}>
              Feedback
            </Label>
            {errors.feedback ? (
              <p className={"text-danger"}>{errors.feedback}</p>
            ) : null}
          </FormGroup>
        </ModalContainer>
      </Form>
    );
  }
}

export default LeaveFeedback;

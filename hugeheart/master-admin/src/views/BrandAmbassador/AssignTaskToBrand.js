import React, { Component } from "react";
import {
  Input,
  FormGroup,
  Form,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "reactstrap";
import { logger, toast } from "../../helpers";
import { assignTaskToBrand } from "../../methods/AssignTaskToBrand";
import "flatpickr/dist/themes/dark.css";
import Flatpickr from "react-flatpickr";
import LoadingButton from "../../components/LoadingButton";

class AssignTaskToBrand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignTask: "",
      additionalNote: "",
      assignDate: "",
      userId: "",
      modal: false,
      isEditMode: false,
      isFetchingDetails: true
    };
    this.exactLocation = React.createRef();
  }

  handleModelOpen = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };
  /**
   *
   */
  handleChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: null
      }
    });
  };
  /**
   *
   */
  handleSubmit = async event => {
    event.preventDefault();
    const { selectedBrand, hideModal } = this.props;
    this.setState({
      errors: {},
      isLoading: true
    });
    try {
      const { assignTask, additionalNote, assignDate } = this.state;
      const data = {
        assignTask,
        additionalNote,
        assignDate,
        userId: selectedBrand
      };
      const { isSuccess, message, errors } = await assignTaskToBrand(data);
      if (!isSuccess) {
        if (errors) {
          this.setState({
            errors
          });
        } else {
          toast(message, "error");
        }
        this.setState({ isLoading: false });
        return;
      }
      this.setState({
        isLoading: false
      });
      toast(message, "success");
      hideModal();
    } catch (error) {
      logger(error);
    }
  };

  render() {
    const { showTask, hideModal } = this.props;
    const { assignTask, additionalNote, assignDate, isLoading } = this.state;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Modal
            isOpen={showTask}
            toggle={hideModal}
            className={this.props.className}
          >
            <ModalHeader toggle={hideModal}>
              {" "}
              <i className="fa fa-tasks" />
              &nbsp;Assign Task
            </ModalHeader>
            <br />
            <ModalBody>
              <FormGroup>
                <Flatpickr
                  onChange={date => {
                    this.setState({
                      assignDate: date
                    });
                  }}
                  options={{
                    altInput: true,
                    altFormat: "F j, Y",
                    dateFormat: "Y-m-d",
                    minDate: new Date()
                  }}
                  name="assignDate"
                  id="Contract-term"
                  value={assignDate}
                  className={"form-control floating-input"}
                  //placeholder={' '}
                />
                <Label
                  className="floating-label form-label"
                  for="contactNumber"
                >
                  Date
                </Label>
              </FormGroup>
              <FormGroup>
                <Input
                  type="text"
                  name="assignTask"
                  id="assignTask"
                  value={assignTask}
                  className={"floating-input"}
                  onChange={this.handleChange}
                  //placeholder={' '}
                />
                <Label className="floating-label form-label" for="assignTask">
                  Assign Task
                </Label>
              </FormGroup>

              <FormGroup>
                <textarea
                  type="text"
                  name="additionalNote"
                  id="additionalNote"
                  value={additionalNote}
                  className={"form-control floating-input"}
                  onChange={this.handleChange}
                  style={{ width: "100%" }}
                  // placeholder={' '}
                />
                <Label
                  className="floating-label form-label"
                  for="additionalNote"
                >
                  Additional Note
                </Label>
              </FormGroup>
            </ModalBody>

            <ModalFooter>
              <Button
                type="button"
                color={"danger"}
                className={"btn-cancel btn-submit btn-link"}
                onClick={hideModal}
              >
                Close
              </Button>
              {isLoading ? (
                <LoadingButton />
              ) : (
                <Button
                  type="submit"
                  color={"primary"}
                  className={"btn-submit btn-link"}
                  onClick={this.handleSubmit}
                >
                  Save
                </Button>
              )}
            </ModalFooter>
          </Modal>
        </Form>
      </div>
    );
  }
}

export default AssignTaskToBrand;

import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
  Button
} from "reactstrap";
import LoadingButton from "../../components/LoadingButton";
import Flatpickr from "react-flatpickr";
import { toast } from "../../helpers";
import { assignTrainingBrand } from "../../methods/BrandAmbassador";
class ScheduleTraining extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      scheduleDate: "",
      trainingTitle: "",
      trainingDescription: "",
      trainingFor: "ba",
      errors: {}
    };
  }
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
  scheduleTrainingSubmit = async e => {
    e.preventDefault();
    this.setState({
      isLoading: true
    });
    const { selectedBrand, hideTrainingModal } = this.props;
    const { trainingTitle, trainingDescription, trainingFor, scheduleDate } = this.state;
    const postData = {
      trainingTitle,
      trainingFor,
      trainingDescription,
      scheduleDate: scheduleDate.toString(),
      teacherIds: selectedBrand
    };
    const { isSuccess, errors, message } = await assignTrainingBrand(
      postData
    );
    if (!isSuccess) {
      this.setState({
        isLoading: false,
        errors
      });
      return;
    }
    this.setState({
      isLoading: false,
      trainingTitle: "",
      trainingDescription: "",
      scheduleDate: "",
      trainingFor: "ba"
    });
    toast(message, "success");
    hideTrainingModal();
  };
  /**
   *
   */
  render() {
    const { showTraining, hideTrainingModal, fullName } = this.props;
    const {
      isLoading,
      scheduleDate,
      trainingTitle,
      trainingDescription,
      errors
    } = this.state;
    return (
      <Modal centered isOpen={showTraining} toggle={hideTrainingModal}>
        <ModalHeader toggle={hideTrainingModal}>
          Schedule training for {fullName || "teachers"}
        </ModalHeader>
        <ModalBody>
          <br />
          <Form onSubmit={this.scheduleTrainingSubmit}>
            <FormGroup>
              <Flatpickr
                onChange={date => {
                  this.setState({
                    scheduleDate: new Date(date[0]),
                    errors: {
                      scheduleDate: null
                    }
                  });
                }}
                options={{
                  altInput: true,
                  altFormat: "F j, Y H:i",
                  dateFormat: "Y-m-d H:i",
                  minDate: new Date(),
                  enableTime: true
                }}
                name="scheduleDate"
                id="scheduleDate"
                className={"floating-input"}
                value={scheduleDate}
                placeholder={" "}
              />
              <Label className="floating-label form-label" for="contactNumber">
                 Schedule Date and time
              </Label>
              {errors.scheduleDate ? (
                <p className={"text-danger"}>{errors.scheduleDate}</p>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                name="trainingTitle"
                id="trainingTitle"
                onChange={this.handleChange}
                className={"floating-input"}
                placeholder={" "}
                value={trainingTitle}
              />
              <Label
                className="floating-label form-label"
                htmlFor="trainingTitle"
              >
                Training Title
              </Label>
              {errors.trainingTitle ? (
                <p className={"text-danger"}>{errors.trainingTitle}</p>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Input
                type="textarea"
                name="trainingDescription"
                id="trainingDescription"
                onChange={this.handleChange}
                className={"floating-input"}
                placeholder={" "}
                value={trainingDescription}
              />
              <Label
                className="floating-label form-label"
                htmlFor="trainingDescription"
              >
                Training Description
              </Label>
              {errors.trainingDescription ? (
                <p className={"text-danger"}>{errors.trainingDescription}</p>
              ) : null}
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            color={"danger"}
            className={"btn-cancel btn-submit btn-link"}
            onClick={hideTrainingModal}
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
              onClick={this.scheduleTrainingSubmit}
            >
              Save
            </Button>
          )}
        </ModalFooter>
      </Modal>
    );
  }
}

export default ScheduleTraining;

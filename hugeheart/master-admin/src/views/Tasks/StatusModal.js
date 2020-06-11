import React, { Component } from "react";
import {
  Form,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormGroup,
  Input,
  Label,
  Button
} from "reactstrap";
import LoadingButton from "./../../components/LoadingButton";
import Select from "react-select";
import { SelectMarkAs } from "../../helpers/SelectOptions";
import { logger, toast } from "../../helpers";
import { updateTaskForBA } from "../../methods";

class StatusModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      status: "",
      note: "",
      id: "",
      errors: {
        note: null,
        status: null
      }
    };
  }
  componentDidMount() {
    logger(this.props);
    this.setState({
      id: this.props.id,
      status: this.props.status
    });
  }
  /**
   *
   */
  statusUpdate = option => {
    logger(option);
    this.setState({
      status: option ? option.value : ""
    });
  };
  /**
   *
   */
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  /**
   *
   */
  handleSubmit = async e => {
    e.preventDefault();
    const { status, note, id } = this.state;
    this.setState({
      isLoading: true
    });
    const { isSuccess, message, errors } = await updateTaskForBA(
      {
        status,
        note
      },
      id
    );
    logger(isSuccess, message);
    this.setState({
      isLoading: false
    });
    if (!isSuccess) {
      if (errors) {
        this.setState({ errors });
        return;
      }
      toast(message, "error");
      return;
    }
    toast(message, "success");
    this.props.hideModal();
    this.props.refreshList();
  };
  /**
   *
   */
  render() {
    const { showStatusUpdate, hideModal } = this.props;
    const { isLoading, status, note, errors } = this.state;
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Modal
            isOpen={showStatusUpdate}
            toggle={hideModal}
            className={this.props.className}
          >
            <ModalHeader toggle={hideModal}>
              {" "}
              <i className="fa fa-repeat" />
              &nbsp;Assign Task
            </ModalHeader>
            <br />
            <ModalBody>
              <FormGroup>
                <Select
                  options={SelectMarkAs}
                  onChange={this.statusUpdate}
                  value={
                    status
                      ? {
                          label: status,
                          value: status
                        }
                      : null
                  }
                  placeholder={"Select status..."}
                />
                {errors.status ? (
                  <p className={"text-danger"}>{errors.status}</p>
                ) : null}
              </FormGroup>

              <FormGroup>
                <Input
                  type="textarea"
                  name="note"
                  id="note"
                  value={note}
                  className={"form-control floating-input"}
                  onChange={this.handleChange}
                  style={{ width: "100%" }}
                  placeholder={" "}
                />
                <Label className="floating-label form-label" for="note">
                  Comment
                </Label>
                {errors.note ? (
                  <p className={"text-danger"}>{errors.note}</p>
                ) : null}
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
      </>
    );
  }
}

export default StatusModal;

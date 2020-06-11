import React, { Component } from "react";
import {
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  UncontrolledTooltip,
  Label,
  Col,
  Row
} from "reactstrap";
import LoadingButton from "../../components/LoadingButton";
import { ValidateFile, toast } from "../../helpers";
import { requestUpdate } from "../../methods/Materials";

class UpdateMaterialModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      errors: {}
    };
  }
  /**
   *
   */
  onMaterialFileChange = e => {
    const file = e.target.files[0];
    const isValid = ValidateFile(file);
    if (isValid) {
      this.setState({
        file,
        errors: {
          ...this.state.errors,
          file: ""
        }
      });
      return;
    }
    this.setState({
      file: {},
      errors: {
        ...this.state.errors,
        file: "Please choose a valid document type file."
      }
    });
  };
  /**
   *
   */
  handleSubmit = async e => {
    e.preventDefault();
    const { file } = this.state;
    if (!file) {
      this.setState({
        errors: {
          ...this.state.errors,
          file: "Please select a file."
        }
      });
      return;
    }
    this.setState({
      isLoading: true
    });
    const { selectedMaterial, hideModal } = this.props;
    const { isSuccess, message } = await requestUpdate({
      ...selectedMaterial,
      file
    });
    if (isSuccess) {
      this.setState({
        isLoading: false,
        file: ""
      });
      hideModal();
      toast("Your request has been sent to Superadmin.", "success");
      return;
    }
    this.setState({
      isLoading: false
    });
    toast(message, "error");
  };
  /**
   *
   */
  render() {
    const { show, hideModal } = this.props;
    const { isLoading, errors } = this.state;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Modal
            isOpen={show}
            toggle={() => {
              this.setState({
                file: "",
                errors: {},
                isLoading: false
              });
              hideModal();
            }}
            className={this.props.className}
          >
            <ModalHeader toggle={hideModal}>
              {" "}
              <i className="fa fa-repeat" />
              &nbsp;Request to update
            </ModalHeader>
            <br />
            <ModalBody>
              <Row>
                <Col sm={"12"}>
                  <Label className="simple-label mb-2 form-label">
                    Updated file{" "}
                    <span id="UncontrolledTooltipExample">
                      <i className="icon-info"></i>
                    </span>
                    <UncontrolledTooltip
                      placement="top"
                      target="UncontrolledTooltipExample"
                    >
                      Please choose a valid document type file.
                    </UncontrolledTooltip>
                  </Label>
                  <div className="custom-file mb-2">
                    <input
                      type="file"
                      className="custom-file-input d-none"
                      id="customFile"
                      onChange={this.onMaterialFileChange}
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      {this.state.file && this.state.file.name
                        ? this.state.file.name
                        : "Choose file"}
                    </label>
                  </div>
                  {errors.file ? (
                    <p className={"text-danger"}>{errors.file}</p>
                  ) : null}
                </Col>
              </Row>
            </ModalBody>

            <ModalFooter>
              <Button
                type="button"
                color={"danger"}
                className={"btn-cancel btn-submit btn-link"}
                onClick={() => {
                  this.setState({
                    file: "",
                    errors: {},
                    isLoading: false
                  });
                  hideModal();
                }}
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
                  Request
                </Button>
              )}
            </ModalFooter>
          </Modal>
        </Form>
      </div>
    );
  }
}

export default UpdateMaterialModal;

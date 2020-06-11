import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  FormGroup,
  Input,
  Form,
} from "reactstrap";
import Select from "react-select";
import { SelectMarkAs } from "../../../helpers/SelectOption";
import { logger, toast } from "../../../helpers";
import { assignTaskToBrand } from "../../../methods";
import LoadingButton from "../../../components/LoadingButton";
import moment from "moment";
import { AppConfig } from "../../../config";

class AssignTaskView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      note: "",
      errors: {},
      isLoading: false,
    };
  }
  /**
   *
   */
  componentDidMount() {
    const { taskDetails } = this.props;
    const { markAs } = taskDetails;
    if (markAs) {
      this.setState({
        status: markAs,
      });
    }
  }
  /**
   *
   */
  handleSelect = async (selectedOption, name) => {
    logger(selectedOption);
    logger("selectedOption");
    this.setState({
      ...this.state,
      [name]: selectedOption.value,
      errors: {
        ...this.state.errors,
        [name]: "",
      },
    });
  };
  /**
   *
   */
  handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: null,
      },
    });
  };

  /**
   *
   */
  handleSubmit = async (event) => {
    event.preventDefault();
    const { taskDetails } = this.props;
    const { _id: id } = taskDetails;
    this.setState({
      errors: {},
      isLoading: true,
    });
    try {
      const { status, note } = this.state;
      const data = {
        markAs: status,
        markAsNote: note,
      };
      const { isSuccess, message, errors } = await assignTaskToBrand(data, id);
      if (!isSuccess) {
        if (errors) {
          this.setState({
            errors,
          });
        } else {
          toast(message, "error");
        }
        this.setState({ isLoading: false });
        return;
      }
      this.setState({
        isLoading: false,
      });
      toast(message, "success");
    } catch (error) {
      logger(error);
    }
  };

  render() {
    const { taskDetails } = this.props;
    const { assignTask, additionalNote, assignDate } = taskDetails;
    const { status, note, isLoading } = this.state;

    return (
      <>
        <Card className={"mt-0"}>
          <CardBody className={"mt-0"}>
            <Row style={{ marginTop: "1.5em" }}>
              <Col sm={"4"}>
                <div>
                  <b>
                    <i className={"fa fa-tasks"} />
                    &nbsp;&nbsp;Assign Task
                  </b>
                  <p>{assignTask}</p>
                </div>
                <div>
                  <b>
                    <i className={"fa fa-sticky-note"} />
                    &nbsp;&nbsp;Additional note about taks
                  </b>
                  <p>{additionalNote}</p>
                </div>
                <div>
                  <b>
                    <i className={"fa fa-calendar"} />
                    &nbsp;&nbsp;Date
                  </b>
                  <p>
                    {moment(assignDate).format(
                      AppConfig.DEFAULT_ONLY_DATE_FORMAT
                    )}
                  </p>
                </div>
              </Col>

              <Col sm={4}>
                <Form onSubmit={this.handleSubmit}>
                  <Label
                    className="floating-label form-label margin-n"
                    for="useremail"
                  >
                    Mark As
                  </Label>
                  <FormGroup>
                    <Select
                      options={SelectMarkAs}
                      onChange={(selectedOption) =>
                        this.handleSelect(selectedOption, "status")
                      }
                      value={
                        status
                          ? {
                              label: status,
                              value: status,
                            }
                          : null
                      }
                      placeholder={"Select status..."}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="text"
                      name="note"
                      id="note"
                      value={note}
                      className={"floating-input"}
                      onChange={this.handleChange}
                    />
                    <Label className="floating-label form-label" for="note">
                      Note
                    </Label>
                  </FormGroup>

                  <FormGroup className={"text-right"}>
                    {isLoading ? (
                      <LoadingButton />
                    ) : (
                      <Button
                        type="submit"
                        onClick={this.handleSubmit}
                        color={"primary"}
                        className={"btn-submit btn-sm btn-link"}
                      >
                        Update
                      </Button>
                    )}
                  </FormGroup>
                </Form>
              </Col>
              <Col sm={"4"}></Col>
            </Row>
          </CardBody>
        </Card>
        <hr />
      </>
    );
  }
}

export default AssignTaskView;

import React, { Component } from "react";
import {
  Row,
  Col,
  FormGroup,
  Card,
  CardHeader,
  CardBody,
  Form,
  Label,
  Input,
  InputGroup,
  Button
} from "reactstrap";
import { Form as FormBS } from "react-bootstrap";
import { AppRoutes } from "../../../config/AppRoutes";
import { getPrincipleDetails, addUpdatePrinciple } from "../../../methods";
import { toast, logger } from "../../../helpers";
import Loader from "../../../containers/Loader/Loader";
import { SelectRole } from "../../../helpers/SelectOption";
import Select from "react-select";
import { AcceptedDocFormat } from "../../../config";
import LoadingButton from "../../../components/LoadingButton";
const Roles = {};
for (let i in SelectRole) {
  Roles[SelectRole[i].value] = SelectRole[i].label;
}
class AddPrinciple extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditMode: false,
      id: "",
      question: "",
      answer: "",
      role: [],
      document: {},
      errors: {},
      isLoading: false,
      isFetchingDetails: true,
      type: "principle"
    };
  }
  /**
   *
   */
  componentDidMount() {
    const { params } = this.props.match;
    const { id } = params;
    logger(id);
    if (id) {
      this.setState(
        {
          id,
          isEditMode: true
        },
        () => {
          this.getDetails(id);
        }
      );
    } else {
      this.setState({
        isFetchingDetails: false
      });
    }
  }
  /**
   *
   */
  getDetails = async id => {
    const { isSuccess, data } = await getPrincipleDetails(id);
    if (!isSuccess) {
      this.props.history.push(AppRoutes.NOT_FOUND);
      return;
    }
    logger(data.data);
    const { question, answer, userRole, documents } = data.data;
    this.setState({
      ...data.data,
      question,
      answer,
      documents,
      role: userRole,
      isFetchingDetails: false
    });
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
  handleSelect = selectedOption => {
    this.setState({
      role: (selectedOption || []).map(opt => opt.value)
    });
  };
  /**
   *
   */
  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ isLoading: true, errors: {} });
    const { question, answer, role, document, id, type } = this.state;
    logger(document);
    const data = {
      question,
      answer,
      role,
      document,
      id,
      type
    };
    const { isSuccess, message, errors } = await addUpdatePrinciple(data, id);
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
    this.setState({ isLoading: false });
    toast(message, "success");
    this.props.history.push(AppRoutes.PRINCIPLE);
  };
  /**
   *
   */

  uploadDocument = e => {
    logger(e.target.files[0]);
    if (AcceptedDocFormat.indexOf(e.target.files[0].type) === -1) {
      this.setState({
        errors: {
          ...this.state.errors,
          document:
            "Uploaded file is not a valid documents. Only PDF, word or excel sheets are allowed"
        }
      });
      return;
    } else {
      this.setState({
        document: e.target.files[0]
      });
    }
  };
  render() {
    const {
      answer,
      role,
      errors,
      isFetchingDetails,
      isLoading,
      type
    } = this.state;
    const roles = (role || []).map(rol => ({
      label: Roles[rol],
      value: rol
    }));
    return (
      <div className="cr-page px-3 min-height650">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <CardHeader>
                <h4>
                  <i className="fa fa-edit" />
                  &nbsp;Principle Details
                </h4>
              </CardHeader>
              <CardBody>
                {isFetchingDetails ? (
                  <Loader />
                ) : (
                  <Form onSubmit={this.handleSubmit}>
                    <Row>
                      <Col sm={"12"}>
                        <Label
                          className="floating-label form-label margin-n"
                          for="role"
                        >
                          Type{" "}
                        </Label>
                        <FormGroup>
                          <FormBS.Check
                            type={"radio"}
                            id={`lable-checkbox-principle`}
                            label={"Principle"}
                            name={"type"}
                            value={"principle"}
                            checked={type === "principle"}
                            inline
                            className="ml-3"
                            onChange={() => {
                              this.setState({
                                type: "principle"
                              });
                            }}
                          />
                          <FormBS.Check
                            type={"radio"}
                            id={`lable-checkbox-marketmaterial`}
                            label={"Marketing Material"}
                            name={"type"}
                            value={"marketmaterial"}
                            checked={type === "marketmaterial"}
                            inline
                            className="ml-3"
                            onChange={() => {
                              this.setState({
                                type: "marketmaterial"
                              });
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <br />
                      <br />
                      <br />
                      <Col sm={"6"}>
                        <Label
                          className="floating-label form-label margin-n"
                          for="role"
                        >
                          Principle For{" "}
                        </Label>
                        <FormGroup>
                          <Select
                            options={SelectRole}
                            onChange={this.handleSelect}
                            value={roles}
                            placeholder={"Select Role..."}
                            isMulti
                          />
                        </FormGroup>
                      </Col>

                      <Col sm={"6"}>
                        <FormGroup>
                          <Label className="simple-label mb-2">Document</Label>
                          <InputGroup>
                            <div className="custom-file mb-2">
                              <input
                                type="file"
                                accept={".doc,.pdf,.docx,.txt,.xlsx"}
                                className="custom-file-input d-none"
                                id="customFile"
                                onChange={this.uploadDocument}
                              />
                              <label
                                className="custom-file-label"
                                htmlFor="customFile"
                              >
                                {this.state.document && this.state.document.name
                                  ? this.state.document.name
                                  : "Choose file"}
                              </label>
                            </div>
                          </InputGroup>
                        </FormGroup>
                      </Col>

                      <Col sm={"6"}>
                        <FormGroup>
                          <Input
                            type="textarea"
                            name="answer"
                            id="answer"
                            value={answer}
                            onChange={this.handleChange}
                            className={"floating-input"}
                            placeholder={" "}
                          />
                          <Label
                            className="floating-label form-label"
                            for="answer"
                          >
                            What it means to be HugeHeart
                          </Label>
                          {errors.answer ? (
                            <p className={"text-danger"}>{errors.answer}</p>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <FormGroup>
                      <Col sm={{ size: 4, offset: 8 }} className={"text-right"}>
                        {isLoading ? (
                          <LoadingButton />
                        ) : (
                          <Button
                            type="submit"
                            onClick={this.handleSubmit}
                            color={"primary"}
                            className={"btn-submit btn-link"}
                          >
                            Save
                          </Button>
                        )}
                      </Col>
                    </FormGroup>
                  </Form>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddPrinciple;

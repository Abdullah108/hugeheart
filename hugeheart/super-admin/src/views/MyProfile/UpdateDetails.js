import React, { Component } from "react";
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardHeader,
  CardBody
} from "reactstrap";
import LoadingButton from "../../components/LoadingButton";
import { toast, logger } from "../../helpers";
import { updateProfile, getProfile } from "../../methods";

class UpdateDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      errors: {}
    };
  }
  componentDidMount() {
    this.getAdminProfile();
  }
  /**
   *
   */
  getAdminProfile = async () => {
    try {
      const { email, firstName, lastName } = await getProfile();
      this.setState({
        email: email || "",
        firstName: firstName || "",
        lastName: lastName || ""
      });
    } catch (error) {
      logger(error);
    }
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
    this.setState({
      errors: {},
      isLoading: true
    });
    try {
      const { email, firstName, lastName } = this.state;
      const data = {
        email,
        firstName,
        lastName
      };
      const { isSuccess, message, errors } = await updateProfile(data);
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
    } catch (error) {
      logger(error);
    }
  };
  render() {
    const { email, firstName, lastName, errors, isLoading } = this.state;
    return (
      <Card>
        <CardHeader>
          <h4>
            <i className="fa fa-edit" />
            &nbsp;My Profile
          </h4>
        </CardHeader>
        <CardBody>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Input
                type="text"
                name="firstName"
                id="firstName"
                value={firstName}
                className={"floating-input"}
                onChange={this.handleChange}
              />
              <Label className="floating-label form-label" for="firstName">
                First Name
              </Label>
              {errors.firstName ? (
                <p className={"text-danger"}>{errors.firstName}</p>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                name="lastName"
                id="lastName"
                value={lastName}
                className={"floating-input"}
                onChange={this.handleChange}
              />
              <Label className="floating-label form-label" for="lastName">
                Last Name
              </Label>
              {errors.lastName ? (
                <p className={"text-danger"}>{errors.lastName}</p>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Input
                type="email"
                name="email"
                id="useremail"
                value={email}
                className={"floating-input"}
                onChange={this.handleChange}
              />
              <Label className="floating-label form-label" for="useremail">
                Email
              </Label>
              {errors.email ? (
                <p className={"text-danger"}>{errors.email}</p>
              ) : null}
            </FormGroup>
            <FormGroup row>
              <Col sm={{ size: 10, offset: 2 }}>
                {isLoading ? (
                  <LoadingButton
                    className={"pull-right btn-submit btn-submit btn-link"}
                  />
                ) : (
                  <Button
                    type="submit"
                    onClick={this.handleSubmit}
                    color={"primary"}
                    className={"pull-right btn-submit btn-submit btn-link"}
                  >
                    Update Profile
                  </Button>
                )}
              </Col>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

export default UpdateDetails;

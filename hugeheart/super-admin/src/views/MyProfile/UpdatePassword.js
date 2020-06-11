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
import { updatePassword } from "../../methods";

class UpdatePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: "",
      password: "",
      confirmPassword: "",
      isLoading: false,
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

  handleChangePasswordSubmit = async event => {
    event.preventDefault();
    this.setState({
      errors: {},
      isLoading: true
    });
    try {
      const { oldPassword, password, confirmPassword } = this.state;
      const data = {
        oldPassword,
        password,
        confirmPassword
      };
      const { isSuccess, message, errors } = await updatePassword(data);
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
        isLoading: false,
        oldPassword: "",
        password: "",
        confirmPassword: ""
      });
      toast(message, "success");
    } catch (error) {
      logger(error);
    }
  };
  /**
   *
   */
  render() {
    const {
      errors,
      isLoading,
      password,
      confirmPassword,
      oldPassword
    } = this.state;
    return (
      <Card>
        <CardHeader>
          <h4>
            <i className="fa fa-lock" /> Change Password
          </h4>
        </CardHeader>
        <CardBody>
          <Form onSubmit={this.handleChangePasswordSubmit}>
            <FormGroup>
              <Input
                type="password"
                name="oldPassword"
                id="oldpassword"
                value={oldPassword}
                onChange={this.handleChange}
                className={"floating-input"}
              />
              <Label className="floating-label form-label" for="oldpassword">
                Old Password
              </Label>
              {errors.oldPassword ? (
                <p className={"text-danger"}>{errors.oldPassword}</p>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                name="password"
                id="newpassword"
                onChange={this.handleChange}
                value={password}
                className={"floating-input"}
              />
              <Label className="floating-label form-label" for="newpassword">
                New Password
              </Label>
              {errors.password ? (
                <p className={"text-danger"}>{errors.password}</p>
              ) : null}
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                name="confirmPassword"
                id="confirmpassword"
                className={"floating-input"}
                onChange={this.handleChange}
                value={confirmPassword}
              />
              <Label
                className="floating-label form-label"
                for="confirmpassword"
              >
                Confirm Password
              </Label>
              {errors.confirmPassword ? (
                <p className={"text-danger"}>{errors.confirmPassword}</p>
              ) : null}
            </FormGroup>

            <FormGroup row>
              <Col sm={{ size: 10, offset: 2 }}>
                {isLoading ? (
                  <LoadingButton className={"pull-right"} />
                ) : (
                  <Button
                    type="submit"
                    onClick={this.handleChangePasswordSubmit}
                    color={"primary"}
                    className={"pull-right btn-submit btn-submit btn-link"}
                  >
                    Update Password
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

export default UpdatePassword;

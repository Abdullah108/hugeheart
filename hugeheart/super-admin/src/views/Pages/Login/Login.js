import React, { Component } from "react";

import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";
import { AppRoutes, TokenKey } from "../../../config";
import { login } from "../../../methods";
import LoadingButton from "../../../components/LoadingButton";
import { toast } from "../../../helpers";
import { Translation } from "../../../translation";
import Logo from "../../../assets/img/brand/logo.png";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {},
      isLoading: false
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
  componentDidMount() {
    if (localStorage.getItem(TokenKey)) {
      this.props.history.push(AppRoutes.HOME);
    }
  }
  /**
   *
   */
  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true, errors: {} });
    const { email, password } = this.state;
    const { isSuccess, message, errors } = await login({
      email,
      password
    });
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
    this.props.history.push(AppRoutes.HOME);
  };
  /**
   *
   */
  render() {
    const { email, password, errors, isLoading } = this.state;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="5">
              <CardGroup>
                <Card className="p-4">
                  <div className="login-brand-logo">
                    <img
                      src={Logo}
                      alt={"HugeHeart Logo"}
                      style={{ width: 250 }}
                    />
                  </div>
                  <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                      {/* <h1>{Translation.LOGIN_TEXT}</h1> */}
                      <p className="text-muted" style={{ textAlign: "center" }}>
                        {Translation.SIGNIN_TO_ACCOUNT}
                      </p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type={"text"}
                          name={"email"}
                          placeholder={Translation.LOGIN_EMAIL_PLACEHOLDER}
                          onChange={this.handleChange}
                          value={email}
                        />
                      </InputGroup>
                      {errors.email ? (
                        <p className={"text-danger"}>{errors.email}</p>
                      ) : null}
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type={"password"}
                          name={"password"}
                          placeholder={Translation.LOGIN_PASSWORD_PLACEHOLDER}
                          onChange={this.handleChange}
                          value={password}
                        />
                      </InputGroup>
                      {errors.password ? (
                        <p className={"text-danger"}>{errors.password}</p>
                      ) : null}
                      <Row>
                        <Col sm="12">
                          {isLoading ? (
                            <LoadingButton className={"pull-right"} />
                          ) : (
                            <Button
                              type={"submit"}
                              color={"primary"}
                              className={
                                "pull-right btn-submit btn-sm btn-link"
                              }
                            >
                              {Translation.LOGIN_TEXT}
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;

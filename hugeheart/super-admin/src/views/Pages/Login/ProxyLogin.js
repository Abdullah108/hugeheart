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
      isLoading: false
    };
  }
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
  /**
   *
   */
  render() {
    return (
      <div>
        abc
      </div>
    );
  }
}

export default Login;

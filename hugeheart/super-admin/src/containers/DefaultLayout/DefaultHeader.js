import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Button
} from "reactstrap";

import { AppRoutes } from "../../config";
import UserIcon from "./../../assets/avatars/user-default.svg";
import { AppHeaderDropdown, AppSidebarToggler } from "@coreui/react";
import { Translation } from "../../translation";
import Logo from "./../../assets/img/brand/logo.png";
import PriceCalculator from "../../views/PriceCalculator";

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
  state = {
    openPriceCalculator: false
  };
  render() {
    // eslint-disable-next-line

    let { userDetails } = this.props;
    if (!userDetails) {
      userDetails = {};
    }
    const { openPriceCalculator } = this.state;
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <div className="brand-logo">
          <img src={Logo} alt={"HugeHeart Logo"} style={{ width: 180 }} />
        </div>
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Nav className="ml-auto" navbar>
          <Button
            className={"btn-submit"}
            onClick={() =>
              this.setState({
                openPriceCalculator: true
              })
            }
          >
            Price Guide
          </Button>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <img
                src={UserIcon}
                className="img-avatar"
                alt={userDetails.fullName}
              />
            </DropdownToggle>
            <DropdownMenu right style={{ right: "auto" }}>
              <DropdownItem header tag="div" className="text-left">
                <strong>
                  {userDetails.fullName ||
                    `${userDetails.firstName} ${userDetails.lastName}`}
                </strong>
                <br />
                <strong>{userDetails.email}</strong>
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  this.props.history.push(AppRoutes.MY_PROFILE);
                }}
              >
                <i className="fa fa-user" /> {Translation.PROFILE}
              </DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}>
                <i className="fa fa-lock" /> {Translation.LOGOUT_TEXT}
              </DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        <PriceCalculator
          isOpen={openPriceCalculator}
          hideModal={() =>
            this.setState({
              openPriceCalculator: false
            })
          }
          priceData={this.props.priceData}
        />
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;

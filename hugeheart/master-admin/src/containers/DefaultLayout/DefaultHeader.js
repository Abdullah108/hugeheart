import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Button,
} from "reactstrap";

import { AppRoutes } from "../../config";
import UserIcon from "./../../assets/avatars/user-default.svg";
import { AppHeaderDropdown, AppSidebarToggler } from "@coreui/react";
import { Translation } from "../../translation";
import Logo from "./../../assets/img/brand/logo.png";
import moment from "moment";
import { SecondsToHHMMSS, logger, ConfirmBox } from "../../helpers";
import PriceCalculator from "../../views/PriceCalculator";
const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  timer;
  constructor(props) {
    super(props);
    this.state = {
      update: false,
      openPriceCalculator: false,
    };
  }
  /**
   *
   */
  componentDidMount() {
    this.timer = setInterval(async () => {
      this.setState({
        update: !this.state.update,
      });
      let { userDetails } = this.props;
      if (!userDetails) {
        userDetails = {};
      }
      const currentTime = moment(userDetails.lastLogin);
      const loggedInfrom = moment().diff(currentTime, "seconds");
      if (loggedInfrom > 0 && loggedInfrom % (60 * 60) === 0) {
        const { value } = await ConfirmBox({
          title: "",
          type: "info",
          text:
            "Hi, You have logged in for long time. Are you sure you want to continue? Further access request will be sent to superadmin.",
          allowOutsideClick: false,
          confirmButtonText: "Logout",
          cancelButtonText: "Yes!",
        });
        logger("Show Confirmation Window", loggedInfrom, value);
        if (value) {
          this.props.onLogout({
            preventDefault: () => ({}),
          });
        }
      }
    }, 1000);
  }
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  /**
   *
   */

  render() {
    // eslint-disable-next-line
    let { userDetails } = this.props;
    if (!userDetails) {
      userDetails = {};
    }
    const currentTime = moment(userDetails.lastLogin);
    const loggedInfrom = moment().diff(currentTime, "seconds");
    const { openPriceCalculator } = this.state;
    const { userRole } = userDetails;
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <div className="brand-logo">
          <img src={Logo} alt={"HugeHeart Logo"} style={{ width: 180 }} />
        </div>
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <div className={"popup-message"}>
          We believe there are no unteachable students in the world.
        </div>
        <Nav className="ml-auto" navbar>
          <div>
            <i className={"fa fa-eye"}></i>
            &nbsp;&nbsp;
            <b>{SecondsToHHMMSS(loggedInfrom)}</b>
          </div>
          {userRole === "masteradmin" ? (
            <Button
              className={"btn-submit"}
              onClick={() =>
                this.setState({
                  openPriceCalculator: true,
                })
              }
            >
              $ Price Guide
            </Button>
          ) : null}

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
                    `${userDetails.firstName} ${userDetails.lastName}`}{" "}
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
              <DropdownItem onClick={(e) => this.props.onLogout(e)}>
                <i className="fa fa-lock" /> {Translation.LOGOUT_TEXT}
              </DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        <PriceCalculator
          isOpen={openPriceCalculator}
          hideModal={() =>
            this.setState({
              openPriceCalculator: false,
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

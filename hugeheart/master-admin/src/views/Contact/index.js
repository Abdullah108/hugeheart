import React, { Component } from "react";
import CardContainer from "../../containers/CardContainer";
import "./contact.scss";
import ContactList from "./ContactList";
import { Nav, NavItem, NavLink } from "reactstrap";
import classNames from "classnames";

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: 1, userDetails: {} };
  }
  componentDidUpdate({ userDetails: oldUserDetails }) {
    const { userDetails } = this.props;
    if (!oldUserDetails._id && userDetails._id) {
      const { userRole } = userDetails;
      this.setState({
        userDetails,
        activeTab: userRole === "teacher" ? 4 : 1
      });
    }
  }
  /**
   *
   */
  toggle = tab => {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };
  /**
   *
   */
  renderTabs = () => {
    const { userDetails, activeTab } = this.state;
    const { userRole } = userDetails;
    switch (userRole) {
      case "student":
        return (
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classNames({ active: activeTab === 4 })}
                onClick={() => {
                  this.toggle(4);
                }}
              >
                <i className={"fa fa-users"}></i> Super Admin
              </NavLink>
            </NavItem>
          </Nav>
        );
      case "teacher":
        return (
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classNames({ active: activeTab === 4 })}
                onClick={() => {
                  this.toggle(4);
                }}
              >
                <i className={"fa fa-users"}></i> Super Admin
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classNames({ active: activeTab === 2 })}
                onClick={() => {
                  this.toggle(2);
                }}
              >
                <i className={"fa fa-users"}></i> Master Admin
              </NavLink>
            </NavItem>
          </Nav>
        );
      case "masteradmin":
        return (
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classNames({ active: activeTab === 4 })}
                onClick={() => {
                  this.toggle(4);
                }}
              >
                <i className={"fa fa-users"}></i> Super Admin
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classNames({ active: activeTab === 1 })}
                onClick={() => {
                  this.toggle(1);
                }}
              >
                <i className={"fa fa-graduation-cap"}></i> Teachers
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classNames({ active: activeTab === 3 })}
                onClick={() => {
                  this.toggle(3);
                }}
              >
                <i className={"fa fa-users"}></i> Brand Amabassador
              </NavLink>
            </NavItem>
          </Nav>
        );
      case "brandamb":
        return (
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classNames({ active: activeTab === 4 })}
                onClick={() => {
                  this.toggle(4);
                }}
              >
                <i className={"fa fa-users"}></i> Super Admin
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classNames({ active: activeTab === 1 })}
                onClick={() => {
                  this.toggle(1);
                }}
              >
                <i className={"fa fa-graduation-cap"}></i> Teachers
              </NavLink>
            </NavItem>
          </Nav>
        );
      default:
        return null;
    }
  };
  /**
   *
   */
  render() {
    const { activeTab } = this.state;

    return (
      <CardContainer title={"Contact"} icon={"fa fa-phone"}>
        {this.renderTabs()}
        <br />
        <div className={"contact-container"}>
          <div className="messaging">
            <div className="inbox_msg">
              {activeTab === 4 ? (
                <>
                  <ContactList type={"superadmin"} />
                </>
              ) : null}
              {activeTab === 1 ? (
                <>
                  <ContactList type={"teacher"} />
                </>
              ) : null}
              {activeTab === 2 ? (
                <>
                  <ContactList type={"master"} />
                </>
              ) : null}
              {activeTab === 3 ? (
                <>
                  <ContactList type={"brand"} />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </CardContainer>
    );
  }
}

export default Contact;

import React, { Component } from "react";
import CardContainer from "../../containers/CardContainer";
import "./contact.scss";
import ContactList from "./ContactList";
import { Nav, NavItem, NavLink } from "reactstrap";
import classNames from "classnames";
import { logger } from "../../helpers";
class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: 1 };
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
  render() {
    const { activeTab } = this.state;
    logger(activeTab);
    return (
      <CardContainer title={"Contact"} icon={"fa fa-phone"}>
        <Nav tabs>
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
              className={classNames({ active: activeTab === 2 })}
              onClick={() => {
                this.toggle(2);
              }}
            >
              <i className={"fa fa-users"}></i> Master Admin
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
        <br />
        <div className={"contact-container"}>
          <div className="messaging">
            <div className="inbox_msg">
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

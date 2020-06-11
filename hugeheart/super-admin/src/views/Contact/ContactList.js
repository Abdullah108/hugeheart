import React, { Component } from "react";
import { getAllTeachers, getUsers, getBrands } from "../../methods";
import { logger } from "../../helpers";
import MessageDetails from "./MessageDetails";
import Loader from "../../containers/Loader/Loader";
import { AppConfig } from "../../config";
import UserImage from "./../../assets/avatars/user-default.svg";
import { debounce } from "lodash";
class ContactList extends Component {
  searchDebounce;
  isStateMounted;
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      users: [],
      skip: 0,
      limit: 500,
      search: "",
      selectedContact: {}
    };
  }
  componentDidMount() {
    this.getContacts();
    this.isStateMounted = true;
  }
  componentWillUnmount() {
    this.isStateMounted = false;
  }
  getContacts = async () => {
    const { type } = this.props;
    let data = [];
    const { skip, limit, search } = this.state;
    this.setState({
      isLoading: true
    });
    logger(type);
    switch (type) {
      case "teacher":
        const { data: resp } = await getAllTeachers({ skip, limit, search });
        data = resp ? resp.data : [];
        break;
      case "master":
        const { data: masterresp } = await getUsers({
          skip,
          limit,
          search
        });
        data = masterresp ? masterresp.data : [];
        break;
      case "brand":
        const { data: brandresp } = await getBrands({
          skip,
          limit,
          search
        });
        data = brandresp ? brandresp.data : [];
        break;
      default:
        break;
    }
    logger(data);
    if (this.isStateMounted) {
      this.setState({
        isLoading: false,
        users: data
      });
    }
  };
  /**
   *
   */
  searchContacts = e => {
    const { value } = e.target;
    this.setState(
      {
        search: value,
        skip: 0,
        selectedContact: {}
      },
      () => {
        if (this.searchDebounce) {
          this.searchDebounce.cancel();
        }
        this.searchDebounce = debounce(this.getContacts, 500);
        this.searchDebounce();
      }
    );
  };
  /**
   *
   */
  render() {
    const { isLoading, users, selectedContact, search } = this.state;
    return (
      <>
        <div className="inbox_people">
          <div className="headind_srch">
            <div className="recent_heading">
              <h4>Chats</h4>
            </div>
            <div className="srch_bar">
              <div className="stylish-input-group">
                <input
                  type="text"
                  className="search-bar"
                  placeholder="Search"
                  onChange={this.searchContacts}
                  value={search}
                />
                <span className="input-group-addon">
                  <button type="button">
                    {" "}
                    <i className="fa fa-search" aria-hidden="true"></i>{" "}
                  </button>
                </span>{" "}
              </div>
            </div>
          </div>
          <div className="inbox_chat">
            {isLoading ? (
              <Loader />
            ) : (
              users.map((user, index) => {
                return (
                  <div
                    className={`chat_list ${
                      selectedContact._id === user._id ? "active_chat" : ""
                    }`}
                    key={index}
                  >
                    <div
                      className="chat_people"
                      onClick={() => {
                        this.setState({
                          selectedContact: user
                        });
                      }}
                    >
                      <div className="chat_img">
                        {" "}
                        <img
                          src={`${AppConfig.SERVER_FILES_ENDPOINT}${user.profileImageURL}`}
                          onError={e => (e.target.src = UserImage)}
                          alt={"User profile"}
                        />{" "}
                      </div>
                      <div className="chat_ib">
                        <h5>{user.fullName} </h5>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <MessageDetails selectedContact={selectedContact} />
      </>
    );
  }
}

export default ContactList;

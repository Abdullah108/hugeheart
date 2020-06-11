import React, { Component } from "react";
import Loader from "../../containers/Loader/Loader";
import { sendMessage, getAllMessages, sendFile } from "../../methods";
import { logger, isValidMessage, toast } from "../../helpers";
import moment from "moment";
import { AppConfig } from "./../../config/AppConfig";

/**
 *
 */
class MessageDetails extends Component {
  getMessageInterval;
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      message: "",
      messages: [],
      sendingMessage: false
    };
  }
  componentDidUpdate({ selectedContact: prevSelectedContact }) {
    const { _id: prevId } = prevSelectedContact;
    const { selectedContact } = this.props;
    const { _id } = selectedContact;
    if (_id && prevId !== _id) {
      if (this.getMessageInterval) {
        clearInterval(this.getMessageInterval);
      }
      this.setState({
        messages: []
      });
      this.getMessages();
      this.getMessageInterval = setInterval(() => {
        this.getMessages(false);
      }, 2000);

      setTimeout(() => {
        this.chatScrollToBottom();
      }, 1000);
    }
  }
  /**
   *
   */
  getMessages = async (dontShowLoader = true) => {
    this.setState({
      isLoading: dontShowLoader
    });
    const { selectedContact } = this.props;
    const { _id } = selectedContact;
    const { data } = await getAllMessages({
      recieverId: _id
    });
    // logger(data);
    this.setState({
      isLoading: false,
      messages: data && data.data && data.data.map ? data.data : []
    });
  };
  /**
   *
   */
  componentWillUnmount() {
    if (this.getMessageInterval) {
      clearInterval(this.getMessageInterval);
    }
  }

  /**
   * @description File upload for chat
  */
  onFileUpload = async e => {
    const file = e.target.files[0];
    if (!file) {
      return false;
    }


    e.target.value = null;
    const { selectedContact } = this.props;
    const { _id } = selectedContact;

    this.setState({
      sendingMessage: true
    });

    const data = await sendFile({
      recieverId: [_id],
      file
    });
    this.setState({
      sendingMessage: false
    });
    setTimeout(() => {
      this.chatScrollToBottom();
    }, 1200);

  }

  /**
   *
   */
  sendMessage = async e => {
    e.preventDefault();
    const { selectedContact } = this.props;
    const { _id } = selectedContact;
    const { message, sendingMessage } = this.state;
    logger(isValidMessage(message));
    if (!message || sendingMessage) {
      return;
    }
    if (!isValidMessage(message)) {
      toast(
        "Message cann't send. This message may contain some sensitive information.",
        "info"
      );
      return;
    }
    this.setState({
      sendingMessage: true
    });
    const data = await sendMessage({
      recieverId: [_id],
      message
    });
    logger(data);
    this.setState({
      message: "",
      sendingMessage: false
    });

    setTimeout(() => {
      this.chatScrollToBottom();
    }, 1200);

  };


  /**
   * 
  */
  chatScrollToBottom() {
    const objDiv = document.getElementById("msg_history");
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  /**
   *
   */
  onMesageChange = e => {
    this.setState({
      message: e.target.value
    });
  };
  /**
   *
   */
  render() {
    const { selectedContact } = this.props;
    const { _id } = selectedContact;
    const { isLoading, message, messages, sendingMessage } = this.state;
    return (
      <div className="mesgs">
        <div className="msg_history" id="msg_history">
          {_id ? (
            isLoading ? (
              <Loader />
            ) : messages.length ? (
              messages.map((msg, index) => {
                return (
                  <React.Fragment key={index}>
                    {msg.senderId === _id ? (
                      <div className="incoming_msg">
                        <div className="incoming_msg_img">
                          <img
                            src={
                              "https://ptetutorials.com/images/user-profile.png"
                            }
                            alt="User"
                          />{" "}
                        </div>
                        <div className="received_msg">
                          <div className="received_withd_msg">
                          {
                            msg.attachement ? (
                            // <span>
                            //   <p>
                            //   {msg.attachement.replace(/^.*[\\/]/, "")}
                            //   <a href={`${AppConfig.SERVER_FILES_ENDPOINT}${msg.attachement}`} target="_blank" > <i className="fa fa-download message_download" aria-hidden="true"></i> </a>
                            //   </p>
                            // </span>

                            <span>
                              <a href={`${AppConfig.SERVER_FILES_ENDPOINT}${msg.attachement}`} target="_blank" className="file_msg" >
                                <div>
                                  {msg.attachement.replace(/^.*[\\/]/, "")}
                                  <span><i class="fa fa-file-o" aria-hidden="true"></i> File</span>
                                </div>
                              </a>

                              <a href={`${AppConfig.SERVER_FILES_ENDPOINT}${msg.attachement}`} target="_blank" className="file_msg" >
                                <span className="open"> Open </span>
                              </a>
                            </span>
                    
                            ) : <p>{msg.message}</p>
                          }
                            <span className="time_date">
                              {moment(msg.createdAt).format("hh:mm a | MMM DD, YY")}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="outgoing_msg">
                        <div className="sent_msg">
                          
                          {
                            msg.attachement ? (
                            // <span>
                            //   <p>
                            //   {msg.attachement.replace(/^.*[\\/]/, "")}
                            //   <a href={`${AppConfig.SERVER_FILES_ENDPOINT}${msg.attachement}`} target="_blank" > <i className="fa fa-download message_download" aria-hidden="true"></i> </a>
                            //   </p>
                            // </span>
                            <span>
                              <a href={`${AppConfig.SERVER_FILES_ENDPOINT}${msg.attachement}`} target="_blank" className="file_msg" >
                                <div>
                                  {msg.attachement.replace(/^.*[\\/]/, "")}
                                  <span><i class="fa fa-file-o" aria-hidden="true"></i> File</span>
                                </div>
                              </a>

                              <a href={`${AppConfig.SERVER_FILES_ENDPOINT}${msg.attachement}`} target="_blank" className="file_msg" >
                                <span className="open"> Open </span>
                              </a>
                            </span>
                    
                            ) : <p>{msg.message}</p>
                          }
                          <span className="time_date">
                            {moment(msg.createdAt).format("hh:mm a | MMM DD, YY")}
                          </span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <h4 className={"text-center"}>
                No Message. Send a message to start conversation.
              </h4>
            )
          ) : (
            <h4 className={"text-center"}>
              Choose any chat to show the chat history.
            </h4>
          )}
        </div>
        {_id && !isLoading ? (
          <div className="type_msg">
            <div className="input_msg_write">
              <form onSubmit={this.sendMessage}>
                <input
                  type="text"
                  className="write_msg"
                  placeholder="Type a message"
                  name={"message"}
                  onChange={this.onMesageChange}
                  autoComplete={"off"}
                  value={message}
                />
                {sendingMessage ? (
                  <button disabled className="msg_send_btn" type="button">
                    ...
                  </button>
                ) : (
                  <span>
                    <input
                          type="file"
                          className="custom-file-input d-none"
                          id="customFile"
                          onChange={this.onFileUpload}
                        />
                        <label
                          htmlFor="customFile"
                          className="msg_send_btn msg_upload_btn fa fa-upload"
                          title="send file"
                        >
                        </label>

                    <button
                      disabled={!message}
                      className="msg_send_btn"
                      type="submit"
                    >


                      <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                    </button>

                  </span>
                )}
              </form>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

/**
 *
 */
export default MessageDetails;

import React, { Component } from "react";
import { toast, ConfirmBox } from "../../helpers";
import { Row, Col } from "react-bootstrap";
import { deletePrinciple } from "../../methods";
import PrincipleItem from "./PrincipleItem";
import Loader from "../../containers/Loader/Loader";
import NoData from "../../components/NoData";
class PrincipleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: []
    };
  }
  /**
   *
   */
  handleCheckboxChange = e => {
    const { target } = e;
    const { checked, value } = target;
    const { ids } = this.state;
    if (checked) {
      ids.push(value);
    } else {
      var index = ids.indexOf(value);
      if (index !== -1) {
        ids.splice(index, 1);
      }
    }
    this.setState({
      ids
    });
  };
  /**
   *
   */
  handleCheckAllCheckBox = e => {
    const { target } = e;
    const { checked } = target;
    const { principles } = this.props;
    if (!checked) {
      this.setState({
        ids: []
      });
    } else {
      const ids = [];
      for (let i = 0; i < principles.length; i++) {
        const element = principles[i];
        ids.push(element._id);
      }
      this.setState({
        ids: ids
      });
    }
  };
  /**
   *
   */
  handleActionChange = e => {
    const { ids } = this.state;
    if (!ids.length) {
      toast("Please select at least one master admin.", "info");
      return;
    }
    const value = e.target.value;
    if (value.toLowerCase() === "delete") {
      this.delete();
    }
  };

  /**
   *
   */
  delete = async id => {
    const { value } = await ConfirmBox({
      title: "Are you sure?",
      text: "Do you want to delete this principle!"
    });
    if (!value) {
      return;
    }
    const { isSuccess, message } = await deletePrinciple(id);
    if (!isSuccess) {
      toast(message, "error");
      return;
    }
    toast(message, "success");
    this.setState({
      ids: []
    });
    this.props.refreshList();
  };
  /**
   *
   */
  render() {
    const { principles, isLoading } = this.props;
    return (
      <>
        {isLoading ? (
          <Loader />
        ) : (
          <Row>
            {principles.length ? (
              principles.map((f, index) => (
                <Col sm={"6"} key={index}>
                  <PrincipleItem faq={f} />
                </Col>
              ))
            ) : (
              <Col sm={"12"}>
                <NoData message={"No principle found."} />
              </Col>
            )}
          </Row>
        )}
      </>
    );
  }
}

export default PrincipleList;

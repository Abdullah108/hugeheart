import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  UncontrolledTooltip,
  Button
} from "reactstrap";
import { AppRoutes } from "../../../config";
import { logger, toast } from "../../../helpers";
import Loader from "../../../containers/Loader/Loader";
import { getBrandDetails } from "../../../methods/BrandAmbassador";
import {
  getAssignDetails,
  assignTaskToBrand
} from "../../../methods/AssignTaskToBrand";
import BrandDetailsView from "./BrandDetails";
import AssignTaskView from "./AssignTaskDetails";
import AssignTaskToBrand from "../AssignTaskToBrand";
class BarndDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userDetails: {},
      taskDetails: [],
      selectedOption: "",
      showTask: false,
      showTrainingModal: false,
      selectedBrand: "",
      selectedFullName: ""
    };
  }
  /**
   *
   */
  componentDidMount() {
    const { params } = this.props.match;
    const { id } = params;
    console.log("id, id", id);
    if (id) {
      this.getDetails(id);
      this.getTaskDetails(id);
    } else {
      this.props.history.push(AppRoutes.NOT_FOUND);
    }
  }
  /**
   *
   */
  getDetails = async id => {
    const { isSuccess, data } = await getBrandDetails(id);
    if (!isSuccess) {
      this.props.history.push(AppRoutes.NOT_FOUND);
      return;
    }
    logger("data.data", data.data);
    this.setState({
      isLoading: false,
      userDetails: data.data
    });
  };

  /**
   *
   */
  getTaskDetails = async id => {
    const { isSuccess, data } = await getAssignDetails(id);
    if (!isSuccess) {
      this.props.history.push(AppRoutes.NOT_FOUND);
      return;
    }
    console.log("====================================");
    console.log("data.data", data.data);
    console.log("====================================");
    this.setState({
      isLoading: false,
      taskDetails: data.data
    });
  };
  /**
   *
   */

  hideModal = () => {
    this.setState({
      showTask: false,
      selectedBrand: []
    });
  };
  /**
   * 
   */
  handleSelect = async (selectedOption, name, id) => {
    logger(selectedOption);
    logger("selectedOption");
    this.setState({
      ...this.state,
      [name]: selectedOption.value,
      errors: {
        ...this.state.errors,
        [name]: ""
      }
    });
  };

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
  handleSubmit = async (event, id) => {
    event.preventDefault();
    this.setState({
      errors: {},
      isLoading: true
    });
    try {
      const { markAs, markAsNote } = this.state;
      const data = {
        markAs,
        markAsNote
      };
      const { isSuccess, message, errors } = await assignTaskToBrand(data, id);
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
        isLoading: false
      });
      toast(message, "success");
      this.props.history.push(AppRoutes.VIEW_BRAND_AMBASSADOR);
    } catch (error) {
      logger(error);
    }
  };

  render() {
    const { isLoading, userDetails, taskDetails, showTask, selectedBrand } = this.state;
    logger("userDetails", userDetails);
    return (
      <Row>
        <Col xs={"12"} lg={"12"}>
          <Card>
            <CardHeader>
              <h4>
                <i className="fa fa-eye" />{" "}
                {isLoading ? "Please wait.." : `${userDetails.fullName}`}
              </h4>
              {!isLoading ? (
                <>
                  <Button
                    className={"pull-right theme-btn add-btn btn-link"}
                    id={"add-new-pm-tooltip"}
                    onClick={() => {
                      this.props.history.push(
                        AppRoutes.UPDATE_BRAND_AMBASSADOR.replace(
                          ":id",
                          userDetails._id
                        )
                      );
                    }}
                  >
                    <i className={"fa fa-pencil"} />
                    &nbsp; Edit details
                  </Button>
                  <UncontrolledTooltip target={"add-new-pm-tooltip"}>
                    Edit details of {userDetails.fullName}
                  </UncontrolledTooltip>
                </>
              ) : null}
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Loader />
              ) : (
                  <>
                    <BrandDetailsView
                      userDetails={userDetails || {}}
                      goToList={() =>
                        this.props.history.push(AppRoutes.GET_BRAND_AMBASSADOR)
                      }
                    />
                  </>
                )}
            </CardBody>
          </Card>
        </Col>

        <Col xs={"12"} lg={"12"}>
          <Card>
            <CardHeader>
              <h4>
                <i className="fa fa-tasks" /> Assigned tasks
              </h4>

              {!isLoading ? (
                <Col sm={"4"}>
                  <Button
                    type="button"
                    className={"pull-right theme-btn add-btn btn-link"}
                    onClick={() =>
                      this.setState({
                        selectedBrand: userDetails._id,
                        showTask: true
                      })
                    }
                    id={`tooltip-assign-task-${userDetails._id}`}
                  >
                    <i className="fa fa-tasks" />{" "}&nbsp;Assign Task
                </Button>
                  <UncontrolledTooltip
                    target={`tooltip-assign-task-${userDetails._id}`}
                  >
                    {`Assign task to ${userDetails.fullName}`}
                  </UncontrolledTooltip>
                  <AssignTaskToBrand
                    showTask={showTask}
                    selectedBrand={selectedBrand}
                    hideModal={this.hideModal}
                  />
                </Col>
              ) : null}

            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Loader />
              ) : (
                  taskDetails ?
                  taskDetails.map((taskDetail, index) =>  {
                    return (
                      <AssignTaskView
                        taskDetails={taskDetail}
                        goToList={() =>
                          this.props.history.push(AppRoutes.VIEW_BRAND_AMBASSADOR)
                        }
                        handleSelect={(selectedOption, name) =>
                          this.handleSelect(selectedOption, name, taskDetail._id)
                        }
                        handleChange={this.handleChange}
                        handleSubmit={e => this.handleSubmit(e, taskDetail._id)}
                        key={index}
                      />
                    );
                  }): "bnm"
                )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default BarndDetails;

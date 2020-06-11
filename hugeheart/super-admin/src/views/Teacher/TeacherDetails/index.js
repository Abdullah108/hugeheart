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
import { logger } from "../../../helpers";
import { getTeacherDetails } from "../../../methods";
import Loader from "../../../containers/Loader/Loader";
import TeacherDetailsView from "./TeacherDetails";
import AssignedMaterials from "./AssignedMaterials";
import AssignMaterials from "../AssignMaterials";
// import TeacherCalendar from "./TeacherCalendar";
import TeacherCalendar from "./TeacherDashboardV2";
class TeacherDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userDetails: {}
    };
    this.assignMaterialsRef = React.createRef();
    this.assignedMaterialsRef = React.createRef();
  }
  /**
   *
   */
  componentDidMount() {
    const { params } = this.props.match;
    const { id } = params;
    logger(id);
    if (id) {
      this.getDetails(id);
    } else {
      this.props.history.push(AppRoutes.NOT_FOUND);
    }
  }
  /**
   *
   */
  getDetails = async id => {
    const { isSuccess, data } = await getTeacherDetails(id);
    if (!isSuccess) {
      this.props.history.push(AppRoutes.NOT_FOUND);
      return;
    }
    this.setState({
      isLoading: false,
      userDetails: data.data
    });
  };
  /**
   *
   */
  hideAssignMaterialModal = () => {
    this.setState({
      showMaterialsModal: false
    });
    this.assignedMaterialsRef.current.getAssignedMaterial();
  };
  /**
   *
   */
  render() {
    const { isLoading, userDetails, showMaterialsModal } = this.state;
    const { params } = this.props.match;
    const { id } = params;

    return (
      <>
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
                          AppRoutes.TEACHER_DETAILS_EDIT.replace(
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
                  <TeacherDetailsView
                    userDetails={userDetails || {}}
                    goToList={() => this.props.history.push(AppRoutes.TEACHERS)}
                  />
                )}
              </CardBody>
            </Card>
          </Col>
          <Col xs={"12"} lg={"12"}>
            <Card>
              <CardHeader>
                <h4>
                  <i className="fa fa-database" /> Assigned Materials
                </h4>
                <>
                  <Button
                    className={"pull-right theme-btn add-btn btn-link"}
                    id={"get-assigned-tooltip"}
                    onClick={() =>
                      this.setState({
                        showMaterialsModal: true
                      })
                    }
                  >
                    <i className={"fa fa-pencil"} />
                    &nbsp; Assign Materials
                  </Button>
                  <UncontrolledTooltip target={"get-assigned-tooltip"}>
                    Assign new material to {userDetails.fullName}
                  </UncontrolledTooltip>
                </>
              </CardHeader>
              <CardBody>
                <AssignedMaterials
                  teacherId={id}
                  assignedMaterialsRef={this.assignMaterialsRef}
                  ref={this.assignedMaterialsRef}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <AssignMaterials
          showMaterial={showMaterialsModal}
          fullName={userDetails.fullName}
          hideModal={this.hideAssignMaterialModal}
          selectedTeachers={id}
          ref={this.assignMaterialsRef}
        />
        <TeacherCalendar
          teacherId={id}
          availibility={userDetails.availibility}
        />
      </>
    );
  }
}

export default TeacherDetails;

import React, { Component } from "react";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import Loader from "../../../containers/Loader/Loader";
import {
  getAssignMaterialToTeacher,
  assignMaterialToTeacher
} from "../../../methods";
import { logger } from "../../../helpers";
import LoadingButton from "../../../components/LoadingButton";

class AssignedMaterials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teacherId: "",
      isLoading: true,
      data: [],
      isAssigning: []
    };
  }
  /**
   *
   */
  componentDidMount() {
    const { teacherId } = this.props;
    this.setState(
      {
        teacherId
      },
      () => this.getAssignedMaterial()
    );
  }
  /**
   *
   */
  getAssignedMaterial = async () => {
    const { teacherId } = this.state;
    this.setState({
      isLoading: true
    });
    const result = await getAssignMaterialToTeacher(teacherId);
    logger(result);
    if (result.isSuccess) {
      const { data } = result.data;
      this.setState({
        data,
        isLoading: false
      });
    } else {
      this.setState({
        data: [],
        isLoading: false
      });
    }
  };
  /**
   *
   */
  assignMaterial = async (id, index, assign) => {
    const { isAssigning, data } = this.state;
    const { teacherId, assignedMaterialsRef } = this.props;

    isAssigning[index] = true;
    this.setState({
      isAssigning
    });
    const result = await assignMaterialToTeacher(id, {
      assign,
      teacherId
    });
    logger(result);
    isAssigning[index] = false;
    const ind = data.findIndex(d => d.materialId === id);
    data.splice(ind, 1);
    this.setState({
      isAssigning,
      data
    });
    if (assignedMaterialsRef && assignedMaterialsRef.current) {
      assignedMaterialsRef.current.getAssignedMaterial();
    }
  };
  /**
   *
   */
  render() {
    const { isLoading, data, isAssigning } = this.state;
    logger(this.props.assignedMaterialsRef);
    return (
      <Card className={"mt-0"}>
        <CardBody className={"mt-0"}>
          <Row>
            {isLoading ? (
              <Col sm={"12"}>
                <Loader />
              </Col>
            ) : data.length ? (
              data.map((materials, index) => {
                const material = materials.folderId;
                return (
                  <Col sm={"4"} key={index}>
                    <div className={"material-item"}>
                      <h6>{material.folderName}</h6>
                      {isAssigning[index] ? (
                        <LoadingButton />
                      ) : (
                        <Button
                          type="button"
                          color={"danger"}
                          className={"btn-cancel btn-submit btn-link"}
                          onClick={() =>
                            this.assignMaterial(material._id, index, false)
                          }
                        >
                          Unassign
                        </Button>
                      )}
                    </div>
                  </Col>
                );
              })
            ) : (
              <Col sm={"12"}>
                <div className={"material-item text-center"}>
                  <span>No material found.</span>
                </div>
              </Col>
            )}
          </Row>
        </CardBody>
      </Card>
    );
  }
}

export default AssignedMaterials;

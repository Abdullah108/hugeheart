import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
  Input,
  FormGroup,
  Label
} from "reactstrap";
import { logger } from "../../helpers";
import {
  assignMaterialToTeacher,
  getAssignMaterialToTeacher,
  getAllFolders
} from "../../methods";
import Loader from "../../containers/Loader/Loader";
import LoadingButton from "../../components/LoadingButton";
import { AppConfig } from "../../config";
import { debounce } from "lodash";
class AssignMaterials extends Component {
  searchDebouncer;
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      materials: [],
      search: "",
      isAssigning: [],
      assignedMaterials: []
    };
  }
  /**
   *
   */
  componentDidMount() {
    this.getMaterials();
    const { selectedTeachers } = this.props;
    if (selectedTeachers) {
      this.getAssignedMaterial();
    }
  }
  /**
   *
   */
  componentDidUpdate({ selectedTeachers: prevSelectedTeachers }) {
    const { selectedTeachers } = this.props;
    if (selectedTeachers && selectedTeachers !== prevSelectedTeachers) {
      this.getAssignedMaterial();
    }
  }
  /**
   *
   */
  getAssignedMaterial = async () => {
    const { selectedTeachers } = this.props;
    this.setState({
      isLoading: true
    });
    const result = await getAssignMaterialToTeacher(selectedTeachers);
    logger(result);
    if (result.isSuccess) {
      const { data: assignedMaterials } = result.data;
      this.setState({
        assignedMaterials,
        isLoading: false
      });
    } else {
      this.setState({
        assignedMaterials: [],
        isLoading: false
      });
    }
  };
  /**
   *
   */
  getMaterials = async () => {
    try {
      this.setState({
        isLoading: true,
        materials: []
      });
      const { search } = this.state;
      const { data: resp } = await getAllFolders({ search });
      const { data: materials } = resp;
      this.setState({
        isLoading: false,
        materials
      });
    } catch (error) {
      logger(error);
      this.setState({
        isLoading: false,
        materials: []
      });
    }
  };
  /**
   *
   */
  handleChange = e => {
    if (this.searchDebouncer) {
      this.searchDebouncer.cancel();
    }
    this.searchDebouncer = debounce(value => {
      this.setState(
        {
          search: value
        },
        () => this.getMaterials()
      );
    }, 500);
    this.searchDebouncer(e.target.value);
  };
  /**
   *
   */
  assignMaterial = async (id, index, assign) => {
    const { isAssigning, assignedMaterials } = this.state;
    const { selectedTeachers } = this.props;

    isAssigning[index] = true;
    this.setState({
      isAssigning
    });
    const result = await assignMaterialToTeacher(id, {
      assign,
      teacherId: selectedTeachers
    });
    logger(result);
    isAssigning[index] = false;
    const ind = assignedMaterials.findIndex(d => d.materialId === id);
    if (assign) {
      assignedMaterials.push({
        folderId: {
          _id: id
        }
      });
    } else {
      assignedMaterials.splice(ind, 1);
    }
    this.setState({
      isAssigning,
      assignedMaterials
    });
  };
  /**
   *
   */
  render() {
    const { showMaterial, hideModal, fullName } = this.props;
    const { isLoading, materials, isAssigning, assignedMaterials } = this.state;
    logger(this.props);
    return (
      <Modal centered isOpen={showMaterial} toggle={hideModal} size={"lg"}>
        <ModalHeader toggle={hideModal}>
          Assign materials to {fullName || "teachers"}
        </ModalHeader>
        <ModalBody>
          <br />
          <Row>
            <Col sm={"12"}>
              <FormGroup>
                <Input
                  type="text"
                  name="emergencyContactNumber"
                  id="emergencyContactNumber"
                  onChange={this.handleChange}
                  className={"floating-input"}
                />
                <Label
                  className="floating-label form-label"
                  htmlFor="emergencyContactNumber"
                >
                  Search for material
                </Label>
              </FormGroup>
            </Col>
            <Col sm={"12"}>
              <h5>All Materials</h5>
            </Col>
            {isLoading ? (
              <Col sm={"12"}>
                <Loader />
              </Col>
            ) : materials.length ? (
              materials.map((material, index) => {
                return (
                  <Col sm={"6"} key={index}>
                    <div className={"material-item"}>
                      <h6>{material.folderName}</h6>
                      {isAssigning[index] ? (
                        <LoadingButton />
                      ) : assignedMaterials.findIndex(
                          d => d.folderId._id === material._id
                        ) > -1 ? (
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
                      ) : (
                        <Button
                          type="submit"
                          onClick={() =>
                            this.assignMaterial(material._id, index, true)
                          }
                          color={"primary"}
                          className={"btn-submit btn-link"}
                        >
                          Assign
                        </Button>
                      )}
                      &nbsp;&nbsp;&nbsp;
                      <a
                        href={`${AppConfig.SERVER_FILES_ENDPOINT}${material.fileURL}`}
                        target={"_blank"}
                      >
                        <i className={"fa fa-eye"}></i>
                      </a>
                    </div>
                  </Col>
                );
              })
            ) : (
              <Col sm={"12"}>
                <div className={"material-item text-center"}>
                  <span>No material found</span>
                </div>
              </Col>
            )}
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            color={"danger"}
            className={"btn-cancel btn-submit btn-link"}
            onClick={hideModal}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default AssignMaterials;

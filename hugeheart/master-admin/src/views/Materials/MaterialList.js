import React, { Component } from "react";
import { Row, Col, UncontrolledTooltip } from "reactstrap";
import Loader from "../../containers/Loader/Loader";
import { logger } from "./../../helpers";
import { AppConfig } from "../../config";
import { getUserToken } from "../../helpers";
import UpdateMaterialModal from "./UpdateMaterialModal";
class MaterialList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUpdateModal: false,
      selectedMaterial: ""
    };
  }
  /**
   *
   */
  render() {
    const { isLoading, data } = this.props;
    const { showUpdateModal, selectedMaterial } = this.state;
    return (
      <>
        <Row>
          {isLoading ? (
            <Col sm={"12"}>
              <Loader />
            </Col>
          ) : data.length ? (
            data.map((material, index) => {
              return (
                <Col sm={"4"} key={index}>
                  <div className={"material-item"}>
                    <h6>
                      <b>Material:</b> {material.materialName || "N/A"}
                    </h6>
                    <h6>
                      <b>Year:</b> {material.class}
                    </h6>
                    <h6>
                      <b>Subject:</b> {material.subject}
                    </h6>
                    <h6>
                      <b>Topic:</b> {material.topic ? material.topic.name : "-"}
                    </h6>
                    <div className={"action-btn-wrap"}>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => {
                          logger("fadsf", AppConfig.SERVER_FILES_ENDPOINT);
                          window.open(
                            `${AppConfig.SERVER_FILES_ENDPOINT}${
                              material.fileURL
                            }?folderId=${
                              material.folderId
                            }&token=${getUserToken()}`
                          );
                        }}
                        id={`tooltip-view-${material._id}`}
                      >
                        <i className="fa fa-eye" />
                      </button>
                      <UncontrolledTooltip
                        target={`tooltip-view-${material._id}`}
                      >
                        {`View Material File`}
                      </UncontrolledTooltip>
                      &nbsp;&nbsp;
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() =>
                          this.setState({
                            showUpdateModal: true,
                            selectedMaterial: material
                          })
                        }
                        id={`tooltip-edit-${material._id}`}
                      >
                        <i className="fa fa-edit" />
                      </button>
                      <UncontrolledTooltip
                        target={`tooltip-edit-${material._id}`}
                      >
                        {`Request to update material file`}
                      </UncontrolledTooltip>
                    </div>
                  </div>
                </Col>
              );
            })
          ) : (
            <Col sm={"12"}>
              <div className={"material-item text-center"}>
                <span>No material assigned to you.</span>
              </div>
            </Col>
          )}
        </Row>
        <UpdateMaterialModal
          show={showUpdateModal}
          selectedMaterial={selectedMaterial}
          hideModal={() =>
            this.setState({
              showUpdateModal: false
            })
          }
        />
      </>
    );
  }
}

export default MaterialList;

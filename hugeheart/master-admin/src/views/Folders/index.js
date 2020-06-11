import React, { Component } from "react";
import CardContainer from "../../containers/CardContainer";
import { logger } from "../../helpers";
import { getAllFolders } from "../../methods";
import qs from "querystring";
import { Row, Col, UncontrolledTooltip } from "reactstrap";
import Loader from "../../containers/Loader/Loader";
import { AppConfig, AppRoutes } from "../../config";
class Folders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddModal: false,
      isLoading: false,
      folders: [],
      isEditMode: false,
      selectedFolder: {}
    };
    logger();
  }
  componentDidMount() {
    this.getFolders();
  }
  /**
   *
   */
  getFolders = async () => {
    this.setState({
      isLoading: true
    });
    const { location } = this.props;
    const { search: locationSearch } = location;
    const queryOptions = qs.parse(locationSearch.replace("?", ""));
    const { isSuccess, data } = await getAllFolders(queryOptions);
    logger(isSuccess, data);
    this.setState({
      folders: isSuccess && data.data && data.data.map ? data.data : [],
      isLoading: false
    });
  };
  /**
   *
   */
  render() {
    const { isLoading, folders } = this.state;
    return (
      <>
        <CardContainer icon={"fa fa-folder-o"} title={"Material Folders"}>
          <Row>
            {isLoading ? (
              <Col sm={"12"}>
                <Loader />
              </Col>
            ) : folders.length ? (
              folders.map((item, index) => {
                const folder = item.folderId;
                return (
                  <Col sm={"3"} key={index}>
                    <div className={"material-item"}>
                      <h6>{folder.folderName}</h6>
                      <div className={"action-btn-wrap"}>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => {
                            logger("fadsf", AppConfig.SERVER_FILES_ENDPOINT);
                            this.props.history.push(
                              AppRoutes.MATERIAL.replace(
                                ":folderId",
                                folder._id
                              )
                            );
                          }}
                          id={`tooltip-view-${folder._id}`}
                        >
                          <i className="fa fa-eye" />
                        </button>
                        <UncontrolledTooltip
                          target={`tooltip-view-${folder._id}`}
                        >
                          {`Open folder`}
                        </UncontrolledTooltip>
                      </div>
                    </div>
                  </Col>
                );
              })
            ) : (
              <Col sm={"12"}>
                <div className={"material-item text-center"}>
                  <span>No folders found.</span>
                </div>
              </Col>
            )}
          </Row>
        </CardContainer>
      </>
    );
  }
}

export default Folders;

import React, { Component } from "react";
import CardContainer from "../../../containers/CardContainer";
import { logger } from "../../../helpers";
import { getAllFolders } from "../../../methods";
import qs from "querystring";
import {
  Row,
  Col,
  UncontrolledTooltip,
  Form,
  Label,
  FormGroup,
  InputGroup
} from "reactstrap";
import Loader from "../../../containers/Loader/Loader";
import { AppRoutes } from "../../../config";
class CurriculumFolders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddModal: false,
      isLoading: false,
      folders: [],
      isEditMode: false,
      selectedFolder: {},
      search: ""
    };
    logger();
  }
  componentDidMount() {
    const { location } = this.props;
    const { search: currentSearch } = location;
    let { search } = qs.parse(currentSearch.replace("?", ""));

    this.setState(
      {
        search: search || ""
      },
      () => {
        this.getFolders();
      }
    );
  }
  componentDidUpdate({ location: prevLocation }) {
    const { search: prevSearch } = prevLocation;
    const { location } = this.props;
    const { search: currentSearch } = location;
    if (prevSearch !== currentSearch) {
      let { search } = qs.parse(currentSearch.replace("?", ""));

      this.setState(
        {
          search: search || ""
        },
        () => {
          this.getFolders();
        }
      );
    }
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
    const { isSuccess, data } = await getAllFolders({
      ...queryOptions,
      type: "curriculum"
    });
    logger(isSuccess, data);
    this.setState({
      folders: isSuccess && data.data && data.data.map ? data.data : [],
      isLoading: false
    });
  };
  /**
   *
   */
  toggleMoal = () => {
    this.setState({
      showAddModal: !this.state.showAddModal,
      isEditMode: false,
      selectedFolder: {}
    });
  };
  /**
   *
   */
  handleChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value
    });
  };
  /**
   *
   */
  onSearch = e => {
    e.preventDefault();
    const { search } = this.state;
    const query = qs.stringify({
      search
    });
    logger(query);
    this.props.history.push(`${AppRoutes.CURRICULUM_FOLDERS}?${query}`);
  };
  /**
   *
   */
  onReset = () => {
    this.props.history.push(AppRoutes.CURRICULUM_FOLDERS);
  };
  /**
   *
   */
  render() {
    const { isLoading, folders, search } = this.state;
    return (
      <>
        <CardContainer
          icon={"fa fa-folder-o"}
          title={"Curriculum Folders"}
          showBtn
          buttonText={"Add New Curriculum Folder"}
          onButtonClick={this.toggleMoal}
        >
          <div className={"filter-block"}>
            <Form onSubmit={this.onSearch}>
              <Row>
                <Col lg={"3"} md={"3"} className="mb-0">
                  <FormGroup className="mb-0">
                    <Label className="label">Search</Label>
                    <InputGroup className="mb-2">
                      <input
                        type="text"
                        name="search"
                        onChange={this.handleChange}
                        className="form-control"
                        aria-describedby="searchUser"
                        placeholder="Search by curriculum folder name"
                        value={search}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col lg={"3"} md={"3"} className="mb-0">
                  <div className="filter-btn-wrap">
                    <Label className="height17 label" />
                    <div className="form-group mb-0">
                      <span className="mr-2">
                        <button
                          type="submit"
                          className="btn btn-circle btn-search"
                          id="Tooltip-1"
                        >
                          <i className="fa fa-search" />
                        </button>
                        <UncontrolledTooltip target="Tooltip-1">
                          Search
                        </UncontrolledTooltip>
                      </span>
                      <span className="">
                        <button
                          type="button"
                          className="btn btn-circle btn-refresh"
                          id="Tooltip-2"
                          onClick={this.onReset}
                        >
                          <i className="fa fa-refresh" />
                        </button>
                        <UncontrolledTooltip target={"Tooltip-2"}>
                          Reset all filters
                        </UncontrolledTooltip>
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
          <Row>
            {isLoading ? (
              <Col sm={"12"}>
                <Loader />
              </Col>
            ) : folders.length ? (
              folders.map((fold, index) => {
                const folder = fold.folderId;
                return (
                  <Col sm={"3"} key={index}>
                    <div className={"material-item"}>
                      <h6>{folder.folderName}</h6>
                      <div className={"action-btn-wrap"}>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => {
                            this.props.history.push(
                              AppRoutes.CURRICULUM.replace(
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

export default CurriculumFolders;

import React, { Component } from "react";
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardHeader,
  CardBody,
  Row
} from "reactstrap";
import LoadingButton from "./../../../components/LoadingButton";
import { toast, logger } from "../../../helpers";
import { addBrand, getBrandDetails } from "../../../methods/BrandAmbassador";
import { AppRoutes } from "../../../config";
import ExactLocation from "../AddBrandAmbassador/ExactLocation";
import Select from "react-select";
import { SelectTitle } from "../../../helpers/SelectOption";
import Loader from "../../../containers/Loader/Loader";
import { getUsers } from "../../../methods";
import qs from "querystring";

class AddBradAmbassador extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      title: "",
      createdBy: "",
      contactNumber: "",
      assignTask: "",
      additionalNote: "",
      isEditMode: false,
      exactLocation: {
        country: "",
        state: "",
        city: "",
        postalCode: "",
        streetAddress: "",
        addressLine1: "",
        addressLine2: ""
      },
      errors: {
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
        title: ""
      },
      isFetchingDetails: true
    };
    this.exactLocation = React.createRef();
  }

  componentDidMount() {
    const { params } = this.props.match;
    const { id } = params;
    this.getData();
    logger(id);
    if (id) {
      this.setState(
        {
          id,
          isEditMode: true
        },
        () => {
          this.getBrandAmbassador(id);
        }
      );
    } else {
      this.setState({
        isFetchingDetails: false
      });
    }
  }

  /**
   *
   */
  getData = () => {
    const { location } = this.props;
    const { search: locationSearch } = location;
    const { search, statusActive, selectedPage } = qs.parse(
      locationSearch.replace("?", "")
    );
    this.setState(
      {
        search: search || "",
        statusActive: statusActive || "",
        selectedPage: selectedPage || 1
      },
      () => {
        this.getUsers();
      }
    );
  };
  /**
   *
   */
  getUsers = async () => {
    try {
      this.setState({
        isLoading: true,
        users: []
      });
      const { skip, limit, search, statusActive } = this.state;
      const data = { skip, limit, search, statusActive };
      const { data: resp } = await getUsers(data);
      const { totalUsers, data: users } = resp;
      const userData = users.map(user => {
        return { label: user.fullName, value: user._id };
      });

      this.setState({
        userData,
        totalCount: totalUsers,
        isLoading: false
      });
    } catch (error) {
      logger(error);
      this.setState({
        isLoading: false,
        users: []
      });
    }
  };

  /**
   *
   */

  getBrandAmbassador = async id => {
    try {
      const { isSuccess, data } = await getBrandDetails(id);
      if (!isSuccess) {
        this.props.history.push(AppRoutes.NOT_FOUND);
        return;
      }
      const {
        firstName,
        lastName,
        email,
        contactNumber,
        title,
        exactLocation,
        assignTask,
        additionalNote
      } = data.data;
      this.setState({
        ...data.data,
        email: email || "",
        firstName: firstName || "",
        lastName: lastName || "",
        contactNumber: contactNumber || "",
        title: title || "",
        exactLocation,
        assignTask: assignTask || "",
        additionalNote: additionalNote || "",
        isFetchingDetails: false
      });
      console.log("====================================");
      console.log(title);
      console.log("====================================");
    } catch (error) {
      logger(error);
    }
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
  handleSubmit = async event => {
    event.preventDefault();
    this.setState({
      errors: {},
      isLoading: true
    });
    try {
      const {
        email,
        firstName,
        lastName,
        contactNumber,
        assignTask,
        additionalNote,
        title,
        createdBy,
        id
      } = this.state;
      const data = {
        email,
        firstName,
        lastName,
        contactNumber,
        title,
        createdBy,
        assignTask,
        additionalNote,
        exactLocation: this.exactLocation.current.getLocation()
      };
      const { isSuccess, message, errors } = await addBrand(data, id);
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
      this.props.history.push(AppRoutes.GET_BRAND_AMBASSADOR);
    } catch (error) {
      logger(error);
    }
  };

  handleSelect = async (selectedOption, name) => {
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

  handleSelectMasterAdmin = async (selectedOption, name) => {
    logger(selectedOption.value);
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

  render() {
    const {
      email,
      firstName,
      lastName,
      contactNumber,
      title,
      createdBy,
      userData,
      errors,
      isLoading,
      exactLocation,
      isEditMode,
      isFetchingDetails
    } = this.state;
    logger(title);
    const seletedTitle = {
      label: title,
      value: title
    };
    const selectedMasterAdmin = (userData || []).filter(
      masterAdmin => createdBy === masterAdmin.value
    )[0];

    return (
      <div className="cr-page px-3">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <CardHeader>
                <h4>
                  <i className="fa fa-edit" />
                  &nbsp;Add Brand Ambassador
                </h4>
              </CardHeader>
              <CardBody>
                {isFetchingDetails ? (
                  <Loader />
                ) : (
                  <Form onSubmit={this.handleSubmit}>
                    <Row>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={firstName}
                            className={"floating-input"}
                            onChange={this.handleChange}
                          />
                          <Label
                            className="floating-label form-label"
                            for="firstName"
                          >
                            First Name
                          </Label>
                          {errors.firstName ? (
                            <p className={"text-danger error-text"}>
                              {errors.firstName}
                            </p>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={lastName}
                            className={"floating-input"}
                            onChange={this.handleChange}
                          />
                          <Label
                            className="floating-label form-label"
                            for="lastName"
                          >
                            Last Name
                          </Label>
                          {errors.lastName ? (
                            <p className={"text-danger error-text"}>
                              {errors.lastName}
                            </p>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col sm={"6"}>
                        <Label
                          className="floating-label form-label margin-n"
                          for="useremail"
                        >
                          Title
                        </Label>
                        <FormGroup>
                          <Select
                            options={SelectTitle}
                            onChange={selectedOption =>
                              this.handleSelect(selectedOption, "title")
                            }
                            value={seletedTitle}
                            placeholder={"Select title..."}
                          />
                          {errors.title ? (
                            <p
                              className={"text-danger error-text select-option"}
                            >
                              {errors.title}
                            </p>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col sm={"6"}>
                        <Label
                          className="floating-label form-label margin-n"
                          for="useremail"
                        >
                          Master Admin
                        </Label>
                        <FormGroup>
                          <Select
                            options={userData}
                            onChange={selectedOption =>
                              this.handleSelectMasterAdmin(
                                selectedOption,
                                "createdBy"
                              )
                            }
                            value={selectedMasterAdmin}
                            placeholder={"Select Master Admin..."}
                          />
                        </FormGroup>
                      </Col>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Input
                            type="email"
                            name="email"
                            id="useremail"
                            value={email}
                            className={"floating-input"}
                            onChange={this.handleChange}
                          />
                          <Label
                            className="floating-label form-label"
                            for="useremail"
                          >
                            Email
                          </Label>
                          {errors.email ? (
                            <p className={"text-danger error-text"}>
                              {errors.email}
                            </p>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Input
                            type="text"
                            name="contactNumber"
                            id="usercontact"
                            value={contactNumber}
                            className={"floating-input"}
                            onChange={this.handleChange}
                          />
                          <Label
                            className="floating-label form-label"
                            for="usercontact"
                          >
                            Contact Number
                          </Label>
                          <div>
                            {errors.email ? (
                              <p className={"text-danger error-text"}>
                                {errors.contactNumber}
                              </p>
                            ) : null}
                          </div>
                        </FormGroup>
                      </Col>
                      <Col sm={"12"}>
                        <ExactLocation
                          location={exactLocation}
                          errors={errors.exactLocation}
                          ref={this.exactLocation}
                          isEditMode={isEditMode}
                        />
                      </Col>
                    </Row>

                    <FormGroup>
                      <Col sm={{ size: 4, offset: 8 }} className={"text-right"}>
                        <Button
                          type="button"
                          color={"danger"}
                          className={"btn-cancel btn-submit btn-link"}
                          onClick={() => {
                            this.props.history.push(
                              AppRoutes.GET_BRAND_AMBASSADOR
                            );
                          }}
                        >
                          Cancel
                        </Button>
                        {isLoading ? (
                          <LoadingButton />
                        ) : (
                          <Button
                            type="submit"
                            onClick={this.handleSubmit}
                            color={"primary"}
                            className={"btn-submit btn-link"}
                          >
                            Save
                          </Button>
                        )}
                      </Col>
                    </FormGroup>
                  </Form>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddBradAmbassador;

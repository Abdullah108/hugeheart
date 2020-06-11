import React, { Component } from "react";
import {
  Row,
  Col,
  FormGroup,
  Card,
  CardHeader,
  CardBody,
  Form,
  Label,
  Input,
  Button
} from "reactstrap";
import LoadingButton from "../../../components/LoadingButton";
import Flatpickr from "react-flatpickr";

import PreferedLocation from "./PreferedLocation";
import ExactLocation from "./ExactLocation";
import { AppRoutes } from "../../../config/AppRoutes";
import { getMasterAdminDetails, addUpdateMasterAdmin } from "../../../methods";
import { toast, logger } from "../../../helpers";
import Loader from "../../../containers/Loader/Loader";

class AddMasterAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditMode: false,
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      preferedLocation: { country: "", state: "", city: "", postalCode: "" },
      exactLocation: {
        country: "",
        state: "",
        city: "",
        postalCode: "",
        streetAddress: "",
        addressLine1: "",
        addressLine2: ""
      },
      expiryDateChildrenWorking: new Date(),
      contractTerm: [new Date(), new Date()],
      childrenCheckNumber: "",
      experienceInBusiness: "",
      errors: {
        preferedLocation: {},
        exactLocation: {}
      },
      isLoading: false,
      isFetchingDetails: true
    };
    this.preferedLocation = React.createRef();
    this.exactLocation = React.createRef();
  }
  /**
   *
   */
  componentDidMount() {
    const { params } = this.props.match;
    const { id } = params;
    logger(id);
    if (id) {
      this.setState(
        {
          id,
          isEditMode: true
        },
        () => {
          this.getDetails(id);
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
  getDetails = async id => {
    const { isSuccess, data } = await getMasterAdminDetails(id);
    if (!isSuccess) {
      this.props.history.push(AppRoutes.NOT_FOUND);
      return;
    }
    logger(data.data);
    const {
      experiance,
      workingWithStudent,
      workingWithStudentExpirationDate,
      liscenceStartDate,
      liscenceEndDate
    } = data.data;
    this.setState({
      ...data.data,
      experienceInBusiness: experiance,
      childrenCheckNumber: workingWithStudent,
      expiryDateChildrenWorking: new Date(workingWithStudentExpirationDate),
      contractTerm: [new Date(liscenceStartDate), new Date(liscenceEndDate)],
      isFetchingDetails: false
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
  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ isLoading: true, errors: {} });
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      experienceInBusiness,
      expiryDateChildrenWorking,
      contractTerm,
      childrenCheckNumber,
      id
    } = this.state;
    const data = {
      firstName,
      lastName,
      email,
      preferedLocation: this.preferedLocation.current.getLocation(),
      contactNumber,
      exactLocation: this.exactLocation.current.getLocation(),
      experienceInBusiness,
      expiryDateChildrenWorking: expiryDateChildrenWorking.toString(),
      contractTerm,
      childrenCheckNumber
    };
    const { isSuccess, message, errors } = await addUpdateMasterAdmin(data, id);

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
    this.setState({ isLoading: false });
    toast(message, "success");
    this.props.history.push(AppRoutes.USERS);
  };
  /**
   *
   */
  render() {
    const {
      firstName,
      lastName,
      email,
      isLoading,
      experienceInBusiness,
      preferedLocation,
      exactLocation,
      expiryDateChildrenWorking,
      contractTerm,
      childrenCheckNumber,
      contactNumber,
      isFetchingDetails,
      isEditMode
    } = this.state;
    let errors = this.state.errors || {};
    if (!errors.preferedLocation) {
      errors.preferedLocation = {};
    }
    if (!errors.preferedLocation) {
      errors.exactLocation = {};
    }
    return (
      <div className="cr-page px-3 min-height650">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <CardHeader>
                <h4>
                  <i className="fa fa-edit" />
                  &nbsp;Master Admin Details
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
                            onChange={this.handleChange}
                            className={"floating-input"}
                            placeholder={" "}
                          />
                          <Label
                            className="floating-label form-label"
                            for="firstName"
                          >
                            First Name
                          </Label>
                          {errors.firstName ? (
                            <p className={"text-danger"}>{errors.firstName}</p>
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
                            onChange={this.handleChange}
                            className={"floating-input"}
                            placeholder={" "}
                          />
                          <Label
                            className="floating-label form-label"
                            for="lastName"
                          >
                            Last Name
                          </Label>
                          {errors.lastName ? (
                            <p className={"text-danger"}>{errors.lastName}</p>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Input
                            type="email"
                            name="email"
                            id="useremail"
                            value={email}
                            onChange={this.handleChange}
                            className={"floating-input"}
                            placeholder={" "}
                          />
                          <Label
                            className="floating-label form-label"
                            for="useremail"
                          >
                            Email
                          </Label>

                          {errors.email ? (
                            <p className={"text-danger"}>{errors.email}</p>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Input
                            type="text"
                            name="contactNumber"
                            id="contactNumber"
                            value={contactNumber}
                            onChange={this.handleChange}
                            className={"floating-input"}
                            placeholder={" "}
                          />
                          <Label
                            className="floating-label form-label"
                            for="contactNumber"
                          >
                            Contact Number
                          </Label>
                          {errors.contactNumber ? (
                            <p className={"text-danger"}>
                              {errors.contactNumber}
                            </p>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <PreferedLocation
                      location={preferedLocation}
                      errors={errors.preferedLocation}
                      ref={this.preferedLocation}
                      isEditMode={isEditMode}
                    />
                    <ExactLocation
                      location={exactLocation}
                      errors={errors.exactLocation}
                      ref={this.exactLocation}
                      isEditMode={isEditMode}
                    />
                    <Row>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Input
                            type="text"
                            name="experienceInBusiness"
                            id="experienceInBusiness"
                            value={experienceInBusiness}
                            onChange={this.handleChange}
                            className={"floating-input"}
                            placeholder={" "}
                          />
                          <Label
                            className="floating-label form-label"
                            for="contactNumber"
                          >
                             Experiance in Business
                          </Label>
                          {errors.experienceInBusiness ? (
                            <p className={"text-danger"}>
                              {errors.experienceInBusiness}
                            </p>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Input
                            type="text"
                            name="childrenCheckNumber"
                            id="childrenCheckNumber"
                            value={childrenCheckNumber}
                            onChange={this.handleChange}
                            className={"floating-input"}
                            placeholder={" "}
                          />
                          <Label
                            className="floating-label form-label"
                            for="contactNumber"
                          >
                             Working with student/children check number
                          </Label>
                          {errors.childrenCheckNumber ? (
                            <p className={"text-danger"}>
                              {errors.childrenCheckNumber}
                            </p>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Flatpickr
                            onChange={date => {
                              console.log(date);
                              console.log(new Date(date[0]));
                              this.setState({
                                expiryDateChildrenWorking: new Date(date[0])
                              });
                            }}
                            options={{
                              altInput: true,
                              altFormat: "F j, Y",
                              dateFormat: "Y-m-d",
                              minDate: new Date()
                            }}
                            name="expiryDateChildrenWorking"
                            id="expiryDateChildrenWorking"
                            value={expiryDateChildrenWorking}
                            className={"floating-input"}
                          />
                          <Label
                            className="floating-label form-label"
                            for="contactNumber"
                          >
                             Expiry date for Working with children
                          </Label>
                          {errors.expiryDateChildrenWorking ? (
                            <p className={"text-danger"}>
                              {errors.expiryDateChildrenWorking}
                            </p>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col sm={"6"}>
                        <FormGroup>
                          <Flatpickr
                            onChange={date => {
                              this.setState({
                                contractTerm: date
                              });
                            }}
                            options={{
                              mode: "range",
                              altInput: true,
                              altFormat: "F j, Y",
                              dateFormat: "Y-m-d",
                              minDate: new Date()
                            }}
                            name="contractTerm"
                            id="Contract-term"
                            value={contractTerm}
                            className={"floating-input"}
                          />
                          <Label
                            className="floating-label form-label"
                            for="contactNumber"
                          >
                             Contract term
                          </Label>
                          {errors.contractTerm ? (
                            <p className={"text-danger"}>
                              {errors.contractTerm}
                            </p>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <FormGroup>
                      <Col sm={{ size: 4, offset: 8 }} className={"text-right"}>
                        <Button
                          type="button"
                          color={"danger"}
                          className={"btn-cancel btn-submit btn-link"}
                          onClick={() => {
                            this.props.history.push(AppRoutes.USERS);
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

export default AddMasterAdmin;

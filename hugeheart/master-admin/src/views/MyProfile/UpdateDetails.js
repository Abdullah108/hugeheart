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
import LoadingButton from "../../components/LoadingButton";
import { toast, logger } from "../../helpers";
import { updateProfile, getProfile } from "../../methods";

class UpdateDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      errors: {
        preferedLocation: {},
        exactLocation: {}
      },
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

      experienceInBusiness: ""
    };

    this.preferedLocation = React.createRef();
    this.exactLocation = React.createRef();
  }
  componentDidMount() {
    this.getAdminProfile();
  }
  /**
   *
   */
  getAdminProfile = async () => {
    try {
      const {
        email,
        firstName,
        lastName,
        contactNumber,
        experienceInBusiness
      } = await getProfile();
      this.setState({
        email: email || "",
        firstName: firstName || "",
        lastName: lastName || "",
        contactNumber: contactNumber || "",
        experienceInBusiness: experienceInBusiness || ""
      });
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
        experienceInBusiness,
        contractTerm,
        childrenCheckNumber
      } = this.state;
      const data = {
        email,
        firstName,
        lastName,
        contactNumber,
        experienceInBusiness,
        contractTerm,
        childrenCheckNumber
      };
      const { isSuccess, message, errors } = await updateProfile(data);
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
    } catch (error) {
      logger(error);
    }
  };
  render() {
    const {
      email,
      firstName,
      lastName,
      contactNumber,
      errors,
      isLoading
    } = this.state;
    return (
      <div className="cr-page px-3">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <CardHeader>
                <h4>
                  <i className="fa fa-edit" />
                  &nbsp;My Profile
                </h4>
              </CardHeader>
              <CardBody>
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
                          className={"floating-input"}
                          onChange={this.handleChange}
                          disabled={true}
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
                        {errors.email ? (
                          <p className={"text-danger"}>{errors.email}</p>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  {/* <PreferedLocation
                    location={preferedLocation}
                    errors={errors.preferedLocation}
                    ref={this.preferedLocation}
                  />
                  <ExactLocation
                    location={exactLocation}
                    errors={errors.exactLocation}
                    ref={this.exactLocation}
                  /> */}

                  <FormGroup row>
                    <Col sm={{ size: 10, offset: 2 }}>
                      {isLoading ? (
                        <LoadingButton />
                      ) : (
                        <Button
                          type="submit"
                          onClick={this.handleSubmit}
                          color={"primary"}
                          className={
                            "pull-right btn-submit btn-submit btn-link"
                          }
                        >
                          Update Profile
                        </Button>
                      )}
                    </Col>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default UpdateDetails;

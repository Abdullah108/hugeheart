import React, { Component } from "react";
import Select from "react-select";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";
import csc from "country-state-city";
export const AustraliaState = [
  "266",
  "273",
  "269",
  "271",
  "270",
  "275",
  "246",
  "267",
];
export const allCountries = csc.getAllCountries();
class ExactLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: "",
      state: "",
      city: "",
      postalCode: "",
      countries: allCountries,
      states: [],
      streetAddress: "",
      addressLine1: "",
      addressLine2: "",
    };
  }
  /**
   *
   */
  componentDidMount() {
    const { isEditMode, location } = this.props;
    console.log(this.props);
    if (isEditMode) {
      const index = allCountries.findIndex((d) => d.name === location.country);
      const countryId = allCountries[index].id;
      this.setState({
        ...location,
        states: csc.getStatesOfCountry(countryId),
      });
    }
  }
  /**
   *
   */
  onCountryChange = (country) => {
    this.setState({
      country: country.value,
      state: "",
      city: "",
      states: csc.getStatesOfCountry(country.id),
    });
  };
  /**
   *
   */
  onStateChange = (state) => {
    this.setState({
      state: state.value,
      city: "",
    });
  };
  /**
   *
   */
  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  /**
   *
   */
  getLocation = () => {
    const {
      city,
      state,
      postalCode,
      country,
      streetAddress,
      addressLine1,
      addressLine2,
    } = this.state;
    console.log("====================================");
    console.log(city, state);
    console.log("====================================");
    return {
      country,
      city,
      state,
      postalCode,
      streetAddress,
      addressLine1,
      addressLine2,
    };
  };
  /**
   *
   */
  render() {
    let { errors } = this.props;
    const {
      country,
      state,
      city,
      postalCode,
      countries,
      states,
      streetAddress,
      addressLine1,
      addressLine2,
    } = this.state;
    const countriesOptions = countries.map((count) => ({
      label: count.name,
      value: count.name,
      id: count.id,
    }));
    if (!errors) {
      errors = {};
    }
    let stateOptions =
      country.toLowerCase() === "australia"
        ? states
            .filter((d) => AustraliaState.indexOf(d.id) > -1)
            .map((stat) => ({
              label: stat.name,
              value: stat.name,
              id: stat.id,
            }))
        : states.map((stat) => ({
            label: stat.name,
            value: stat.name,
            id: stat.id,
          }));
    return (
      <Row>
        <Col sm={"12"}>
          <Label className={"form-label label-heading"}>Exact Location</Label>
          <br />
          <br />
          <br />
        </Col>
        <Col sm="6">
          <FormGroup>
            <Input
              type="text"
              name="streetAddress"
              id="streetAddress"
              value={streetAddress}
              onChange={this.onInputChange}
              className={"floating-input"}
              placeholder={" "}
            />
            <Label className="floating-label form-label" for="streetAddress">
               Street Address
            </Label>
            {errors.streetAddress ? (
              <p className={"text-danger"}>{errors.streetAddress}</p>
            ) : null}
          </FormGroup>
        </Col>
        <Col sm="6">
          <FormGroup>
            <Input
              type="text"
              name="addressLine1"
              id="addressLine1"
              value={addressLine1}
              onChange={this.onInputChange}
              className={"floating-input"}
              placeholder={" "}
            />
            <Label className="floating-label form-label" for="contactNumber">
               Address Line 1
            </Label>
            {errors.streetAddress ? (
              <p className={"text-danger"}>{errors.streetAddress}</p>
            ) : null}
          </FormGroup>
        </Col>
        <Col sm="6">
          <FormGroup>
            <Input
              type="text"
              name="addressLine2"
              id="addressLine2"
              value={addressLine2}
              onChange={this.onInputChange}
              className={"floating-input"}
              placeholder={" "}
            />
            <Label className="floating-label form-label" for="contactNumber">
               Address Line 2
            </Label>
            {errors.streetAddress ? (
              <p className={"text-danger"}>{errors.streetAddress}</p>
            ) : null}
          </FormGroup>
        </Col>
        <Col sm={"6"}></Col>
        <Col sm={"6"}>
          <FormGroup>
            <Label className="form-label" for="contactNumber">
              Country
            </Label>
            <Select
              placeholder={"Select Country"}
              name={"country"}
              value={
                !country
                  ? undefined
                  : {
                      label: country,
                      value: country,
                    }
              }
              options={countriesOptions}
              onChange={this.onCountryChange}
            />
            {errors.country ? (
              <p className={"text-danger"}>{errors.country}</p>
            ) : null}
          </FormGroup>
        </Col>
        <Col sm={"6"}>
          <FormGroup>
            <Label className="form-label" for="contactNumber">
              State
            </Label>
            <Select
              placeholder={"Select State"}
              name={"state"}
              value={
                !state
                  ? undefined
                  : {
                      label: state,
                      value: state,
                    }
              }
              options={stateOptions}
              onChange={this.onStateChange}
            />

            {errors.state ? (
              <p className={"text-danger"}>{errors.state}</p>
            ) : null}
          </FormGroup>
        </Col>

        <Col sm={"6"}>
          <FormGroup>
            <Input
              type="text"
              name="city"
              id="city"
              value={city}
              onChange={this.onInputChange}
              className={"floating-input"}
              placeholder={" "}
            />
            <Label className="floating-label form-label" for="contactNumber">
              City
            </Label>
            {errors.city ? (
              <p className={"text-danger"}>{errors.city}</p>
            ) : null}
          </FormGroup>
        </Col>

        <Col sm={"6"}>
          <FormGroup>
            <Input
              type="text"
              name="postalCode"
              id="postalCode"
              value={postalCode}
              onChange={this.onInputChange}
              className={"floating-input"}
              placeholder={" "}
            />
            <Label className="floating-label form-label" for="contactNumber">
              Postal Code
            </Label>
            {errors.postalCode ? (
              <p className={"text-danger"}>{errors.postalCode}</p>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
    );
  }
}

export default ExactLocation;

import React from 'react'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Grid, Button, Dropdown } from 'semantic-ui-react';

const COUNTRIES = Object.keys(Countries).map((country, index) => ({
    key: index,
    text: country,
    value: country,
}))

export class Address extends React.Component {
    constructor(props) {
        super(props)

        const details = props.addressData ?
            Object.assign({}, props.details)
            : {
                number: "",
                street: "",
                suburb: "",
                city: "",
                country: "",
                postCode: "",
            }

        this.state = {
            showEditSection: false,
            newAddress: details
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.handleChangeCountry = this.handleChangeCountry.bind(this);
        this.updateAddress = this.updateAddress.bind(this);
        this.saveAddress = this.saveAddress.bind(this);
    }

    openEdit() {
        const details = Object.assign({}, this.props.addressData)
        this.setState({
            showEditSection: true,
            newAddress: details
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        this.updateAddress(event.target)
    }

    updateAddress({ name, value }) {
        console.log(name, value);
        const data = Object.assign({}, this.state.newAddress)
        data[name] = value;
        this.setState({
            newAddress: data
        })
    }

    saveAddress() {
        console.log(this.state.newAddress)
        const data = Object.assign({}, this.state.newAddress)
        this.props.saveProfileData('address', data)
        this.closeEdit()
    }

    handleChangeCountry(e, { name, value }) {
        this.updateAddress({ name, value })
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        const { number, street, suburb, country, city, postCode } = this.state.newAddress;

        return (
            <Grid className='sixteen wide column'>
                <Grid.Row columns={3}>
                    <Grid.Column width={4}>
                        <ChildSingleInput
                            inputType="text"
                            label="Number"
                            name="number"
                            value={number}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Enter your address number"
                            errorMessage="Please enter a valid first address number"
                            />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <ChildSingleInput
                            inputType="text"
                            label="Street"
                            name="street"
                            value={street}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Enter your middle address street"
                            errorMessage="Please enter a valid address street"
                        />
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <ChildSingleInput
                            inputType="text"
                            label="Suburb"
                            name="suburb"
                            value={suburb}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Enter your address surburb"
                            errorMessage="Please enter a valid address surburb"
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={3}>
                    <Grid.Column width={6} className="field">
                        <label>Country</label>
                        <Dropdown
                            placeholder='Select Country'
                            fluid
                            selection
                            search
                            name="country"
                            value={country}
                            onChange={this.handleChangeCountry}
                            options={COUNTRIES}
                        />
                    </Grid.Column>
                    <Grid.Column width={6} className="field">
                        <label>City</label>
                        <Dropdown
                            placeholder='Select City'
                            fluid
                            name="city"
                            selection
                            search
                            onChange={this.handleChangeCountry}
                            options={(country && country.length > 0) ? Countries[country].map((city, index) => ({
                                key: index,
                                text: city,
                                value: city
                            })) : []}
                        />
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <ChildSingleInput
                            inputType="text"
                            label="Post Code"
                            name="postCode"
                            value={postCode}
                            controlFunc={this.handleChange}
                            maxLength={12}
                            placeholder="Enter your address postCode"
                            errorMessage="Please enter a valid address postCode"
                        />
                    </Grid.Column>
                </Grid.Row>

                <button type="button" className="ui teal button" onClick={this.saveAddress}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </Grid>
        )
    }

    renderDisplay() {
        const { city, country, number, postCode, street, suburb } = this.props.addressData;
        let fullAddress = number ? number : "";
        fullAddress += (street && street.length > 0) ? (", " + street) : "";
        fullAddress += (suburb && suburb.length > 0) ? (", " + suburb) : "";
        fullAddress += (postCode && postCode !== 0) ? (", " + postCode) : '';

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Address: {fullAddress}</p>
                        <p>City: {city}</p>
                        <p>Country: {country}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }
}

export class Nationality extends React.Component {
    constructor(props) {
        super(props)

        this.saveNationality = this.saveNationality.bind(this);
    }

    saveNationality(e, { value }) {
        console.log(value)
        this.props.saveProfileData('nationality', value)
    }

    
    render() {
        const { nationalityData } = this.props;
        return (
            <Grid className='sixteen wide column'>
                <Grid.Column width={6}>
                    <Dropdown
                        placeholder='Select your nationality'
                        fluid
                        selection
                        search
                        name="nationalityData"
                        value={nationalityData}
                        onChange={this.saveNationality}
                        options={COUNTRIES}
                    />
                    </Grid.Column>
            </Grid>
        )
        
    }
}
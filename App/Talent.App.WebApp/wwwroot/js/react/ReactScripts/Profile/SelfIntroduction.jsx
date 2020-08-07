/* Self introduction section */
import React, { Component } from 'react';
import { Input, Button } from 'semantic-ui-react';
import Cookies from 'js-cookie'

const MAX_LENGTH_SUMMARY = 150;
const MAX_LENGTH_DESC = 600;
const MIN_LENGTH_DESC = 150;

export default class SelfIntroduction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSummary: "",
            currentDescription: "",
            isValidSummary: true,
            isValidDescription: true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    };

    handleChange(name, value) {
        if (name === 'summary') {
            if (value.length > 150) {
                this.setState({ isValidSummary: false });
            } else {
                this.setState({
                    isValidSummary: true,
                    currentSummary: value,
                });
            }
        } else if (name === 'description') {
            if (value.length > 600) {
                this.setState({ isValidDescription: false });
            } else {
                this.setState({
                    isValidDescription: true,
                    currentDescription: value,
                });
            }
        }
    }

    updateProfile() {
        this.props.updateProfileData("", { "summary": this.state.currentSummary, "description": this.state.currentDescription });
    }

    componentDidUpdate(prepProps) {
        if (this.props.summary !== prepProps.summary)
            this.setState({ currentSummary: this.props.summary });

        if (this.props.description !== prepProps.description)
            this.setState({ currentDescription: this.props.description });
    }

    render() {
        const characterLimit = 600;
        let characters = this.props.description ? this.props.description.length : 0;

        return (
            <React.Fragment>
                <div className="four wide column">
                    <h3>Description</h3>
                    <div className="tooltip">Write a description of your company.</div>
                </div>
                <div className="ten wide column">
                    <Input fluid value={this.state.currentSummary} error={this.state.isValidSummary} onChange={(e) => this.handleChange('summary', e.target.value)} placeholder='Please provide a short summary about yourself' />
                    <h5>Summary must be no more than 150 characters.</h5>
                    <div className="field" >
                        <textarea maxLength={characterLimit} name="Description" placeholder="Please tell us about any hobbies, additional expertise, or anything else you’d like to add."
                            value={this.state.currentDescription} onChange={(e) => this.handleChange('description', e.target.value)} ></textarea>
                    </div>
                    <h5>Description must be between 150-600 characters</h5>
                    <Button type="button" onClick={this.updateProfile} secondary floated="right">Save</Button>
                </div>
            </React.Fragment>
        )
    }
}




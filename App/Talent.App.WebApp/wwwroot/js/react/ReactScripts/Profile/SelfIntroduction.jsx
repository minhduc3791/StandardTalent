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
            isValidSummary: true,
            isValidDescription: true,
        };
        this.handleChange = this.handleChange.bind(this);
    };

    handleChange(event) {
        let data = {};
        data[event.target.name] = event.target.value;
        this.props.updateStateData(data);
        let description = event.target.value;
        this.setState({
            characters: description.length
        })
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
                    <Input fluid value={this.props.summary} error={this.state.isValidSummary} onChange={this.handleChange} placeholder='Please provide a short summary about yourself' />
                    <h5>Summary must be no more than 150 characters.</h5>
                    <div className="field" >
                        <textarea maxLength={characterLimit} name="Description" placeholder="Please tell us about any hobbies, additional expertise, or anything else you’d like to add."
                            value={this.props.description} onChange={this.update} ></textarea>
                    </div>
                    <h5>Description must be between 150-600 characters</h5>
                    <Button secondary floated="right">Save</Button>
                </div>
            </React.Fragment>
        )
    }
}




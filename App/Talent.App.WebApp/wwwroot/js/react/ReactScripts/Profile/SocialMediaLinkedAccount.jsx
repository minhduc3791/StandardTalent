/* Social media JSX */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Button, Icon } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showEditSection: false,
            newLinkedAccount: {
                linkedIn: "",
                github: "",
            }
        }

        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.saveLinkedAccount = this.saveLinkedAccount.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        $('.ui.button.social-media')
            .popup();
    }

    openEdit() {
        this.setState({
            showEditSection: true,
            newLinkedAccount: Object.assign({}, this.props.linkedAccounts)
        });
    }

    closeEdit() {
        this.setState({ showEditSection: false });
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newLinkedAccount)
        data[event.target.name] = event.target.value
        this.setState({
            newLinkedAccount: data
        })
    }

    saveLinkedAccount() {
        const data = Object.assign({}, this.state.newLinkedAccount)
        this.props.saveProfileData('linkedAccounts', data)
        this.closeEdit();
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderDisplay() {
        const { linkedIn, github } = this.props.linkedAccounts

        return (
            <div className='ui sixteen wide column'>
                {linkedIn && <Button as='a' href={linkedIn} target="_blank" primary><Icon name="linkedin" />LinkedIn</Button>}
                {github && <Button as='a' href={github} target="_blank" secondary><Icon name="github" />GitHub</Button>}
                <Button floated="right" color="black" onClick={this.openEdit}>Edit</Button>
            </div>
        )
    }

    renderEdit() {
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="LinkedIn"
                    name="linkedIn"
                    value={this.state.newLinkedAccount.linkedIn}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your LinkedIn Url"
                    errorMessage="Please enter a valid LinkedIn url"
                />
                <ChildSingleInput
                    inputType="text"
                    label="GitHub"
                    name="github"
                    value={this.state.newLinkedAccount.github}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your GitHub Url"
                    errorMessage="Please enter a valid GitHub url"
                />

                <button type="button" className="ui teal button" onClick={this.saveLinkedAccount}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }
}
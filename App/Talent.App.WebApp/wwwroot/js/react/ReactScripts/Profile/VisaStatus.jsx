import React from 'react'
import { SingleInput } from '../Form/SingleInput.jsx';
import DatePicker from 'react-datepicker'
import moment from 'moment';
import { Grid, Dropdown, Button } from 'semantic-ui-react'

const VISA_TYPE = [
    { key: 1, text: "Citizen", value: "Citizen" },
    { key: 2, text: "Permanent Resident", value: "Permanent Resident" },
    { key: 3, text: "Work Visa", value: "Work Visa" },
    { key: 4, text: "Student Visa", value: "Student Visa" },
]

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            newVisaStatus: props.visaStatus ? props.visaStatus : "",
            newVisaExpiryDate: props.visaExpiryDate ? props.visaExpiryDate : moment(),
        }

        this.handleChange = this.handleChange.bind(this);
        this._updateProfileData = this._updateProfileData.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.visaStatus !== prevProps.visaStatus) {
            this.setState({
                newVisaStatus: this.props.visaStatus,
                newVisaExpiryDate: this.props.visaExpiryDate ? moment(this.props.visaExpiryDate) : moment(),
            });
        }
    }

    handleChange(name, value) {
        console.log(name, value);
        this.setState({ [name]: value });
    }

    _updateProfileData() {
        this.props.updateProfileData("", { visaStatus: this.state.newVisaStatus, visaExpiryDate: this.state.newVisaExpiryDate })
    }

    render() {
        const { newVisaStatus, newVisaExpiryDate } = this.state;
        return (
            <div className='ui sixteen wide column'>
                <Grid className='add-language-header'>
                    <Grid.Row width={16}>
                        <Grid.Column width={7}>
                            <h5>Visa type</h5>
                            <Dropdown
                                placeholder='Select your nationality'
                                fluid
                                selection
                                search
                                name="newVisaStatus"
                                value={newVisaStatus}
                                onChange={(e, { value }) => this.handleChange("newVisaStatus", value)}
                                options={VISA_TYPE}
                            />
                        </Grid.Column>
                        {(newVisaStatus === "Work Visa" || newVisaStatus === "Student Visa") &&
                            <Grid.Column width={7} className="full-width">
                                <h5>Visa expiry date</h5>
                                <DatePicker
                                    selected={newVisaExpiryDate}
                                    onChange={(date) => this.handleChange('newVisaExpiryDate', date)}
                                />
                            </Grid.Column>
                        }
                        <Grid.Column width={2}>
                            <Button type="button" onClick={this._updateProfileData} secondary style={{ marginTop: '30px' }}>Save</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )

    }
}
/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Button, Checkbox, Icon, Table, Grid, Input, GridColumn } from 'semantic-ui-react';

export default class Experience extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAddExperience: false,
            showEditExperience: false,
            newExperience: {
                id: props.experienceData.length,
                company: "",
                position: "",
                responsibilities: "",
                start: moment(),
                end: moment(),
            },
            editExperience: {
                id: "",
                company: "",
                position: "",
                responsibilities: "",
                start: moment(),
                end: moment(),
            }
        }

        this.toggleAddExperience = this.toggleAddExperience.bind(this);
        this.toggleEditExperience = this.toggleEditExperience.bind(this);

        this.handleChangeNameValue = this.handleChangeNameValue.bind(this);

        this.addExperience = this.addExperience.bind(this);
        this.initEditExperience = this.initEditExperience.bind(this);
        this.deleteExperience = this.deleteExperience.bind(this);
        this.doEditExperience = this.doEditExperience.bind(this);
    }

    handleChangeNameValue(name, value) {
        const names = name.split('.');
        const data = Object.assign({}, this.state[names[0]]);
        data[names[1]] = value;
        this.setState({ [names[0]]: data });
    }

    addExperience() {
        this.toggleAddExperience();
        this.props.updateProfileData('experience', [...this.props.experienceData, this.state.newExperience]);
    }

    toggleAddExperience() {
        this.setState(prevState => ({ showAddExperience: !prevState.showAddExperience }));
    }

    toggleEditExperience() {
        this.setState(prevState => ({ showEditExperience: !prevState.showEditExperience }));
    }

    initEditExperience(data) {
        this.toggleEditExperience();
        console.log(data);
        data.start = moment(data.start);
        data.end = moment(data.end);
        this.setState({ editExperience: data }, () => { console.log(this.state.editExperience) });
    }

    doEditExperience() {
        const data = [...this.props.experienceData].map(d => {
            if (d.id === this.state.editExperience.id) {
                return this.state.editExperience;
            } else {
                return d;
            }
        });

        this.toggleEditExperience();
        this.props.updateProfileData('experience', data);
    }

    deleteExperience(id) {
        const data = [...this.props.experienceData].filter(d => d.id !== id);
        this.props.updateProfileData('experience', data);
    }

    render() {
        return (
            <div className='ui sixteen wide column'>
                {this.state.showAddExperience &&
                    <Grid className="add-language-header">
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <h5>Company: </h5>
                            <Input fluid placeholder="Company" name="company"
                                value={this.state.newExperience.company}
                                onChange={(e) => this.handleChangeNameValue('newExperience.company', e.target.value)} />
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <h5>Position: </h5>
                            <Input fluid placeholder="Position" name="position"
                                value={this.state.newExperience.position}
                                onChange={(e) => this.handleChangeNameValue('newExperience.position', e.target.value)} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row width={8}>
                            <Grid.Column width={8} className="full-width">
                                <h5>Start Date: </h5>
                                <DatePicker
                                    selected={this.state.newExperience.start}
                                    onChange={(date) => this.handleChangeNameValue('newExperience.start', date)}
                                />
                            </Grid.Column>
                            <Grid.Column width={8} className="full-width">
                                <h5>End Date: </h5>
                                <DatePicker
                                    
                                    selected={this.state.newExperience.end}
                                onChange={(date) => this.handleChangeNameValue('newExperience.end', date)}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <h5>Responsibilities: </h5>
                            <Input fluid placeholder="Responsibilities" name="responsibilities"
                                value={this.state.newExperience.responsibilities}
                                onChange={(e) => this.handleChangeNameValue('newExperience.responsibilities', e.target.value)} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Button type="button" className="add-language-button" secondary onClick={this.addExperience}>Add</Button>
                                <Button onClick={this.toggleAddExperience}>Cancel</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                }
                <div>
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Company</Table.HeaderCell>
                                <Table.HeaderCell>Position</Table.HeaderCell>
                                <Table.HeaderCell>Responsibilities</Table.HeaderCell>
                                <Table.HeaderCell>Start</Table.HeaderCell>
                                <Table.HeaderCell>End</Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Button
                                        type="button"
                                        floated='right'
                                        icon
                                        labelPosition='left'
                                        secondary
                                        onClick={this.toggleAddExperience}
                                    >
                                        <Icon name='plus' /> Add New
                                    </Button>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.showEditExperience &&
                                <Table.Row>
                                <Table.Cell colSpan='6'>
                                    <Grid className="add-language-header" style={{width: '100%'}}>
                                        <Grid.Row>
                                            <Grid.Column width={8}>
                                                <h5>Company: </h5>
                                                <Input fluid placeholder="Company" name="company"
                                                    value={this.state.editExperience.company}
                                                    onChange={(e) => this.handleChangeNameValue('editExperience.company', e.target.value)} />
                                            </Grid.Column>
                                            <Grid.Column width={8}>
                                                <h5>Position: </h5>
                                                <Input fluid placeholder="Position" name="position"
                                                    value={this.state.editExperience.position}
                                                    onChange={(e) => this.handleChangeNameValue('editExperience.position', e.target.value)} />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row width={8}>
                                            <Grid.Column width={8} className="full-width">
                                                <h5>Start Date: </h5>
                                                <DatePicker
                                                    selected={this.state.editExperience.start}
                                                    onChange={(date) => this.handleChangeNameValue('editExperience.start', date)}
                                                />
                                            </Grid.Column>
                                            <Grid.Column width={8} className="full-width">
                                                <h5>End Date: </h5>
                                                <DatePicker
                                                    selected={this.state.editExperience.end}
                                                    onChange={(date) => this.handleChangeNameValue('editExperience.end', date)}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column width={16}>
                                                <h5>Responsibilities: </h5>
                                                <Input fluid placeholder="Responsibilities" name="responsibilities"
                                                    value={this.state.editExperience.responsibilities}
                                                    onChange={(e) => this.handleChangeNameValue('editExperience.responsibilities', e.target.value)} />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column width={16}>
                                                <Button type="button" onClick={this.doEditExperience} basic color="blue">Update</Button>
                                                <Button type="button" basic color="red" onClick={this.toggleEditExperience}>Cancel</Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                    </Table.Cell>
                                </Table.Row>
                            }
                            {this.props.experienceData.map(({ id, company, position, responsibilities, start, end }) => (
                                <Table.Row key={id}>
                                    <Table.Cell>{company}</Table.Cell>
                                    <Table.Cell>{position}</Table.Cell>
                                    <Table.Cell>{responsibilities}</Table.Cell>
                                    <Table.Cell>{moment(start).format("do MMM, YYYY")}</Table.Cell>
                                    <Table.Cell>{moment(end).format("do MMM, YYYY")}</Table.Cell>
                                    <Table.Cell>
                                        <Grid columns="16">
                                            {!this.state.showEditExperience &&
                                                <Grid.Column width={5} floated="right">
                                                    <Icon onClick={() => this.initEditExperience({ id, company, position, responsibilities, start, end })} name="pencil" />
                                                    <Icon onClick={() => this.deleteExperience(id)} name="delete" />
                                                </Grid.Column>
                                            }
                                        </Grid>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        )
    }
}

/* Skill section */
import React from 'react';
import Cookies from 'js-cookie';
import { Button, Checkbox, Icon, Table, Grid, Input, Dropdown } from 'semantic-ui-react';

const SKILL_LEVEL = [
    { key: 1, text: "Beginnner", value: "Beginnner" },
    { key: 2, text: "Intermediate", value: "Intermediate" },
    { key: 3, text: "Expert", value: "Expert" },
]

export default class Skill extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAddSkill: false,
            showEditSkill: false,
            newSkill: {
                id: "",
                name: "",
                level: "",
            },
            editSkill: {
                id: "",
                name: "",
                level: "",
            },
            invalidSkillName: false,
            invalidSkillLevel: false,
            invalidEditSkillName: false,
            invalidEditSkillLevel: false,
        }

        this.toggleAddSkill = this.toggleAddSkill.bind(this);
        this.toggleEditSkill = this.toggleEditSkill.bind(this);

        this.addSkill = this.addSkill.bind(this);
        this.cancelAddSkill = this.cancelAddSkill.bind(this);
        this.initEditSkill = this.initEditSkill.bind(this);
        this.deleteSkill = this.deleteSkill.bind(this);
        this.doEditSkill = this.doEditSkill.bind(this);

        this.updateEditSkill = this.updateEditSkill.bind(this);
        this.handleEditName = this.handleEditName.bind(this);
        this.handleEditLevel = this.handleEditLevel.bind(this);

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeLevel = this.handleChangeLevel.bind(this);
        this.updateSkill = this.updateSkill.bind(this);
    }

    handleChangeName(e) {
        this.updateSkill(e.target)
    }

    handleChangeLevel(e, { value }) {
        this.updateSkill({ name: 'level', value: value });
    }

    updateSkill({ name, value }) {
        const data = Object.assign({}, this.state.newSkill)
        data[name] = value;
        this.setState({ newSkill: data });
    }

    updateEditSkill({ name, value }) {
        const data = Object.assign({}, this.state.editSkill)
        data[name] = value;
        this.setState({ editSkill: data }, () => { console.log(this.state.editSkill) });
    }

    handleEditName(e) {
        this.updateEditSkill(e.target)
    }

    handleEditLevel(e, { value }) {
        this.updateEditSkill({ name: 'level', value: value });
    }

    addSkill() {
        const { name, level } = this.state.newSkill;
        if (!name || name.length === 0) {
            this.setState({ invalidSkillName: true });
            return;
        }
        this.setState({ invalidSkillName: false });
        if (!level) {
            this.setState({ invalidSkillLevel: true });
            return;
        }
        this.setState({ invalidSkillLevel: false });
        this.toggleAddSkill();
        const index = this.props.skillData.length;
        this.updateSkill({ name: "id", value: index });
        this.props.updateProfileData('skills', [...this.props.skillData, { id: index, name: this.state.newSkill.name, level: this.state.newSkill.level }])
    }

    cancelAddSkill() {
        this.toggleAddSkill();
        this.updateSkill({ name: "name", value: "" });
        this.updateSkill({ name: "level", value: "" });
    }

    toggleAddSkill() {
        this.setState(prevState => ({ showAddSkill: !prevState.showAddSkill }));
    }

    toggleEditSkill() {
        this.setState(prevState => ({ showEditSkill: !prevState.showEditSkill }));
    }

    initEditSkill({ id, name, level }) {
        this.toggleEditSkill();
        const data = { id, name, level };
        this.setState({ editSkill: data });
    }

    doEditSkill() {
        const { name, level } = this.state.editSkill;
        if (!name || name.length === 0) {
            this.setState({ invalidEditSkillName: true });
            return;
        }
        this.setState({ invalidEditSkillName: false });
        if (!level) {
            this.setState({ invalidEditSkillLevel: true });
            return;
        }
        this.setState({ invalidEditSkillLevel: false });

        const data = [...this.props.skillData].map(d => {
            if (d.id === this.state.editSkill.id) {
                return this.state.editSkill;
            } else {
                return d;
            }
        });

        this.toggleEditSkill();
        this.props.updateProfileData('skills', data);
    }

    deleteSkill(id) {
        const data = [...this.props.skillData].filter(d => d.id !== id);
        this.props.updateProfileData('skills', data);
    }

    render() {
        const { invalidEditSkillLevel, invalidEditSkillName, invalidSkillLevel, invalidSkillName } = this.state;
        return (
            <div className='ui sixteen wide column'>
                {this.state.showAddSkill &&
                    <Grid className="add-language-header">
                        <Input error={invalidSkillName} placeholder="Add Skill" name="name" value={this.state.newSkill.name} onChange={this.handleChangeName} />
                        <Dropdown
                            error={invalidSkillLevel}
                            className="add-language-dropdown"
                            placeholder='Skill Level'
                            selection
                            name="level"
                            value={this.state.newSkill.level}
                            onChange={this.handleChangeLevel}
                            options={SKILL_LEVEL}
                        />
                        <Button type="button" className="add-language-button" secondary onClick={this.addSkill}>Add</Button>
                        <Button onClick={this.cancelAddSkill}>Cancel</Button>
                    </Grid>
                }
                <div>
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Skill</Table.HeaderCell>
                                <Table.HeaderCell>Level</Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Button
                                        type="button"
                                        floated='right'
                                        icon
                                        labelPosition='left'
                                        secondary
                                        onClick={this.toggleAddSkill}
                                    >
                                        <Icon name='plus' /> Add New
                                    </Button>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.showEditSkill &&
                                <Table.Row>
                                    <Table.Cell>
                                        <Input error={invalidEditSkillName} name="name" value={this.state.editSkill.name} onChange={this.handleEditName} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Dropdown
                                            error={invalidEditSkillLevel}
                                            placeholder='Skill Level'
                                            selection
                                            name="level"
                                            value={this.state.editSkill.level}
                                            onChange={this.handleEditLevel}
                                            options={SKILL_LEVEL}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Grid.Column width={8}>
                                            <Button type="button" onClick={this.doEditSkill} basic color="blue">Update</Button>
                                            <Button type="button" basic color="red" onClick={this.toggleEditSkill}>Cancel</Button>
                                        </Grid.Column>
                                    </Table.Cell>
                                </Table.Row>
                            }
                            {this.props.skillData.map(({ id, level, name }) => (
                                <Table.Row key={id}>
                                    <Table.Cell>{name}</Table.Cell>
                                    <Table.Cell>{level}</Table.Cell>
                                    <Table.Cell>
                                        <Grid columns="16">
                                            {!this.state.showEditSkill &&
                                                <Grid.Column width={3} floated="right">
                                                    <Icon onClick={() => this.initEditSkill({ id, level, name })} name="pencil" />
                                                    <Icon onClick={() => this.deleteSkill(id)} name="delete" />
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


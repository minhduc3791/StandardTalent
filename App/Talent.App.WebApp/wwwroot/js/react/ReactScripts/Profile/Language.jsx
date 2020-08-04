/* Language section */
import React from 'react';
import Cookies from 'js-cookie';
import { Button, Checkbox, Icon, Table, Grid, Input, Dropdown } from 'semantic-ui-react';

const LANGUAGE_LEVEL = [
    { key: 1, text: "Basic", value: "Basic"},
    { key: 2, text: "Conversational", value: "Conversational"},
    { key: 3, text: "Fluent", value: "Fluent"},
    { key: 4, text: "Native/Bilingual", value: "Native/Bilingual"},
]

export default class Language extends React.Component {
    constructor(props) {
        super(props);
       
        this.state = {
            showAddLanguage: false,
            showEditLanguage: false,
            newLanguage: {
                id: "",
                name: "",
                level: "",
            },
            editLanguage: {
                id: "",
                name: "",
                level: "",
            }
        }

        this.toggleAddLanguage = this.toggleAddLanguage.bind(this);
        this.toggleEditLanguage = this.toggleEditLanguage.bind(this);
        
        this.addLanguage = this.addLanguage.bind(this);
        this.cancelAddLanguage = this.cancelAddLanguage.bind(this);
        this.initEditLanguage = this.initEditLanguage.bind(this);
        this.deleteLanguage = this.deleteLanguage.bind(this);
        this.doEditLanguage = this.doEditLanguage.bind(this);

        this.updateEditLanguage = this.updateEditLanguage.bind(this);
        this.handleEditName = this.handleEditName.bind(this);
        this.handleEditLevel = this.handleEditLevel.bind(this);

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeLevel = this.handleChangeLevel.bind(this);
        this.updateLanguage = this.updateLanguage.bind(this);
    }

    handleChangeName(e) {
        this.updateLanguage(e.target)
    }

    handleChangeLevel(e, { value }) {
        this.updateLanguage({ name: 'level', value: value });
    }

    updateLanguage({ name, value }) {
        const data = Object.assign({}, this.state.newLanguage)
        data[name] = value;
        this.setState({ newLanguage: data });
    }

    updateEditLanguage({ name, value }) {
        const data = Object.assign({}, this.state.editLanguage)
        data[name] = value;
        this.setState({ editLanguage: data }, () => { console.log(this.state.editLanguage) });
    }

    handleEditName(e) {
        this.updateEditLanguage(e.target)
    }

    handleEditLevel(e, { value }) {
        this.updateEditLanguage({ name: 'level', value: value });
    }

    addLanguage() {
        const index = this.props.languageData.length;
        this.updateLanguage({ name: "id", value: index });
        this.props.updateProfileData('languages', [...this.props.languageData, { id: index, name: this.state.newLanguage.name, level: this.state.newLanguage.level }])
    }

    cancelAddLanguage() {
        this.toggleAddLanguage();
        this.updateLanguage({ name: "name", value: "" });
        this.updateLanguage({ name: "level", value: "" });
    }

    toggleAddLanguage() {
        this.setState(prevState => ({ showAddLanguage: !prevState.showAddLanguage }));
    }

    toggleEditLanguage() {
        this.setState(prevState => ({ showEditLanguage: !prevState.showEditLanguage }));
    }

    initEditLanguage({ id, name, level}) {
        this.toggleEditLanguage();
        const data = { id, name, level };
        this.setState({ editLanguage: data });
    }

    doEditLanguage() {
        const data = [...this.props.languageData].map(d => {
            if (d.id === this.state.editLanguage.id) {
                return this.state.editLanguage;
            } else {
                return d;
            }
        });

        this.toggleEditLanguage();
        this.props.updateProfileData('languages', data);
    }

    deleteLanguage() {

    }

    render() {
        return (
            <div className='ui sixteen wide column'>
                {this.state.showAddLanguage &&
                    <Grid className="add-language-header">
                        <Input placeholder="Add Language" name="name" value={this.state.newLanguage.name} onChange={this.handleChangeName} />
                        <Dropdown
                            className="add-language-dropdown"
                            placeholder='Language Level'
                            selection
                            name="level"
                            value={this.state.newLanguage.level}
                            onChange={this.handleChangeLevel}
                            options={LANGUAGE_LEVEL}
                        />
                        <Button type="button" className="add-language-button" secondary onClick={this.addLanguage}>Add</Button>
                        <Button onClick={this.cancelAddLanguage}>Cancel</Button>
                    </Grid>
                }
                <div>
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Language</Table.HeaderCell>
                                <Table.HeaderCell>Level</Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Button
                                        type="button"
                                        floated='right'
                                        icon
                                        labelPosition='left'
                                        secondary
                                        onClick={this.toggleAddLanguage}
                                    >
                                        <Icon name='plus' /> Add New
                                    </Button>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.showEditLanguage &&
                                <Table.Row>
                                    <Table.Cell>
                                        <Input name="name" value={this.state.editLanguage.name} onChange={this.handleEditName} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Dropdown
                                            placeholder='Language Level'
                                            selection
                                            name="level"
                                            value={this.state.editLanguage.level}
                                            onChange={this.handleEditLevel}
                                            options={LANGUAGE_LEVEL}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Grid.Column width={8}>
                                            <Button type="button" onClick={this.doEditLanguage} basic color="blue">Update</Button>
                                            <Button type="button" basic color="red" onClick={this.toggleEditLanguage}>Cancel</Button>
                                        </Grid.Column>
                                    </Table.Cell>
                                </Table.Row>
                            }
                            {this.props.languageData.map(({ id, level, name}) => (
                                <Table.Row key={id}>
                                    <Table.Cell>{name}</Table.Cell>
                                    <Table.Cell>{level}</Table.Cell>
                                    <Table.Cell>
                                        <Grid columns="16">
                                            {!this.state.showEditLanguage &&
                                                <Grid.Column width={3} floated="right">
                                                <Icon onClick={() => this.initEditLanguage({id, level, name})} name="pencil" />
                                                    <Icon onClick={this.deleteLanguage} name="delete" />
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
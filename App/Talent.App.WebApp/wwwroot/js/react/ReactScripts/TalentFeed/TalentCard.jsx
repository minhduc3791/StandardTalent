﻿import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types'
import { Popup, Icon, Card, Segment, Button, Grid, GridColumn } from 'semantic-ui-react'

const DEFAULT_IMAGE = 'http://semantic-ui.com/images/avatar/small/jenny.jpg'

export default class TalentCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: true,
        }

        this.toggleViewMode = this.toggleViewMode.bind(this);
    };

    toggleViewMode() {
        this.setState(prevState => ({ viewMode: !prevState.viewMode }));
    }
    
    render() {
        const { name, photoId, skills, currentEmployment, visa } = this.props;
        return (
            <Segment>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={14}>
                            <h4>{name}</h4>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Icon name="star" size="large"/>
                        </Grid.Column>
                    </Grid.Row>
                    {this.state.viewMode ?
                        <Grid.Row className="talent-card-content">
                            <Grid.Column width={16} className="full-div">
                                <video width="100%" height="100%" controls>
                                </video>
                            </Grid.Column>
                        </Grid.Row>
                        :
                        <Grid.Row className="talent-card-content">
                            <Grid.Column width={8} className="full-div">
                                {photoId ?
                                    <img src={'http://localhost:60290' + photoId} /> :
                                    <img src={DEFAULT_IMAGE} />
                                }
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Grid.Row>
                                    <h4>Talent snapshot</h4>
                                </Grid.Row>
                                <Grid.Row>
                                    <label>CURRENT EMPLOYER</label>
                                    <p>{(currentEmployment && currentEmployment.company) ? currentEmployment.company : ""}</p>
                                </Grid.Row>
                                <Grid.Row>
                                    <label>VISA STATUS</label>
                                    <p>{visa}</p>
                                </Grid.Row>
                                <Grid.Row>
                                    <label>POSITION</label>
                                    <p>{(currentEmployment && currentEmployment.position) ? currentEmployment.position : ""}</p>
                                </Grid.Row>
                            </Grid.Column>
                        </Grid.Row>
                    }
                    <Grid.Row className="talent-card-link" centered>
                        <Grid.Column width={3}>
                            <Button basic icon onClick={this.toggleViewMode}>
                            {this.state.viewMode ?
                                <Icon name="user" size="large"  />
                                :
                                <Icon name="video" size="large"/>
                            }
                            </Button>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Button basic icon>
                                <Icon name="file pdf outline" size="large" />
                            </Button>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Button basic icon>
                                <Icon name="linkedin" size="large" />
                            </Button>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Button basic icon>
                                <Icon name="github" size="large" />
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            {skills.map(skill => 
                                <Button type="button" color="blue" basic>{skill}</Button>
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}


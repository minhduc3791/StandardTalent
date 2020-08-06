import React from 'react'
import { Form, Radio } from 'semantic-ui-react';
import { SingleInput } from '../Form/SingleInput.jsx';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value) {
        const data = Object.assign({}, this.props.status)
        data.status = value;
        this.props.saveProfileData("jobSeekingStatus", data);
    }
    
    render() {
        const { status } = this.props;
        return (
            <div className='ui sixteen wide column'>
                <Form>
                    <Form.Field>
                        <h5>Current Status</h5>
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='Actively looking for a job'
                            name='radioGroup'
                            value='Actively looking for a job'
                            checked={status && status.status && status.status === 'Actively looking for a job'}
                            onChange={(e, { value }) => this.handleChange(value)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='Not looking for a job at the moment'
                            name='radioGroup'
                            value='Not looking for a job at the moment'
                            checked={status && status.status && status.status === 'Not looking for a job at the moment'}
                            onChange={(e, { value }) => this.handleChange(value)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='Currently employed but open to offers'
                            name='radioGroup'
                            value='Currently employed but open to offers'
                            checked={status && status.status && status.status === 'Currently employed but open to offers'}
                            onChange={(e, { value }) => this.handleChange(value)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='Will be available on later date'
                            name='radioGroup'
                            value='Will be available on later date'
                            checked={status && status.status && status.status === 'Will be available on later date'}
                            onChange={(e, { value }) => this.handleChange(value)}
                        />
                    </Form.Field>
                </Form>
            </div>
        )
    }
}
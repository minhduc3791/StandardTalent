import React from 'react';
import { Loader, Card, Icon, Image, Grid } from 'semantic-ui-react';

export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        const { companyContact } = this.props.profile ? this.props.profile : {};
        return (
            <Card>
                <Card.Content>
                    <Image src='/images/no-image.png' circular bordered size="mini" centered style={{marginLeft : '100px'}} />
                    <Card.Header style={{ marginLeft: '70px', marginTop: '10px' }}>{(companyContact && companyContact.name) ? companyContact.name : ""}</Card.Header>
                    <Card.Meta>
                        <span className='date' style={{ marginLeft: '55px' }}>
                            <Icon name="point" />{(companyContact && companyContact.location && companyContact.location.city) ? companyContact.location.city : ""}
                            {(companyContact && companyContact.location && companyContact.location.city && companyContact.location.country) ? ", " : ""}
                            {(companyContact && companyContact.location && companyContact.location.country) ? companyContact.location.country : ""}
                        </span>
                    </Card.Meta>
                    <Card.Description>
                     </Card.Description>
                </Card.Content>
                <Card.Content extra>
                        <Icon name='call' />: {(companyContact && companyContact.phone) ? companyContact.phone : ""}
                        <br></br>
                        <Icon name='mail' />: {(companyContact && companyContact.email) ? companyContact.email : ""}
                </Card.Content>
            </Card>
        )
    }
}
/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Icon, Grid, Image, Button } from 'semantic-ui-react'

export default class PhotoUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filePath: "",
            file: null,
            showButton: true,
        };
        this.fileInputRef = React.createRef();
        this.fileChange = this.fileChange.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.imageId !== null && prevProps.imageId !== this.props.imageId) {
            this.setState({
                filePath: 'http://localhost:60290' + this.props.imageId,
                showButton: false,
            });
        }
    }

    uploadFile() {
        var cookies = Cookies.get('talentAuthToken');
        var formData = new FormData();
        formData.append('file', this.state.file);
        $.ajax({
            url: this.props.savePhotoUrl,
            headers: {
                'Authorization': 'Bearer ' + cookies,
            },
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            cache: false,
            success: function (res) {
                this.setState({
                    showButton: false,
                });
                this.props.updateProfileData('profilePhotoUrl', res.profilePath);
            }.bind(this),
            error: function (res, a, b) {
                console.log(res)
                console.log(a)
                console.log(b)
            }
        })
        
    }

    fileChange(e) {
        this.setState({
            filePath: URL.createObjectURL(e.target.files[0]),
            file: e.target.files[0],
            showButton: true,
        });
    }

    render() {
        const { filePath } = this.state;
        return (
            <div className='ui sixteen wide column'>
                <Grid>
                    <Grid.Row className="photo-wrapper" centered>
                        {(filePath && filePath.length > 0) && <Image centered onClick={() => this.fileInputRef.current.click()} src={filePath} size='small' circular />}
                        {(!filePath || filePath === "") && <Icon onClick={() => this.fileInputRef.current.click()} name="camera retro" size="huge" circular />}
                        <input
                            ref={this.fileInputRef}
                            type="file"
                            hidden
                            onChange={this.fileChange}
                        />
                    </Grid.Row>
                    <Grid.Row centered>
                        {this.state.showButton &&
                            <Button type="button" secondary onClick={this.uploadFile} style={{ margin: '20px' }}>
                                <Icon name="upload" />
                                Upload
                            </Button>
                        }
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

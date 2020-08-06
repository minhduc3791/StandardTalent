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
        };
        this.fileInputRef = React.createRef();
        this.fileChange = this.fileChange.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
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
            success: function (res) {
                console.log(res)
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
        });
    }

    render() {
        return (
            <div>
                {this.state.filePath.length > 0 && <Image src={this.state.filePath} size='small' circular bordered />}
                {this.state.filePath === "" && <Icon onClick={() => this.fileInputRef.current.click()} name="camera retro" size="huge" circular />}
                <input
                    ref={this.fileInputRef}
                    type="file"
                    hidden
                    onChange={this.fileChange}
                />
                {this.state.filePath.length > 0 &&
                    <Button type="button" secondary onClick={this.uploadFile} style={{margin: '20px'}}>
                        <Icon name="upload" />
                        Upload
                    </Button>
                }
            </div>
        )
    }
}

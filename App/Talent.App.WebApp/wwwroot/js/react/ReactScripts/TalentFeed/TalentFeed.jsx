import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import TalentCard from '../TalentFeed/TalentCard.jsx';
import { Loader } from 'semantic-ui-react';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';

const PAGE_SIZE = 5;

export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        let loader = loaderData;
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");

        //this.feedWrapperRef = React.createRef();

        this.state = {
            loadNumber: 5,
            loadPosition: 0,
            feedData: [],
            watchlist: [],
            loaderData: loader,
            loadingFeedData: false,
            companyDetails: null
        }

        this.init = this.init.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.loadData = this.loadData.bind(this);
        this.loadTalent = this.loadTalent.bind(this);
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this
    }

    componentDidMount() {
        //this.feedWrapperRef.addEventListener('scroll', this.handleScroll);
        this.loadData();
    }

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/getEmployerProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {
                this.setState({ companyDetails: res.employer });
            }.bind(this)
        })

        //load feed
        this.loadTalent();
        this.init();
    }

    loadTalent() {
        var cookies = Cookies.get('talentAuthToken');
        this.setState({ loadingFeedData: true });
        const feed = {
            position: this.state.loadPosition,
            number: this.state.loadNumber,
        };

        let queryString = Object.keys(feed)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(feed[k]))
            .join('&');

        $.ajax({
            url: 'http://localhost:60290/profile/profile/getTalent?' + queryString,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {
                this.setState({
                    feedData: [...this.state.feedData, ...res.data],
                    loadingFeedData: false,
                });
            }.bind(this)
        })
    }

    handleScroll(e) {
        const { target } = e;

        if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            this.setState(prevState => ({
                loadNumber: PAGE_SIZE,
                loadPosition: prevState.loadPosition + PAGE_SIZE,
            }), () => this.loadTalent());
        }
    }
       
    render() {
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui grid talent-feed container">
                    <div className="four wide column">
                        <CompanyProfile profile={this.state.companyDetails} />
                    </div>
                    <div onScroll={this.handleScroll} className="eight wide column feed-wrapper">
                        {this.state.feedData.map(feed => <TalentCard key={feed.id} {...feed} />)}
                        {this.state.loadingFeedData &&
                            <p id="load-more-loading">
                                <img src="/images/rolling.gif" alt="Loading…" />
                            </p>
                        }
                    </div>
                    <div className="four wide column">
                        <div className="ui card">
                            <FollowingSuggestion />
                        </div>
                    </div>
                </div>
            </BodyWrapper>
        )
    }
}
import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import TalentCard from '../TalentFeed/TalentCard.jsx';
import { Loader } from 'semantic-ui-react';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';
import { fetchEmployer, fetchTalentList, test } from '../services/profileServices';

const PAGE_SIZE = 5;

export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        let loader = loaderData;
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");

        this.state = {
            loadNumber: 5,
            loadPosition: 0,
            feedData: [],
            watchlist: [],
            loaderData: loader,
            loadingFeedData: false,
            employer: null
        }

        this.init = this.init.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.loadData = this.loadData.bind(this);
        this.loadTalent = this.loadTalent.bind(this);
        this.loadEmployer = this.loadEmployer.bind(this);
        this.logError = this.logError.bind(this);
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.loadData();
    }

    loadData() {
        this.loadEmployer();
        this.loadTalent();
        this.init();
    }

    updateEmployer(employer) {
        this.setState({ employer: employer });
    }

    updateTalentList(talentList) {
        this.setState({
            feedData: [...this.state.feedData, ...talentList],
            loadingFeedData: false,
        });
    }

    loadEmployer() {
        fetchEmployer()
            .then(employer => this.updateEmployer(employer))
            .catch(message => this.logError(message));
    }

    loadTalent() {
        const { loadNumber, loadPosition } = this.state;
        this.setState({ loadingFeedData: true });
        fetchTalentList({ number: loadNumber, position: loadPosition })
            .then(talentList => this.updateTalentList(talentList))
            .catch(message => this.logError(message));
    }

    logError(message) {
        console.log(message);
    }

    handleScroll(e) {
        const { target } = e;
        const win = $(window);
        if ((($(document).height() - win.height()) == Math.round(win.scrollTop())) || ($(document).height() - win.height()) - Math.round(win.scrollTop()) == 1) {
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
                        <CompanyProfile profile={this.state.employer} />
                    </div>
                    <div onScroll={this.handleScroll} className="eight wide column">
                        {this.state.feedData.map(feed => <TalentCard key={feed.id} {...feed} />)}
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
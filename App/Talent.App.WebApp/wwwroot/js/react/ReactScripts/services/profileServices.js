import Cookies from 'js-cookie';

const BASE_URL = "http://localhost:60290/profile/profile/";

export const fetchEmployer = () => new Promise((resolve, reject) => {
    var cookies = Cookies.get('talentAuthToken');
    $.ajax({
        url: BASE_URL + 'getEmployerProfile',
        headers: {
            'Authorization': 'Bearer ' + cookies,
            'Content-Type': 'application/json'
        },
        type: "GET",
        success: function ({ employer }) {
            resolve(employer);
        },
        error: function ({ message }) {
            reject(message);
        }
    })
})

export const fetchTalentList = feed => new Promise((resolve, reject) => {
    var cookies = Cookies.get('talentAuthToken');
    let queryString = Object.keys(feed)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(feed[k]))
        .join('&');

    $.ajax({
        url: BASE_URL + '/getTalent?' + queryString,
        headers: {
            'Authorization': 'Bearer ' + cookies,
            'Content-Type': 'application/json'
        },
        type: "GET",
        success: function (res) {
            resolve(res.data);
        },
        error: function ({ message }) {
            reject(message);
        }
    })
})
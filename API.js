'use strict';

const request = require('request');
const assert = require('assert');

const clientId = process.env.LINKEDIN_CLIENT_ID;
const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
const authorizationURL = process.env.LINKEDIN_AUTHORIZATION_URL;
let redirectURI = process.env.LINKEDIN_REDIRECT_URI;
const accessTokenURL = process.env.LINKEDIN_ACCESS_TOKEN_URL;

assert(clientId, 'clientId is required');
assert(clientSecret, 'clientSecret is required');
assert(authorizationURL, 'authorizationURL is required');
assert(redirectURI, 'redirectURI is required');
assert(accessTokenURL, 'accessTokenURL is required');

redirectURI = redirectURI.replace('{__PORT__}', process.env.PORT || 3000);

class API {

    static getLinkedinId(access_token) {
        return new Promise((resolve, reject) => {
            const url = 'https://api.linkedin.com/v2/me';
            const headers = {
                'Authorization': 'Bearer ' + access_token,
                'cache-control': 'no-cache',
                'X-Restli-Protocol-Version': '2.0.0'
            };

            request.get({url: url, headers: headers}, (err, response, body) => {
                if (err || response.statusCode !== 200) {
                    return reject(err || JSON.parse(body));
                }
                resolve(JSON.parse(body).id);
            });
        });
    }

    static getAccessToken(authorization_code) {
        const body = {
            grant_type: 'authorization_code',
            code: authorization_code,
            redirect_uri: redirectURI,
            client_id: clientId,
            client_secret: clientSecret
        };
        return new Promise((resolve, reject) => {
            request.post({url: accessTokenURL, form: body}, (err, response, body) => {
                    if (err || response.statusCode !== 200) {
                        return reject(err || JSON.parse(body));
                    }
                    resolve(JSON.parse(body));
                }
            );
        });
    }

    static getAuthorizationUrl() {
        const state = Buffer.from(Math.round(Math.random() * Date.now()).toString()).toString('hex');
        const scope = encodeURIComponent('r_liteprofile r_emailaddress w_member_social');
        return `${authorizationURL}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectURI)}&state=${state}&scope=${scope}`;
    }
}

module.exports = API;

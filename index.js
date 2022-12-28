'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const open = require('open');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const API = require('./API');

(async () => {
    const linkedInData = await checkIfThereIsAValidAccessToken();
    if (linkedInData) {
        console.log(`There is already a valid access token in [ ./${process.env.ACCESS_TOKEN_FILEPATH} ] file. :-)`);
        console.log(linkedInData);
        process.exit();
    }
    console.info(`There is no valid access token in [ ./${process.env.ACCESS_TOKEN_FILEPATH} ] file`);
    console.info(`Starting the OAuth flow...`);
    app.disable('x-powered-by');
    app.use(bodyParser.urlencoded({extended: true}));
    app.get('/callback', handleCallback);

    app.listen(port, () => {
        const url = API.getAuthorizationUrl();
        console.log(`Opening this URL in your browser: ${url}`);
        open(url);
    });
})();

async function checkIfThereIsAValidAccessToken() {
    try {
        const data = await fs.readFile(process.env.ACCESS_TOKEN_FILEPATH, 'utf8');
        if (data) {
            const {linkedInAccessToken} = JSON.parse(data);
            if (linkedInAccessToken) {
                const linkedInUserId = await API.getLinkedinId(linkedInAccessToken);
                return {linkedInUserId, linkedInAccessToken};
            }
            return false;
        }
    } catch (err) {
        return false
    }
}

async function handleCallback(req, res) {
    const authorization_code = req.query.code;
    let linkedInAccessToken = null;
    try {
        if (!authorization_code) {
            throw new Error('No authorization code!');
        }
        const data = await API.getAccessToken(authorization_code);
        if (data.access_token) {
            linkedInAccessToken = data.access_token;
            try {
                await fs.writeFile(process.env.ACCESS_TOKEN_FILEPATH, JSON.stringify({linkedInAccessToken}));
                console.log(`Access token saved in [ ./${process.env.ACCESS_TOKEN_FILEPATH} ] file`);
            } catch (err) {
                throw new Error(`Error writing the access token to [ ./${process.env.ACCESS_TOKEN_FILEPATH} ] file`);
            }
        }
        const linkedInId = await API.getLinkedinId(linkedInAccessToken);
        const result = {linkedInId, linkedInAccessToken};
        console.log(result);
        const htmlResult = `<html><head><style>td {border: 1px solid;}</style></head><div>Your can now close this window. :-) <br><table><tr><td>linkedInId</td><td>linkedInAccessToken</td></tr><tr><td>${result.linkedInId}</td><td>${result.linkedInAccessToken}</td></tr></table></div>`;
        res.send(htmlResult);
    } catch (err) {
        res.json(err);
    }
    process.exit();
}





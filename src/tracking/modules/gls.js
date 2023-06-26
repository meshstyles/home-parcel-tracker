const axios = require('axios');
const { parcel } = require('./baseclasses/parcel');
const { moduleInfo } = require('./baseclasses/moduleInfo');

const env = process.env;
const language = env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES;
let apiLang = "GROUP";

// this should check if the env (server) has a matching country code for a region with a diffrent api
// check http://www.lingoes.net/en/translator/langcode.htm and https://stackoverflow.com/questions/46072248/node-js-how-to-detect-user-language for reference
if (language.includes('-HR'))
    apiLang = 'HR';
else if (language.includes('-CZ'))
    apiLang = 'CZ';
else if (language.includes('-SI'))
    apiLang = 'SI';

const moduleMetadata = new moduleInfo(
    'gls',
    'GLS Group',
    `https://gls-group.eu/${apiLang}/en/parcel-tracking.html?match=`,
    'https://preview.thenewsmarket.com/Previews/GLSG/StillAssets/960x540/519244_v7.jpg',
    './img/gls.jpg'
);

async function tracker(traceid) {

    let millis = Date.now();
    let url = `https://gls-group.eu/app/service/open/rest/${apiLang}/en/rstt001?match=${traceid}&type=&caller=witt002&millis=${millis}`;
    let res = await axios(url).then(function (response) {
        // console.log(JSON.stringify(response.data));
        return response;
    }).catch((err) => {
        console.error(JSON.stringify(err));
        return null;
    });

    if (res === null)
        return null;

    const reqSuccessful = res.status.toString().startsWith('2');
    if (!reqSuccessful) {
        console.error('HTTP ERROR WITH THE REQUEST');
        return null;
    }

    let package = await res.data.tuStatus[0].history[0];
    if (package === undefined || package === null)
        return null;

    let statusCode = package.evtDscr;
    if (statusCode === undefined)
        statusCode = null;

    let status = package.evtDscr;
    if (status === undefined)
        status = null;

    return new parcel(
        statusCode,
        moduleMetadata.code,
        status,
        traceid
    );
}

module.exports.tracker = tracker;
module.exports.moduleMetadata = moduleMetadata;

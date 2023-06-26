const axios = require('axios');
const { parcel } = require('./baseclasses/parcel');
const { moduleInfo } = require('./baseclasses/moduleInfo');

const moduleMetadata = new moduleInfo(
    'capost',
    'Canada Post',
    'https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=',
    'https://www.canadapost-postescanada.ca/cpc/assets/cpc/img/logos/cpc-logo.svg',
    './img/capost.svg'
);

async function tracker(traceid) {

    let url = `https://www.canadapost-postescanada.ca/track-reperage/rs/track/json/package/${traceid}/detail`;

    let options = {
        headers: {
            'Accept': ' application/json, text/plain, */*',
            'Authorization': ' Basic Og==',
            'Referer': ' https://www.canadapost-postescanada.ca/track-reperage/en',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        },
        url,
    };
    let res = await axios(options).then(function (response) {
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

    let package = await res.data.events[0];
    if (package === undefined || package === null)
        return null;

    let statusCode = package.type;
    if (statusCode === undefined)
        statusCode = null;

    let status = package.descEn;
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

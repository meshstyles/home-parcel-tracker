const axios = require('axios');
const { parcel } = require('./baseclasses/parcel');
const { moduleInfo } = require('./baseclasses/moduleInfo');

const moduleMetadata = new moduleInfo(
    '4px',
    '4PX',
    'http://track.4px.com/#/result/0/',
    'http://track.4px.com/assets/6be239f7fd9170ef486bd2498117d3e8.png',
    './img/4px.png'
);

async function tracker(traceid) {
    let trackingNumbers = [];
    trackingNumbers.push(traceid);
    let url =
        'http://track.4px.com/track/v2/front/listTrackV2';
    let options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Origin': ' http://track.4px.com',
            'Referer': ' http://track.4px.com/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        },
        data: {
            queryCodes: [`${traceid}`],
            language: "en-us",
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

    let package = await res.data.data[0];
    if (package === undefined || package === null)
        return null;

    let statusCode = package.tracks[0].tkDesc;
    if (statusCode === undefined)
        statusCode === null;

    let status = statusCode;

    return new parcel(
        statusCode,
        moduleMetadata.code,
        status,
        traceid
    );
}

module.exports.tracker = tracker;
module.exports.moduleMetadata = moduleMetadata;
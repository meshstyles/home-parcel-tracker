const axios = require('axios');
const { parcel } = require('./baseclasses/parcel');
const { moduleInfo } = require('./baseclasses/moduleInfo');

const moduleMetadata = new moduleInfo(
    'ocx',
    'Orange Connex',
    'https://www.orangeconnex.com/tracking?language=en&trackingnumber=',
    'https://www.orangeconnex.com/resource/img/logo.svg?3750b2d94f8b8cefb9cb218ea414e5d2',
    './img/ogc-logo.svg'
);

async function tracker(traceid) {
    let trackingNumbers = [];
    trackingNumbers.push(traceid);
    let url =
        'https://azure-cn.orangeconnex.com/oc/capricorn-website/website/v1/tracking/traces';
    let options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: {
            trackingNumbers: [`${traceid}`],
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

    let package = await res.data.result.waybills[0];
    if (package === undefined || package === null)
        return null;

    let statusCode = package.lastStatus;
    if (statusCode === undefined)
        statusCode === null;

    let status = package.lastPosition;
    if (status === undefined)
        statusCode === null;

    return new parcel(
        statusCode,
        moduleMetadata.code,
        status,
        traceid
    );
}

module.exports.tracker = tracker;
module.exports.moduleMetadata = moduleMetadata;
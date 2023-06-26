const axios = require('axios');
const { parcel } = require('./baseclasses/parcel')
const { moduleInfo } = require('./baseclasses/moduleInfo');

const moduleMetadata = new moduleInfo(
    'sypost',
    'SunYou Post',
    'https://sypost.net/search?orderNo=',
    'https://sypost.net/track/Images/LOGO.png',
    './img/sypost-logo.png'
);

async function tracker(traceid) {
    let url = `https://www.sypost.net/queryTrack?toLanguage=en_US&trackNumber=${traceid}`;

    let res = await axios(url).then(function (response) {
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

    let package = await res.data
        .replace('searchCallback(', '')
        .replace('})', '}');
    package = JSON.parse(package).data[0];

    if (package === undefined || package === null)
        return null;

    let statusCode = package.lastContent;
    console.log("STATUS SYPOST: " + statusCode)
    if (statusCode === undefined)
        statusCode = null;

    return new parcel(
        statusCode,
        moduleMetadata.code,
        statusCode,
        traceid
    );
}

module.exports.tracker = tracker;
module.exports.moduleMetadata = moduleMetadata;

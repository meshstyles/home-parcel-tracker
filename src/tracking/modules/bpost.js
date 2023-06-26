const axios = require('axios');
const { parcel } = require('./baseclasses/parcel');
const { moduleInfo } = require('./baseclasses/moduleInfo');

const moduleMetadata = new moduleInfo(
    'bpost',
    'BPost (La Poste - Belgique)',
    'https://track.bpost.cloud/btr/web/#/search?lang=en&itemCode=',
    'https://track.bpost.cloud/assets/images/bpost-logo.png',
    './img/bpost.png'
);

async function tracker(traceid) {
    let url = `https://track.bpost.cloud/track/items?itemIdentifier=${traceid}&postalCode=undefined`;
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

    let package = await res.data.items[0];
    if (package === undefined || package === null)
        return null;

    let statusCode = package.events[0].key.EN.description;
    if (statusCode === undefined)
        statusCode = null;

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
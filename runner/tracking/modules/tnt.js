const axios = require('axios');
const { parcel } = require('./baseclasses/parcel');
const { moduleInfo } = require('./baseclasses/moduleInfo');

const moduleMetadata = new moduleInfo(
    'tnt',
    'TNT',
    'https://www.tnt.com/express/en_au/site/shipping-tools/tracking.html?searchType=CON&source=home_widget&cons=',
    'https://www.tnt.com/dam/campaign/iccampaign/logo-ipfs-2-01.svg',
    './img/tnt.svg'
);

async function tracker(traceid) {

    let url = `https://www.tnt.com/api/v3/shipment?con=${traceid}&locale=en_US&searchType=CON&channel=OPENTRACK`;
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

    let package = await res.data['tracker.output'].consignment[0].events[0];
    if (package === undefined || package === null)
        return null;

    let statusCode = package.statusDescription;
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

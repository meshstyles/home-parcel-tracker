const axios = require('axios');
const { parcel } = require('./baseclasses/parcel');
const { moduleInfo } = require('./baseclasses/moduleInfo');

const moduleMetadata = new moduleInfo(
    'dhlde',
    'DHL Paket DE',
    'https://www.dhl.de/de/privatkunden.html?piececode=',
    'https://www.dhl.de/etc.clientlibs/redesign/clientlibs/static/resources/icons/dhl-official.svg',
    './img/dhl-logo.svg'
);

async function tracker(traceid) {

    let url =
        `https://www.dhl.de/int-verfolgen/data/search?piececode=${traceid}&noRedirect=true&language=de&cid=pulltorefresh`;
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

    let package = await res.data.sendungen[0];
    if (package === undefined || package === null)
        return null;

    let shippingDetails = package.sendungsdetails.sendungsverlauf;
    let statusCode = shippingDetails.kurzStatus;
    if (statusCode === undefined)
        statusCode = null;

    let status = shippingDetails.aktuellerStatus;
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

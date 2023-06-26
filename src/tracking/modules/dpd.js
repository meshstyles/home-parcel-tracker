const axios = require('axios');
const { parcel } = require('./baseclasses/parcel');
const { moduleInfo } = require('./baseclasses/moduleInfo');

const moduleMetadata = new moduleInfo(
    'dpdde',
    'DPD Europe',
    'https://tracking.dpd.de/status/en_US/parcel/',
    'https://www.dpd.com/wp-content/themes/dpdcms/images/DPD_logo_redgrad_rgb_responsive.svg',
    './img/dpd.svg'
);

async function tracker(traceid) {
    let url = `https://tracking.dpd.de/rest/plc/de_US/${traceid}`;
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

    let package = await res.data.parcellifecycleResponse.parcelLifeCycleData;

    if (package === undefined || package === null)
        return null;

    let packageInfo = package.statusInfo.find(pInfo => pInfo.isCurrentStatus === true);

    let statusCode = packageInfo.label;
    if (statusCode === undefined)
        statusCode = null;

    let status = packageInfo.status;
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
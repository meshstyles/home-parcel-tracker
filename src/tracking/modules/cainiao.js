const axios = require('axios');
const { parcel } = require('./baseclasses/parcel');
const { moduleInfo } = require('./baseclasses/moduleInfo');

const moduleMetadata = new moduleInfo(
    'cainiao',
    'Cainiao / Aliexpress',
    'https://global.cainiao.com/detail.htm?mailNoList=',
    'https://img.alicdn.com/imgextra/i2/O1CN01xPhRAy1vOFLHc1Emu_!!6000000006162-55-tps-232-44.svg',
    './img/cainiao.svg'
);

async function tracker(traceid) {
    let url =
        `https://global.cainiao.com/global/detail.json?mailNos=${traceid}&lang=en-US`;
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

    let package = await res.data.module[0];

    if (package === undefined || package === null)
        return null;

    let statusCode = package.latestTrace.standerdDesc;
    if (statusCode === undefined)
        statusCode = null;

    let status = package.latestTrace.desc;
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
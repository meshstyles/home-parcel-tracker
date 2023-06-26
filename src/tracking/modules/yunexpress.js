const axios = require('axios');
const { parcel } = require('./baseclasses/parcel');
const { moduleInfo } = require('./baseclasses/moduleInfo');

const moduleMetadata = new moduleInfo(
    'yun',
    'Yun Express',
    'https://www.yuntrack.com/parcelTracking?id=',
    'https://www.yunexpress.com/skins/default/images/common/logo.png',
    './img/yun.png'
);

async function tracker(traceid) {
    let trackingNumbers = [];
    trackingNumbers.push(traceid);
    let url =
        'https://services.yuntrack.com/Track/Query';
    let options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Nebula token:undefined',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
            'Origin': ' https://www.yuntrack.com',
            'Referer': ' https://www.yuntrack.com/',
        },
        data: {
            NumberList: [`${traceid}`],
            CaptchaVerification: '',
            Year: 0
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

    let package = await res.data.ResultList[0];

    if (package === undefined || package === null)
        return null;

    let statusCode = package.TrackData.TrackStatus;
    if (statusCode === undefined)
        statusCode === null;

    let status = package.TrackInfo.LastTrackEvent.ProcessContent;
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
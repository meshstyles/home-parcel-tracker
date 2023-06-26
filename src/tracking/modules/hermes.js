const axios = require('axios');
const { parcel } = require('./baseclasses/parcel');
const { moduleInfo } = require('./baseclasses/moduleInfo');

const moduleMetadata = new moduleInfo(
    'hermesde',
    'Hermes DE',
    'https://www.myhermes.de/empfangen/sendungsverfolgung/sendungsinformation#',
    'https://upload.wikimedia.org/wikipedia/de/2/29/Hermes_Logistik_Gruppe_2008.svg',
    './img/hermes.svg'
);

async function tracker(traceid) {
    let trackingNumbers = [];
    trackingNumbers.push(traceid);
    let url = `https://api.my-deliveries.de/tnt/parcelservice/parceldetails/${traceid}`;
    let options = {
        headers: {
            'authority': ' api.my-deliveries.de',
            'origin': ' https://www.myhermes.de',
            'referer': ' https://www.myhermes.de/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        },
        url,
    };

    let res = await axios(options).then(function (response) {
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

    let package = await res.data.status.text;
    if (package === undefined || package === null)
        return null;

    let statusCode = package.statusHistoryShortText;
    if (statusCode === undefined)
        statusCode === null;

    let status = package.statusHistoryText;
    if (status === undefined)
        statusCode === null;

    return new parcel(
        statusCode,
        `${moduleMetadata.code}`,
        status,
        traceid
    );
}

module.exports.tracker = tracker;
module.exports.moduleMetadata = moduleMetadata;
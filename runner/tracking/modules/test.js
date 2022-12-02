const { parcel } = require('./baseclasses/parcel');
const { moduleInfo } = require('./baseclasses/moduleInfo');

const moduleMetadata = new moduleInfo(
    'test',
    'Test service',
    'http://192.168.178.102/',
    'https://avatars.githubusercontent.com/u/29343041?v=4',
    './img/parcel-logo.png'
);

async function tracker(traceid) {
    const possible = ['done', 'shipped', 'ready', 'departed', 'dropped off', 'in transit', 'arrived', 'delivery in process', 'out for delivery', 'placed in the mailbox'];
    const brokenstatus = ['dead', 'broken', 'issue', 'false'];
    let status = possible[Math.floor(Math.random() * possible.length)];
    if (brokenstatus.includes(traceid))
        status = null;

    if (traceid === 'error')
        return null;

    return new parcel(
        status,
        `${moduleMetadata.code}`,
        `test`,
        traceid
    );
}

module.exports.tracker = tracker;
module.exports.moduleMetadata = moduleMetadata;

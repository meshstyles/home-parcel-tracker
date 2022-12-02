let services = [];

// there has to be a better way
const ocAPI = require('./modules/orangeconnex');
services.push(ocAPI.moduleMetadata);

const sypostAPI = require('./modules/sypost');
services.push(sypostAPI.moduleMetadata);

const dhlAPI = require('./modules/dhl');
services.push(dhlAPI.moduleMetadata);

const testAPI = require('./modules/test');
services.push(testAPI.moduleMetadata);

const cainiaoAPI = require('./modules/cainiao');
services.push(cainiaoAPI.moduleMetadata);

const yunAPI = require('./modules/yunexpress');
services.push(yunAPI.moduleMetadata);

const dpddeAPI = require('./modules/dpd');
services.push(dpddeAPI.moduleMetadata);

const bpostAPI = require('./modules/bpost');
services.push(bpostAPI.moduleMetadata);

const pxAPI = require('./modules/4px');
services.push(pxAPI.moduleMetadata);

const capostAPI = require('./modules/capost');
services.push(capostAPI.moduleMetadata);

const tntAPI = require('./modules/tnt');
services.push(tntAPI.moduleMetadata);

const glsAPI = require('./modules/gls');
services.push(glsAPI.moduleMetadata);

const hermesdeAPI = require('./modules/hermes');
services.push(hermesdeAPI.moduleMetadata);

async function ptacker(parcel) {
    let { service, traceid } = parcel;

    // console.log(service)

    switch (service) {
        case sypostAPI.moduleMetadata.code:
            return sypostAPI.tracker(traceid);

        case ocAPI.moduleMetadata.code:
            return ocAPI.tracker(traceid);

        case dhlAPI.moduleMetadata.code:
            return dhlAPI.tracker(traceid);

        case testAPI.moduleMetadata.code:
            return testAPI.tracker(traceid);

        case cainiaoAPI.moduleMetadata.code:
            return cainiaoAPI.tracker(traceid);

        case yunAPI.moduleMetadata.code:
            return yunAPI.tracker(traceid);

        case dpddeAPI.moduleMetadata.code:
            return dpddeAPI.tracker(traceid);

        case bpostAPI.moduleMetadata.code:
            return bpostAPI.tracker(traceid);

        case pxAPI.moduleMetadata.code:
            return pxAPI.tracker(traceid);

        case capostAPI.moduleMetadata.code:
            return capostAPI.tracker(traceid);

        case tntAPI.moduleMetadata.code:
            return tntAPI.tracker(traceid);

        case glsAPI.moduleMetadata.code:
            return glsAPI.tracker(traceid);

        case hermesdeAPI.moduleMetadata.code:
            return hermesdeAPI.tracker(traceid);

        default:
            console.log(parcel);
            console.error('service not supported');
            parcel.error = 'unsupported';
            return parcel

    }
}

module.exports.ptacker = ptacker;
module.exports.services = services;

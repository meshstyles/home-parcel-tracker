const fs = require('fs');
const express = require('express');
const cors = require('cors')
const app = express();
let cron = require('node-cron');

const parcelAPI = require('./tracking');
const port = 3003;

// using a file as a database could cause issues on a simultanious write access
// for this application it should be enough
const parcelsFileName = './parcels.json';
let parcels = [];

// if file exists reads in file otherwise create new
if (fs.existsSync(parcelsFileName)) {
    parcels = require(parcelsFileName);
} else {
    writeJsonToFile(parcelsFileName, parcels);
}
console.log(`[startup]: Parcels : ${JSON.stringify(parcels)}`);
console.log("[startup]: SERVICES: " + JSON.stringify(parcelAPI.services));

app.use(cors())

/**
 * returns list of all parcels with tracking data
 */
app.get('/', async (req, res) => {
    return res.send(JSON.stringify(parcels));
});

/**
 * returns list of all parcels with tracking data
 */
app.get('/services', async (req, res) => {
    return res.send(JSON.stringify(parcelAPI.services));
});

// this is for dev purposes
app.get('/run', async (req, res) => {
    let packets = await trackparcels();
    return res.send(JSON.stringify(packets));
})

app.get('/add/:traceId/:service/', async (req, res) => {
    let traceId = req.params.traceId;
    let service = req.params.service;

    let success, message;
    if (parcels.parcelExists(traceId)) {
        success = true;
        message = `ID ${traceId} is already tracked.`;
    } else {
        let newPackage = { traceid: traceId, service: service };
        ({ success, message } = await trackNewParcel(newPackage));
    }
    return res.send(JSON.stringify({ success: success, message: message, parcels: parcels }));
});

app.get('/remove/:traceId', (req, res) => {
    let traceId = req.params.traceId;
    let success = false;
    let message;

    if (parcels.parcelExists(traceId)) {
        parcels = parcels.filter(parcel => parcel.traceid !== traceId);
        if (writeJsonToFile(parcelsFileName, parcels)) {
            success = true
            message = `successfully removed from list ${traceId}`;
        }
        else {
            message = `Internal error, parcel ID ${traceId} might still not be removed correctly`;
        }
    }
    else {
        message = `ID ${traceId} not found. Parcel cannot be removed`;
    }
    return res.send(JSON.stringify({ success: success, message: message, parcels: parcels }));

});

app.listen(port, () => {
    console.log(`[startup] Parcel Tracer API listening on port ${port}`)
})

/**
 * write object as json to file
 * @param {*} filename 
 * @param {*} jsonContent can be arbitrary object content
 * @returns 
 */
function writeJsonToFile(filename, jsonContent) {
    console.log(`[writing]: ${filename}`);
    fs.writeFile(filename, JSON.stringify(jsonContent), err => {
        if (err) {
            console.error(err);
            return false;
        }
    });
    return true;
}

/**
 * tracks new parcel and adds it to the parcels list
 * @param {*} newParcel parcel info {service, parcelId}
 */
async function trackNewParcel(newParcel) {
    // added item must always be the last one in the array
    let success = true;
    let message;
    let newtracedParcel = await parcelAPI.ptacker(newParcel);

    if (newtracedParcel === null || newtracedParcel === undefined) {
        newtracedParcel = {
            statusCode: 'API ERROR',
            traceid: newParcel.traceid,
            service: newParcel.service,
            status: 'API ERROR'
        };
        success = false;
        message = 'Error with API tracking';
    }

    if (newtracedParcel.error !== null && newtracedParcel.error !== undefined) {
        console.log(JSON.stringify(newtracedParcel))
        return { success: false, message: 'Tracking service not supported' };
    }

    parcels.push(newtracedParcel);
    message = 'Parcel successfully added';
    if (!writeJsonToFile(parcelsFileName, parcels)) {
        // there should practically be no reason a write fails 10 times
        let loopcounter = 0;
        while (!writeJsonToFile(parcelsFileName, parcels)) {
            await delay(500);
            if (loopcounter > 10) {
                success = false;
                message = 'Error writing data to the file';
            }
        }
    }

    // return success;
    return { success: success, message: message };
}

/**
 * goes through all parcels and updates the them if a new request is successful
 */
async function trackparcels() {
    let parcelslist = [];
    for (let i = 0; i < parcels.length; i++) {

        let parcel = parcels[i];

        let parcelInfo = await parcelAPI
            .ptacker(parcel)
            .catch(() => {
                console.log(`[ERROR]: ${parcel}`);
            });

        //if there is a problem with the module keep the last known data
        if (parcelInfo === null || parcelInfo === undefined)
            parcelInfo = parcels.find(({ traceid }) => traceid === parcel.traceid);

        parcelslist.push(parcelInfo);
        console.log(`[parcelinfo]: ${JSON.stringify(parcelInfo)}`);
    }
    writeJsonToFile(parcelsFileName, parcelslist);
    parcels = parcelslist;
    return parcelslist;
}

/**
 * checking if parcelId is already in the tracked parcels
 * @param {*} parcelId 
 * @returns boolean
 */
Array.prototype.parcelExists = function (parcelId) {
    let success = false;

    this.forEach(tracer => {
        if (tracer.traceid === parcelId)
            success = true;
    });

    return success;
}

/**
 * common sleep in nodejs
 * @param {*} time time in ms
 * @returns 
 */
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

//         # ----------------- second (optional)
//         # | --------------- minute
//         # | | ------------- hour
//         # | | |   --------- day of month
//         # | | |   | ------- month
//         # | | |   | | ----- day of week
//         # | | |   | | |
//         # | | |   | | | 
//         # * * *   * * *
cron.schedule('0 */4 * * *', () => {
    console.log('[executing cron]');
    trackparcels();
});
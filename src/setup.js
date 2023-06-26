const parcelAPI = require('./tracking');
const fs = require('fs');
const http = require('https')

let supportedServices = parcelAPI.services;
let logopath = './webpage/img/'

main();

async function main(params) {

    for (const supportedService of supportedServices) {
        // check that it's not githubusercontent (suggesting that it should be includable in the git anyway)
        if (!supportedService.logo.includes('githubusercontent.com')) {

            imagePath = supportedService.logoLocal.replace('./img/', logopath);
            await download(supportedService.logo, `${imagePath}`);

        }
    }
    console.log('done downloading')
    process.exit(0);
};

// https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
async function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);

        console.log(`downloading ${dest}`)

        const request = http.get(url, response => {
            if (response.statusCode === 200) {
                response.pipe(file);
            } else {
                file.close();
                fs.unlink(dest, () => { }); // Delete temp file
                reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
            }
        });

        request.on("error", err => {
            file.close();
            fs.unlink(dest, () => { }); // Delete temp file
            reject(err.message);
        });

        file.on("finish", () => {
            resolve();
        });

        file.on("error", err => {
            file.close();

            if (err.code === "EEXIST") {
                reject("File already exists");
            } else {
                fs.unlink(dest, () => { }); // Delete temp file
                reject(err.message);
            }
        });
    });
}
const parcelAPI = require('./tracking');
const fs = require('fs');

let supportedServices = parcelAPI.services;
// 
let content = ""


for (const supportedService of supportedServices) {
    // check that it's not githubusercontent (suggesting that it should be includable in the git anyway)
    if (!supportedService.logo.includes('githubusercontent.com'))
        content += `curl -L '${supportedService.logo}' -o '${supportedService.logoLocal.replace('./img/', '')}'\n`
}


try {
    fs.writeFileSync('./download.sh', content);
    // file written successfully
} catch (err) {
    console.error(err);
}
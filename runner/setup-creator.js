const parcelAPI = require('./tracking');
const fs = require('fs');

let supportedServices = parcelAPI.services;
let content = `#!/bin/bash
mkdir external
cd external
curl 'https://github.com/twbs/bootstrap/releases/download/v3.4.1/bootstrap-3.4.1-dist.zip' -L -O
unzip 'bootstrap-3.4.1-dist.zip'
cd 'bootstrap-3.4.1-dist'
mv * ../
cd ..
rmdir 'bootstrap-3.4.1-dist'
rm 'bootstrap-3.4.1-dist.zip'
curl 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js' -o 'js/axios.min.js'
curl 'https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js' -o 'js/vue.js'
[ -d img ] || mkdir img
`;


for (const supportedService of supportedServices) {
    content += `curl '${supportedService.logo}' -o '${supportedService.logoLocal}'\n`
}

content += `cp -r */ ../
cd ../
rm -r external`

try {
    fs.writeFileSync('./setup.sh', content);
    // file written successfully
} catch (err) {
    console.error(err);
}
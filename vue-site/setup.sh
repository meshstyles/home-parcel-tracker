#!/bin/bash
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
curl 'https://www.orangeconnex.com/resource/img/logo.svg?3750b2d94f8b8cefb9cb218ea414e5d2' -o './img/ogc-logo.svg'
curl 'https://sypost.net/track/Images/LOGO.png' -o './img/sypost-logo.png'
curl 'https://www.dhl.de/etc.clientlibs/redesign/clientlibs/static/resources/icons/dhl-official.svg' -o './img/dhl-logo.svg'
curl 'https://avatars.githubusercontent.com/u/29343041?v=4' -o './img/parcel-logo.png'
curl 'https://img.alicdn.com/imgextra/i2/O1CN01xPhRAy1vOFLHc1Emu_!!6000000006162-55-tps-232-44.svg' -o './img/cainiao.svg'
curl 'https://www.yunexpress.com/skins/default/images/common/logo.png' -o './img/yun.png'
curl 'https://www.dpd.com/wp-content/themes/dpdcms/images/DPD_logo_redgrad_rgb_responsive.svg' -o './img/dpd.svg'
curl 'https://track.bpost.cloud/assets/images/bpost-logo.png' -o './img/bpost.png'
curl 'http://track.4px.com/assets/6be239f7fd9170ef486bd2498117d3e8.png' -o './img/4px.png'
curl 'https://www.canadapost-postescanada.ca/cpc/assets/cpc/img/logos/cpc-logo.svg' -o './img/capost.svg'
curl 'https://www.tnt.com/dam/campaign/iccampaign/logo-ipfs-2-01.svg' -o './img/tnt.svg'
curl 'https://preview.thenewsmarket.com/Previews/GLSG/StillAssets/960x540/519244_v7.jpg' -o './img/gls.jpg'
curl 'https://upload.wikimedia.org/wikipedia/de/2/29/Hermes_Logistik_Gruppe_2008.svg' -o './img/hermes.svg'
cp -r */ ../
cd ../
rm external
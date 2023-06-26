# Adding Functionality

Create a new module and add it to the modules index.js.
Please add the service name in the table below as well as to the modules metadata.
Please, if possible, use AXIOS for all web requests.
If you add a new module reference the style of the other modules and keep it simple.
**NOTE:** Please do not include hard coded API credentials. Only mine them dynamically or if include empty credentials when these still work.

## The Parcel Object

| atribute name | description                                                                             |
| ------------- | --------------------------------------------------------------------------------------- |
| statusCode    | This is the info that will be printed in the frontend. Short info about the package     |
| service       | this is the service name please just take it from the function argument                 |
| status        | A longer info about the parcel status. Currently not show in the frontend               |
| traceid       | this is the barcode number of the parcel please just take it from the function argument |

## Services

| Service name                | Service codename | status  |
| --------------------------- | ---------------- | ------- |
| SunYou Post                 | sypost           | working |
| Orange Connex               | ocx              | working |
| DHL Paket DE                | dhlde            | working |
| Test service                | test             | working |
| Cainiao / Aliexpress        | cainiao          | working |
| Yun Express                 | yun              | working |
| DPD Europe                  | dpdde            | working |
| BPost (La Poste - Belgique) | bpost            | working |
| 4PX                         | 4px              | working |
| Canada Post                 | capost           | working |
| TNT                         | tnt              | working |
| GLS Group                   | gls              | working |
| Hermes DE                   | hermesde         | working |

## Test Module

The test module is special.
It allows you to test the frontend without having to rely on an external API.
You can test features using different a barcode or `traceid` to test things out.
It offers to test functionality of what happens when an initial API response cannot be resolved `['error']`.
You can test a what happens on a subsequent broken status `['dead', 'broken', 'issue', 'false']`.
Or a normal shipping progress (status will be randomized) [any other barcode].

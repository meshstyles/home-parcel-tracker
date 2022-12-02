class parcel {
    constructor(statusCode, service, status, traceid) {
        this.statusCode = statusCode;
        this.traceid = traceid;
        this.service = service;
        this.status = status;
    }
}

module.exports.parcel = parcel;
class moduleInfo {
    constructor(code, name, baseurl, logo, logoLocal) {
        this.code = code;
        this.name = name;
        this.baseurl = baseurl;
        this.logo = logo;
        this.logoLocal = logoLocal;
    }
}

module.exports.moduleInfo = moduleInfo;
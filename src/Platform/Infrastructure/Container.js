export class Container {
    constructor(parameterBag) {
        this.parameterBag = parameterBag;

        let services = require("../../../config/services").default;
        this.services = services;
    }

    get(param) {
        if (param == "params") {
            return this.parameterBag;
        }

        return new this.services[param.name]();
    }
}
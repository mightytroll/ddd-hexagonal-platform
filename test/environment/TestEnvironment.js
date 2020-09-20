const fs = require("fs");
const path = require("path");
const NodeEnvironment = require("jest-environment-node");

const globalConfigPath = path.join(__dirname, "../../config/local-test.json");

class MongoEnvironment extends NodeEnvironment {
    constructor(config) {
        super(config);
    }

    async setup() {
        const config = JSON.parse(fs.readFileSync(globalConfigPath, "utf-8"));

        this.global.__MONGO_URI__ = config.db.url;

        await super.setup();
    }
}

module.exports = MongoEnvironment;

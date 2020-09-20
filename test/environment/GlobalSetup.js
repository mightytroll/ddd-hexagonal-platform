const fs = require("fs");
const path = require("path");
const { MongoMemoryServer } = require("mongodb-memory-server");

const globalConfigPath = path.join(__dirname, "../../config/local-test.json");
const mongod = new MongoMemoryServer({
    autoStart: false,
    binary: {
        version: "4.2.2"
    }
});

module.exports = async () => {
    if (!mongod.isRunning) {
        await mongod.start();
    }

    const config = {
        db: {
            url: await mongod.getUri()
        }
    };

    process.env.DB_URL = config.db.url;

    // Write global config to disk because all tests run in different contexts.
    fs.writeFileSync(globalConfigPath, JSON.stringify(config, null, 4));

    // Set reference to mongod in order to close the server during teardown.
    global.__MONGOD__ = mongod;
};

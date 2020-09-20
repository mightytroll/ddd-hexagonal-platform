let command = process.argv[2];

switch (command) {
    case "cache:clear": {
        let handler = require("./scripts/cache").clear;
        handler({});
    }
}
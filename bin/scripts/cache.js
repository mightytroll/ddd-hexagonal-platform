import _ from "lodash";
import path from "path";
import fs from "fs";
import { DomainEventSubscriber } from "../../src/Platform/Domain/DomainEventSubscriber";
const { readdir } = require("fs").promises;

const DIR_ROOT = path.resolve(__dirname, "../..");

async function getFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
}

export function clear(options) {
    let cacheDir = path.resolve(DIR_ROOT, "cache");
    let cacheFile = path.resolve(cacheDir, "cache.js");

    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
    }

    if (fs.existsSync(cacheFile)) {
        fs.unlinkSync(cacheFile);
    }

    Promise.resolve(getFiles(path.resolve(__dirname, "../../src"))).then((files) => {
        let cache = {
            domainEventSubscribers: {}
        };

        files.forEach((file) => {
            if (file == path.resolve(DIR_ROOT, "src/index.js")) return;

            let name = path.basename(file, ".js");
            let module = require(file);
            let exportedClass = module[name];

            if (exportedClass && exportedClass.prototype instanceof DomainEventSubscriber) {
                cache.domainEventSubscribers[exportedClass.name] = file;
            }
        });

        let imports = [];
        let exports = [];
        _.forEach(cache.domainEventSubscribers, (location, name) => {
            imports.push(`import { ${name} } from "${location}";`);
            exports.push(`${name}`);
        });
        fs.appendFileSync(cacheFile, imports.join("\n") + "\n", "utf8");
        fs.appendFileSync(cacheFile, `\nlet subscribers = [\n`, "utf8");
        fs.appendFileSync(cacheFile, "\t" + exports.join(",\n\t"), "utf8");
        fs.appendFileSync(cacheFile, `\n];\n`);
        fs.appendFileSync(cacheFile, `\nexport const DomainEventSubscribers = subscribers;`);
    });
}

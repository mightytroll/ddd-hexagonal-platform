import config from "config";
import mongoose from "mongoose";
import { Log } from "./Platform/Infrastructure/Log";
import { HttpKernel } from "./Platform/Infrastructure/HttpKernel";

let httpServer = new HttpKernel(config);

if (config.has("db.url")) {
    Log.debug("Connecting to Mongo...");

    let mongooseOptions = {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    if (config.has("db.user") && config.has("db.pass")) {
        Log.debug("Using username and password.");
        mongooseOptions.user = config.get("db.user");
        mongooseOptions.pass = config.get("db.pass");
    }

    // Connect to the Database prior to starting the App.
    mongoose
        .connect(config.get("db.url"), mongooseOptions)
        .then(() => {
            // Connection successful, start the server.
            httpServer.run();
        })
        .catch((error) => {
            // Failed to connect to database.
            Log.error(error);
        });
} else {
    httpServer.run();
}

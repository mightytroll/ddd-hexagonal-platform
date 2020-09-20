import _ from "lodash";
import cors from "cors";
import express from "express";
import { Log } from "./Log";
import { Container } from "./Container";

export class HttpKernel {
    constructor(params) {
        this.params = params;
        this.express = express();
        this.express.use(express.json());
        this.express.use(cors());

        this.router = express.Router();
        this.express.use(this.router);

        let routes = require("../../../config/routes").default;
        for (const name in routes) {
            let route = routes[name];

            this.addRoute(route.method, route.path, route.command, route.handler);
        }

        this.container = new Container(this.params);
    }

    addRoute(method, path, commandClass, commandHandlerClass) {
        this.router[method](path, async (request, response, next) => {
            try {
                let command = new commandClass(..._.get(commandClass, "params", []).map((param) => {
                    return request.body[param];
                }));
                let commandHandler = new commandHandlerClass(..._.get(commandHandlerClass, "params", []).map((param) => {
                    return this.container.get(param);
                }));
                let result = await commandHandler.handle(command);
                response.json(result);
            } catch (error) {
                next(error);
            }
        });
    }

    run() {
        let port = this.params.has("server.port") ? this.params.get("server.port") : 3000;

        return this.express.listen(port, () => {
            Log.debug(`Listening on port ${port}...`);
        });
    }
}

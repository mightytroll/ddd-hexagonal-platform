import { StatusCommand } from "../src/Platform/Application/Server/StatusCommand";
import { StatusCommandHandler } from "../src/Platform/Application/Server/StatusCommandHandler";

let routes = {
    getStatus: {
        method: "get",
        path: "/platform/status",
        command: StatusCommand,
        handler: StatusCommandHandler
    }
};

export default routes;

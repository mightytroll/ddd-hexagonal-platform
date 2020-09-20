import "../../../environment/DatabaseConnection";
import config from "config";
import request from "supertest";
import routes from "../../../../config/routes";
import { HttpKernel } from "../../../../src/Platform/Infrastructure/HttpKernel";

describe("Platform.Server.StatusCommand", () => {
    test("should return OK", async () => {
        let httpServer = new HttpKernel(config);

        let response = await request(httpServer.express).get(routes.getStatus.path);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            server: config.get("server.name"),
            status: config.get("server.status.text")
        });
    });
});

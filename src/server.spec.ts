import * as request from "supertest";
import * as awilix from "awilix";
import * as winston from "winston";
import Server from "./server";

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

const winstonLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: process.env.LOGGING_LEVEL || "debug",
      timestamp: () => new Date().toISOString()
    })
  ]
});

container.register({
  server: awilix.asClass(Server),
  logger: awilix.asValue(winstonLogger)
});

describe("Server endpoint test", () => {
  it("return hello world", () => {
    const server = container.resolve<Server>("server").getApp();

    request(server)
      .get("/api")
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({ hello: "world" });
      });
  });
});

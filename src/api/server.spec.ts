import * as request from "supertest";
import * as awilix from "awilix";
import Server from "./server";
import InMemoryStorage from "../shared/storage/inMemory";
import createContainer from "./container";

const container = createContainer(null, {
  storage: awilix.asClass(InMemoryStorage)
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

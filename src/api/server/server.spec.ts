import * as awilix from "awilix";
import * as request from "supertest";
import InMemoryStorage from "../../shared/storage/inMemory";
import TranslationsStorage from "../../shared/translations/translations";
import createContainer from "../container";
import Server from "./server";

const container = createContainer(null, {
  storage: awilix.asClass(InMemoryStorage, { lifetime: awilix.Lifetime.SINGLETON })
});

describe("Server", () => {
  beforeEach(async () => {
    const translationsStorage = container.resolve<TranslationsStorage>("translationsStorage");

    await translationsStorage.setTranslations({});
  });

  it("returns translations", async () => {
    const server = container.resolve<Server>("server").getApp();
    const translationsStorage = container.resolve<TranslationsStorage>("translationsStorage");

    await translationsStorage.setTranslations({ a: "b" });

    await request(server)
      .get("/translations")
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({ a: "b" });
      });
  });

  it("returns bad request when filter param is empty", async () => {
    const server = container.resolve<Server>("server").getApp();

    await request(server)
      .get("/translations?filters[]=")
      .expect(400)
      .then(res => {
        expect(res.body).toEqual({
          error: "Bad Request",
          message:
            'child "filters" fails because ["filters" at position 0 fails because ["0" is not allowed to be empty]]',
          statusCode: 400,
          validation: { keys: ["filters.0"], source: "query" }
        });
      });
  });
});

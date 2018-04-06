import * as bluebird from "bluebird";
import { createClient, RedisClient } from "redis";
import IStorage from "./storage";

export default class InRedisStorage implements IStorage {
  private client: RedisClient;

  constructor() {
    this.client = createClient(6379, "db");
  }

  public async set(key: string, value: any) {
    bluebird.promisify(this.client.set).bind(this.client)(key, JSON.stringify(value));
  }

  public async get(key: string): Promise<any> {
    return JSON.parse(await bluebird.promisify(this.client.get).bind(this.client)(key));
  }
}

import { createClient, RedisClient } from "redis";
import * as util from "util";
import IStorage from "./storage";

export default class InRedisStorage implements IStorage {
  private client: RedisClient;

  constructor() {
    this.client = createClient(Number(process.env.REDIS_PORT) || 6379, process.env.REDIS_HOST || "db");
  }

  public async set(key: string, value: any) {
    util.promisify(this.client.set).bind(this.client)(key, JSON.stringify(value));
  }

  public async get(key: string): Promise<any> {
    return JSON.parse(await util.promisify(this.client.get).bind(this.client)(key));
  }
}

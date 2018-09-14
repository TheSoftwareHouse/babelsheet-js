import { createClient, RedisClient } from 'redis';
import * as util from 'util';
import IStorage from './storage';

export default class InRedisStorage implements IStorage {
  private client: RedisClient;

  constructor() {
    this.client = createClient(
      Number(process.env.BABELSHEET_REDIS_PORT) || 6379,
      process.env.BABELSHEET_REDIS_HOST || 'db'
    );
  }

  public async set(key: string, value: any) {
    return util.promisify(this.client.set).bind(this.client)(key, JSON.stringify(value));
  }

  public async get(key: string): Promise<any> {
    return JSON.parse(await util.promisify(this.client.get).bind(this.client)(key));
  }

  public async has(key: string) {
    return util.promisify(this.client.exists).bind(this.client)(key);
  }

  public async clear() {
    return util.promisify(this.client.flushall).bind(this.client)();
  }
}

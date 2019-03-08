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
    const promisifiedSet: any = util.promisify(this.client.set).bind(this.client);
    return promisifiedSet(key, JSON.stringify(value));
  }

  public async get(key: string): Promise<any> {
    return JSON.parse(await util.promisify(this.client.get).bind(this.client)(key));
  }

  public async has(key: string) {
    const promisifiedHas: any = util.promisify(this.client.exists).bind(this.client);
    return promisifiedHas(key);
  }

  public async clear(key: string) {
    if (key) {
      const promisifiedClear: any = util.promisify(this.client.del).bind(this.client);
      return promisifiedClear(key);
    }

    return util.promisify(this.client.flushall).bind(this.client)();
  }
}

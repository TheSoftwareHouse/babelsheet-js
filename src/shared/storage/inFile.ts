import * as fs from "fs";
import IStorage from "./storage";

export default class InFileStorage implements IStorage {
  public loadData() {
    if (fs.existsSync("data.json")) {
      return JSON.parse(fs.readFileSync("data.json", "utf8"));
    }

    return {};
  }

  public saveData(data: any) {
    fs.writeFileSync("data.json", JSON.stringify(data));
  }

  public async set(key: string, value: any) {
    this.saveData({ ...this.loadData(), [key]: value });
  }

  public async get(key: string): Promise<any> {
    return Promise.resolve(this.loadData()[key]);
  }
}

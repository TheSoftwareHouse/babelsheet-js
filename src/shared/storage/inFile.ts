import { Credentials } from "google-auth-library/build/src/auth/credentials";
import * as fs from "fs";
import Storage from "./index";

export default class InFileStorage implements Storage {
  loadData() {
    if (fs.existsSync("data.json")) {
      return JSON.parse(fs.readFileSync("data.json", "utf8"));
    }

    return {};
  }

  saveData(data: any) {
    fs.writeFileSync("data.json", JSON.stringify(data));
  }

  set(key: string, value: any): void {
    this.saveData({ ...this.loadData(), [key]: value });
  }

  get(key: string) {
    return this.loadData()[key];
  }
}

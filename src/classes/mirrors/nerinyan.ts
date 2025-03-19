import { Mirror } from "."

export class NerinyanMirror extends Mirror {
  constructor() {
    super("https://api.nerinyan.moe/d/")
  }

  async fetchFile(id: string): Promise<any> {
    return await this.fetchFromApi(id)
  }
}
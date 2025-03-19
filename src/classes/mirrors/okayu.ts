import { Mirror } from "."

export class OkayuMirror extends Mirror {
  constructor() {
    super("https://direct.osuokayu.moe/d/")
  }

  async fetchFile(id: string): Promise<any> {
    return await this.fetchFromApi(id)
  }
}
import { Mirror } from "."

export class CatboyMirror extends Mirror {
  constructor() {
    super('https://catboy.best/d/')
  }

  async fetchFile(id: string): Promise<any> {
    return await this.fetchFromApi(id)
  }
}
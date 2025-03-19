export abstract class Mirror {
  protected _baseURL: string

  constructor(baseURL: string) {
    this._baseURL = baseURL
  }

  abstract fetchFile(id: String): Promise<any>

  protected async fetchFromApi(id: string): Promise<any> {
    try {
      const response = await fetch(new URL(`${id}`, this._baseURL), {
        headers: { "User-Agent": "shockpast/osu-collector-cli: 1.0.0" }
      })
      if (!response.ok) return { ok: false, status: response.status }

      return await response.bytes()
    } catch (error) {
      return error as Error
    }
  }
}
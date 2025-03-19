import type { ICollection, ICollectionBeatmaps } from "../types/collector"

/// ilegally wrapping undocumented api ;]
export class Collector {
  private BASE_URL: string = "https://osucollector.com/api"

  private _collectionId: number = 0

  constructor(collectionId: number) {
    this._collectionId = collectionId
  }

  public async getInfo(): Promise<ICollection> {
    const response = await fetch(`${this.BASE_URL}/collections/${this._collectionId}`)
    if (response.status !== 200) throw new Error(`Collector#getInfo(): ${response.status}`)
    if (!response.headers.get("Content-Type")?.includes("application/json")) throw new Error(`Collector#getInfo(): Invalid JSON.`)

    return await response.json() as ICollection
  }

  public async getBeatmaps(): Promise<ICollectionBeatmaps> {
    const response = await fetch(`${this.BASE_URL}/collections/${this._collectionId}/beatmapsv3`)
    if (response.status !== 200) throw new Error(`Collector#getBeatmaps(): ${response.status}`)
    if (!response.headers.get("Content-Type")?.includes("application/json")) throw new Error(`Collector#getBeatmaps(): Invalid JSON.`)

    return await response.json() as ICollectionBeatmaps
  }
}
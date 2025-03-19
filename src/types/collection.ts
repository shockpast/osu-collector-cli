export interface ICollection {
  name: string
  beatmapsCount: number
  beatmapsMd5: string[]
}

export interface ICollectionData {
  osuver: number
  collectionscount: number
  collection: ICollection[]
}
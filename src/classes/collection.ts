// collection.ts - writing and reading collection.db osu! file

import { OsuDBParser } from "osu-db-parser"

import type { ICollection, ICollectionData } from "../types/collection"

const CURSED_ENCODING_REGEX = /[^\x20-\x7E]/gi

export class Collection {
  private _buffer: Buffer
  private _parser: OsuDBParser
  private _data: ICollectionData
  private _currentCollection: ICollection | null

  constructor(buffer: Buffer) {
    this._buffer = buffer
    this._parser = new OsuDBParser(null, this._buffer)
    this._data = this._parser.getCollectionData()

    this._currentCollection = null
  }

  /// simple serialization
  private writeString(str: string): Buffer {
    if (!str) return Buffer.from([0x00])

    const stringBuf = Buffer.from(str)
    const length = stringBuf.length
  
    return Buffer.concat([Buffer.from([0x0b, length]), stringBuf])
  }

  private serialize(data: ICollectionData) {
    const bufs: Buffer[] = []
    
    // /osuver
    const versionBuf = Buffer.alloc(4)
    versionBuf.writeInt32LE(data.osuver, 0)
    bufs.push(versionBuf)
  
    // /collection.length
    const collCountBuf = Buffer.alloc(4)
    collCountBuf.writeInt32LE(data.collection.length, 0)
    bufs.push(collCountBuf)
  
    for (const coll of data.collection) {
      if (/[\u00C2\u00C3\u00D0\u00D1]/gi.test(coll.name))
        coll.name = Buffer.from(coll.name, "latin1").toString("utf8")

      bufs.push(this.writeString(coll.name))
  
      const beatmapsCountBuf = Buffer.alloc(4)
      beatmapsCountBuf.writeInt32LE(coll.beatmapsCount, 0)
      bufs.push(beatmapsCountBuf)
  
      for (const md5 of coll.beatmapsMd5) {
        bufs.push(this.writeString(md5))
      }
    }
  
    return Buffer.concat(bufs)
  }

  /// actual functions
  public read(): ICollectionData {
    return this._data
  }

  public select(name: string): boolean {
    const collection = this._data.collection.find((coll) => coll.name == name)
    if (!collection) return false

    this._currentCollection = collection

    return true
  }

  /**
   * finds specific collection by name and returns `ICollection`, otherwise `null`
   * @param name 
   */
  public get(name: string): ICollection | null {
    const collection = this._data.collection.find((coll) => coll.name == name)
    if (!collection) return null

    return collection
  }

  public getCurrent(): ICollection | null {
    return this._currentCollection
  }

  public getBeatmap(md5: string): string | undefined {
    const collection = this._currentCollection
    if (!collection) throw new Error("no collection was selected before adding beatmap somewhere")

    return collection.beatmapsMd5.find((val) => val == md5)
  }

  /**
   * creates a new collection and automatically selects it as current (doesn't automatically apply changes)
   * @param name
   */
  public create(name: string) {
    const data = this._data

    const existingCollection = data.collection.find((coll) => coll.name == name)
    if (existingCollection) {
      this._currentCollection = existingCollection
      return this
    }

    data.collection.push({ name: name, beatmapsCount: 0, beatmapsMd5: [] })
    data.collectionscount += 1

    this._currentCollection = data.collection[data.collection.length - 1]

    return this
  }

  /**
   * adds beatmap to current collection (doesn't automatically apply changes)
   * @param md5 
   */
  public addBeatmap(md5: string): boolean {
    const collection = this._currentCollection
    if (!collection) throw new Error("no collection was selected before adding beatmap somewhere")
    if (collection.beatmapsMd5.find((val) => val == md5)) return false

    collection.beatmapsMd5.push(md5)
    collection.beatmapsCount += 1

    return true
  }

  /**
   * removes a beatmap from current collection (doesn't automatically apply changes)
   * @param md5 
   */
  public removeBeatmap(md5: string): boolean {
    const collection = this._currentCollection
    if (!collection) throw new Error(`no collection was selected before removing beatmap from somewhere`)

    const index = collection.beatmapsMd5.findIndex((collMD5) => collMD5 == md5)
    if (index == -1) return false

    collection.beatmapsMd5.splice(index, 1)
    collection.beatmapsCount -= 1

    return true
  }

  public async save(path: Bun.PathLike): Promise<number> {
    return await Bun.write(path, this.serialize(this._data))
  }
}
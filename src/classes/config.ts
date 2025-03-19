import toml from "toml"

import type { IConfig } from "../types/config"

export class Config {
  /// user-settings
  public mirrorType: "catboy" | "nerinyan" | "okayu" = "catboy"
  public collectionNameFormat: string = "{collection_author} - {collection_title}"

  /// osu!collector
  public collectionId: number = 0
  
  /// osu!
  public songsPath: Bun.PathLike = ""
  public collectionPath: Bun.PathLike = ""

  private validateFields<T extends object>(data: T, requiredFields: (keyof T)[]): void {
    for (const field of requiredFields) {
      if (data[field] == null) {
        throw new Error(`Missing required field: ${String(field)}`);
      }
    }
  }

  public async setup() {
    const file = Bun.file("config.toml")
    const text = await file.text()

    const data = toml.parse(text) as IConfig

    this.validateFields(data, ["user", "collector", "osu"])
    this.validateFields(data.user, ["mirror_type"])
    this.validateFields(data.collector, ["id"])
    this.validateFields(data.osu, ["collection_path", "songs_path"])

    this.mirrorType = data.user.mirror_type as "catboy" | "nerinyan" | "okayu"

    this.collectionId = data.collector.id
    
    this.songsPath = data.osu.songs_path
    this.collectionPath = data.osu.collection_path
  }


}
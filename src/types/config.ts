export interface IConfig {
  user: {
    mirror_type: string
    collection_name_format: string
  }

  collector: {
    id: number
  }

  osu: {
    songs_path: string
    collection_path: string
  }
}
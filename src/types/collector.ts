export interface ICollection {
  id: number // collectionId
  name: string
  description: string | null
  uploader: {
    id: number
    username: string
    rank: number
  }
  dateUploaded: {
    _seconds: number
    _nanoseconds: number // ??? same as _seconds, but divided by 1_000_000_000
  }
  dateUpdated: {
    _seconds: number
    _nanoseconds: number // ??? same as _seconds, but divided by 1_000_000_000
  }
  beatmapCount: number
  favourites: number
  // todo
  comments: []
  unsubmittedBeatmapCount: number
  // todo
  unknownChecksums: []
  // amount of beatmaps in each modeset
  modes: {
    osu: number
    taiko: number
    fruits: number
    mania: number
  }
  difficultySpread: { [starRating: number]: number }
  bpmSpread: { [bpm: number]: number }
}

export type BeatmapStatus = "ranked" | "loved" | "graveyard" | "qualified" | "unranked"

export interface IBeatmap {
  id: number
  beatmapset_id: number
  checksum: string
  version: string // hash
  mode: "osu" | "taiko" | "fruits" | "mania" // todo
  difficulty_rating: number
  accuracy: number // OD
  drain: number // HP
  bpm: number
  cs: number
  ar: number
  hit_length: number
  status: BeatmapStatus
}

export interface IBeatmapset {
  id: number
  creator: string
  artist: string
  artist_unicode: string
  title: string
  title_unicode: string
  bpm: number
  cover: string
  submitted_date: string // ISO String
  last_updated: string // ISO String
  ranked_date: string // ISO String
  favourite_count: number
  status: BeatmapStatus
}

export interface ICollectionBeatmaps {
  beatmaps: IBeatmap[]
  beatmapsets: IBeatmapset[]
}
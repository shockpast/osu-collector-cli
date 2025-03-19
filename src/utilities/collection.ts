import type { ICollection } from "../types/collector"

export function formatName(collection: ICollection, format: string): string {
  return format
    .replaceAll("{collection_author}", collection.uploader.username)
    .replaceAll("{collection_title}", collection.name)
    .replaceAll("{collection_id}", collection.id.toString())
}
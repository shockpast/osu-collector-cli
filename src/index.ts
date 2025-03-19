import { Collection } from "./classes/collection.ts"
import { Collector } from "./classes/collector.ts"
import { Config } from "./classes/config.ts"
import { MirrorFactory } from "./classes/mirrors/factory.ts"
import { Queue } from "./classes/queue.ts"
import { waitForClose } from "./utilities/cli.ts"
import { formatName } from "./utilities/collection.ts"

///
const config = new Config()
await config.setup()

///
const collector = new Collector(config.collectionId)
const collection = new Collection(Buffer.from(await Bun.file(config.collectionPath as string).arrayBuffer()))
const queue = new Queue()
const mirror = MirrorFactory.createMirror(config.mirrorType)

const knownMaps = new Set<number>()

///
const collectionInfo = await collector.getInfo()
const { beatmaps, beatmapsets } = await collector.getBeatmaps()

const currentCollection = collection.create(formatName(collectionInfo, config.collectionNameFormat))

console.log(`[ collector ] ${collectionInfo.name} by ${collectionInfo.uploader.username} (using ${config.mirrorType} as mirror)`)
console.log(`[ collector ] ${beatmaps.length} beatmaps in collection (${beatmapsets.length} beatmapsets)\n`)

while (beatmaps.length >= 1) {
  if (queue.isOccupied()) continue
  queue.incrementProcessed()

  const beatmap = beatmaps.shift()
  if (!beatmap) break

  const beatmapset = beatmapsets.find((set) => set.id == beatmap.beatmapset_id)
  if (!beatmapset || collection.getBeatmap(beatmap.checksum)) continue

  console.log(`[ main@queue ] ${beatmapset.artist} - ${beatmapset.title} [${beatmap.version}] (${queue.getProcessedCount()}/${collectionInfo.beatmapCount})`)

  queue.occupy()

  if (!knownMaps.has(beatmap.beatmapset_id)) {
    const file = await mirror.fetchFile(beatmap.beatmapset_id.toString())
  
    await Bun.write(`${config.songsPath}/${beatmap.beatmapset_id}_${beatmap.id}.osz`, file)
    knownMaps.add(beatmap.beatmapset_id)
  }

  currentCollection.addBeatmap(beatmap.checksum)
  currentCollection.save(config.collectionPath)

  ///#end
  queue.release()
}

///
waitForClose("\n[ main ] done, press any key to exit.")

///
process.on("uncaughtException", async (exception) => {
  console.error("\n", exception)
  console.log("that... shouldn't happen, please report it to me (shockpast)!")

  waitForClose("\n[ main ] done, press any key to exit.")
})
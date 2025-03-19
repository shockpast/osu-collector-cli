import { CatboyMirror } from "./catboy"
import { NerinyanMirror } from "./nerinyan"
import { OkayuMirror } from "./okayu"
import type { Mirror } from "."

export class MirrorFactory {
  static createMirror(mirrorType: "catboy" | "nerinyan" | "okayu"): Mirror {
    switch (mirrorType) {
      case "catboy":
        return new CatboyMirror()
      case "nerinyan":
        return new NerinyanMirror()
      case "okayu":
        return new OkayuMirror()
      default:
        throw new Error(`Unknown mirror type: ${mirrorType}`)
    }
  }
}